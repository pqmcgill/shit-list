import styled, { css } from 'styled-components'
import xs from 'xstream'
import { h } from '@cycle/react'
import { div, p } from '@cycle/react-dom'
import { colors } from '../style'
import ShadowBox from '../components/ShadowBox'
import Button from '../components/Button'
import CollapseExpandButton from '../components/CollapseExpandButton'
import Input from '../components/Input'

const AuthText = styled.span`
  font-weight: 700;
  ${props => props.ok 
    ? css`
      color: ${colors.lightBlue};
    `
    : css`
      color: ${colors.darkRed};
    `
  }
`

const LocalKeySection = styled.div`
  background: ${colors.neutral10};
  padding: 1rem;
`

const Key = styled.div`
  color: ${colors.lightBlue};
  font-size: 1.1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  margin: 1rem 0;
`

const AuthForm = styled.form`
  margin: 0;
  display: flex;
  align-items: center;
`

const Label = styled.label`
  white-space: nowrap;
  margin-right: 0.5rem;
`

const InlineInput = styled(Input)`
  margin-right: 0.5rem;
  flex: 1;
`

function intent(keySrc, hyperSrc, domSrc) {
  const key$ = keySrc

  const archiveReady$ = hyperSrc
    .select('shitlist')
    .archive$

  const authorized$ = hyperSrc
    .select('shitlist')
    .authorized$

  const expandCollapse$ = domSrc
    .select('expand')
    .events('click')

  const copyToClip$ = domSrc
    .select('clip')
    .events('click')
    
  return {
    key$,
    archiveReady$,
    authorized$,
    expandCollapse$,
    copyToClip$
  }
}

function model(actions) {
  const defaultReducer$ = xs.of(function defaultReducer$(prev) {
    return {
      ...prev,
      auth: false,
      localKey: undefined,
      expanded: false
    }
  });

  const localKeyReducer$ = actions.archiveReady$
    .map(archive => function localKeyReducer(prev) {
      return {
        ...prev,
        localKey: archive.db.local.key.toString('hex')
      }
    })

  const authorizedReducer$ = actions.authorized$
    .map(auth => function authorizedReducer(prev) {
      return {
        ...prev,
        auth
      }
    })

  const expandCollapseReducer$ = actions.expandCollapse$
    .mapTo(function expandCollapseReducer(prev) {
      return {
        ...prev,
        expanded: !prev.expanded
      }
    })

  return xs.merge(
    defaultReducer$,
    localKeyReducer$,
    authorizedReducer$,
    expandCollapseReducer$
  )
}

function view(state$) {
  return state$.map(({ auth, localKey, expanded }) => (
    h(ShadowBox, [
      h(CollapseExpandButton, { sel: 'expand', expanded }),
      expanded ? renderExpanded(auth, localKey) : renderCollapsed(auth)
    ])
  ))

  function renderCollapsed(auth) {
    return [
      h(AuthText, { ok: auth }, auth ? 'Authorized' : 'Not Authorized'),
      auth ? ' (Expand to add a writer)' : ' (Expand for more info)'
    ]
  }

  function renderExpanded(auth, localKey) {
    return auth
      ? [
        h(AuthText, { ok: auth }, 'You are authorized to write to this shit list'),
        p(['You can share this shit list to multiple devices or other people. Just copy the URL and paste it into another browser. Other copies may write to this list if you authorize them by passing their "local 🔑" into the form below.']),
        h(AuthForm, [
          h(Label, 'Add a writer:'),
          h(InlineInput),
          h(Button, 'Authorize')
        ])
      ]
      : [ 
        h(AuthText, { ok: auth }, 'You are not currently authorized to write to this shit list.'),
        p('You may edit your local copy, but changes wil not be synchronized until you pass your "local 🔑" to an owner of the document and they authorize you.'),
        h(LocalKeySection, [
          'Your local 🔑 is:',
          h(Key, localKey),
          h(Button, { sel: 'clip' }, 'Copy 🔑 to Clipboard')
        ])
      ]
  }
}

function hyper(actions) {
  return actions.key$.map(key => ({
    type: 'open',
    name: 'shitlist',
    key
  }))
}

function clip(actions) {
  return actions.copyToClip$
    .map(() => actions.archiveReady$.take(1))
    .flatten()
    .map(archive => archive.db.local.key.toString('hex'))
}

export default function AuthStatus(sources) {
  const actions = intent(sources.key$, sources.HYPER, sources.DOM)
  const reducer$ = model(actions)
  const state$ = sources.state.stream
  const dom$ = view(state$)
  const hyper$ = hyper(actions)
  const clip$ = clip(actions)
  return {
    DOM: dom$,
    state: reducer$,
    HYPER: hyper$,
    CLIP: clip$
  }
}
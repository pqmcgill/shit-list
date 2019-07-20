import xs from 'xstream'
import { h } from '@cycle/react'
import { Fragment } from 'react'
import { h2, div, p } from '@cycle/react-dom'
import Input from '../components/Input'
import Button from '../components/Button'

function intent(domSrc, hyperSrc) {
  const linkChange$ = domSrc
    .select('link')
    .events('change')
    .map(e => e.target.value)
    .startWith('')
    .remember()

  const submitLink$ = domSrc
    .select('submitBtn')
    .events('click')
    .map(() => linkChange$.take(1))
    .flatten()
    .remember()

  const archiveReady$ = hyperSrc
    .select('newShitList')
    .archive$
    .map(archive => submitLink$.take(1).mapTo(archive))
    .flatten()
    .map(({ key }) => key.toString('hex'))

  return {
    linkChange$,
    submitLink$,
    archiveReady$
  }
}

function model(actions) {
  const link$ = actions.linkChange$

  const key$ = link$
    .map(link => link.match(/([0-9a-fA-F]{64})\/?$/))
    .map(match => match ? match[1] : false)

  return xs.combine(
    link$,
    key$
  ).map(([ link, key ]) => ({
    link,
    key
  })).remember()
}

function view(state$) {
  return state$.map(state => (
    h(Fragment, [
      h2('Paste in a URL link or a hexadecimal key'),
      div([
        h(Input, { sel: 'link', type: 'text', value: state.link }),
        p([
          h(Button, { sel: 'submitBtn', type: 'submit' }, 'Submit')
        ])
      ])
    ]))
  )
}

function hyper(actions, state$) {
  const createShitList$ = actions.submitLink$
    .map(() => state$
      .filter(({ key }) => !!key)
      .take(1)
      .map(({ key }) => ({
        type: 'open',
        name: 'newShitList',
        key
      }))
    ).flatten()

  return xs.merge(
    createShitList$
  );
}

function navigation(actions) {
  return actions.archiveReady$ 
    .map(key => key)
    .take(1)
    .map(key => `/list/${key}`)
}

export default function CreateList(sources) {
  const actions = intent(sources.DOM, sources.HYPER)
  const state$ = model(actions)
  const nav$ = navigation(actions)
  const hyper$ = hyper(actions, state$)
  const dom$ = view(state$)
  return {
    DOM: dom$,
    HYPER: hyper$,
    router: nav$
  }
}

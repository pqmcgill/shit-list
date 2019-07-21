import xs from 'xstream'
import { h } from '@cycle/react'
import { div, h2, p } from '@cycle/react-dom'
import styled, { css } from 'styled-components'
import ShadowBox from '../components/ShadowBox'
import { colors } from '../style'

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
function intent(hyperSrc, keySrc) {
  const readKey$ = keySrc

  const archiveReady$ = hyperSrc.select('shitlist')
    .archive$
    .take(1)

  const readListName$ = hyperSrc
    .select('shitlist')
    .read('/name.txt')
    .map(data => data.toString())

  return {
    readKey$,
    archiveReady$,
    readListName$
  }
}

function model(actions) {
  return xs.combine(
    actions.readKey$,
    actions.readListName$
  ).map(([key, name]) => ({ 
    archiveKey: key, 
    archiveName: name 
  }))
}

function view(state$) {
  return state$.map(({ archiveKey, archiveName }) => {
    return (
      div([
        h2(archiveName),
        h(ShadowBox, [
          h(AuthText, 'Not Authorized'),
          ' (Expand to add a writer)'
        ])
      ])
    )
  }).startWith('loading...')
}

function level(actions) {
  return actions.readListName$
    .take(1)
    .map(name => actions.archiveReady$.map(archive => ({ name, key: archive.key.toString('hex') })))
    .flatten()
    .map(({ name, key }) => ({
      type: 'put',
      key: `shitlist-${key}`,
      value: name
    }))
}

function hyper(actions) {
  const openArchive$ = actions.readKey$.map(key => ({
    type: 'open',
    name: 'shitlist',
    key
  }));

  const readListName$ = actions.archiveReady$.mapTo({
    type: 'read',
    name: 'shitlist',
    path: '/name.txt',
  })

  return xs.merge(
    openArchive$,
    readListName$
  )
}

export default function List(sources) {
  const actions = intent(sources.HYPER, sources.key$);
  const level$ = level(actions)
  const hyper$ = hyper(actions)
  const dom$ = view(model(actions))

  return {
    DOM: dom$,
    HYPER: hyper$,
    LEVEL: level$
  }
}

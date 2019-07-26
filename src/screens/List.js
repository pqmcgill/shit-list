import xs from 'xstream'
import { h } from '@cycle/react'
import { div, h2 } from '@cycle/react-dom'
import styled from 'styled-components'
import AuthStatus from './AuthStatus2'
import Data from './Data'
import List2 from './List2'

const ShitListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

function intent(hyperSrc, keySrc) {
  const readKey$ = keySrc

  const archiveReady$ = hyperSrc.select('openshitlist')
    .take(1)

  const readListName$ = hyperSrc
    .select('readshitlistname')
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

function view(key$) {
  return key$.map(key => (
    h(List2, { archiveKey: key })
  )).startWith('loading...')
}

export default function List(sources) {
  // const dataSinks = Data(sources)
  // const dataView$ = dataSinks.DOM
  // const dataReducer$ = dataSinks.state
  // const dataHyper$ = dataSinks.HYPER

  const dom$ = view(sources.key$)

  return {
    DOM: dom$
  }
}

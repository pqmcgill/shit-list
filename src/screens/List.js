import xs from 'xstream'
import { div, h2 } from '@cycle/react-dom'
import AuthStatus from './AuthStatus'
import Data from './Data'

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

function view(state$, authView$, dataView$) {
  return xs.combine(state$, authView$, dataView$)
    .map(([ state, authView, dataView ]) => {
    return (
      div([
        h2(state.archiveName),
        authView,
        dataView
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
    category: 'openshitlist',
    key
  }));

  const readListName$ = actions.readKey$.map((key) => ({
    type: 'read',
    category: 'readshitlistname',
    path: '/name.txt',
    key
  }))

  return xs.merge(
    openArchive$,
    readListName$
  )
}

export default function List(sources) {
  const authSinks = AuthStatus(sources)
  const authView$ = authSinks.DOM
  const authReducer$ = authSinks.state
  const authHyper$ = authSinks.HYPER
  const authClip$ = authSinks.CLIP

  const dataSinks = Data(sources)
  const dataView$ = dataSinks.DOM
  const dataReducer$ = dataSinks.state
  const dataHyper$ = dataSinks.HYPER

  const actions = intent(sources.HYPER, sources.key$)
  const level$ = level(actions)
  const listHyper$ = hyper(actions)
  const dom$ = view(model(actions), authView$, dataView$)
  
  const hyper$ = xs.merge(
    listHyper$, 
    authHyper$,
    dataHyper$
  )

  const reducer$ = xs.merge(
    authReducer$,
    dataReducer$
  )

  return {
    DOM: dom$,
    HYPER: hyper$,
    LEVEL: level$,
    state: reducer$,
    CLIP: authClip$
  }
}

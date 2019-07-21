import xs from 'xstream'
import { div, h2 } from '@cycle/react-dom'
import AuthStatus from './AuthStatus'

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

function view(state$, authView$) {
  return xs.combine(state$, authView$)
    .map(([ state, authView ]) => {
    return (
      div([
        h2(state.archiveName),
        authView
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
  const authSinks = AuthStatus(sources)
  const authView$ = authSinks.DOM
  const authReducer$ = authSinks.state
  const authHyper$ = authSinks.HYPER
  const authClip$ = authSinks.CLIP

  const actions = intent(sources.HYPER, sources.key$);
  const level$ = level(actions)
  const listHyper$ = hyper(actions)
  const dom$ = view(model(actions), authView$)
  const hyper$ = xs.merge(listHyper$, authHyper$)

  return {
    DOM: dom$,
    HYPER: hyper$,
    LEVEL: level$,
    state: authReducer$,
    CLIP: authClip$
  }
}

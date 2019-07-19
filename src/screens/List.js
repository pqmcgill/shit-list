import xs from 'xstream'
import { div, h2, p } from '@cycle/react-dom'

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
  ).map(([key, name]) => ({ key, name }))
}

function view(state$) {
  return state$.map(({ archiveKey, archiveName }) => {
    return (
      div([
        h2(archiveName),
        p(`key: ${archiveKey}`)
      ])
    )
  })
}

function level(actions) {
  return actions.listName$
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

  const readListName$ = actions.readKey$.mapTo({
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
  const actions = intent(sources.HYPER);
  const level$ = level(actions)
  const hyper$ = hyper(actions)
  const dom$ = view(model(actions))

  return {
    DOM: dom$,
    HYPER: hyper$,
    LEVEL: level$
  }
}

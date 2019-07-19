import xs from 'xstream'
import { div, h2, p } from '@cycle/react-dom'

export default function List(sources) {
  const { key$ } = sources

  const archiveReady$ = sources.HYPER
    .select('shitlist')
    .archive$
    .take(1)
    .subscribe({})

  const openArchive$ = key$.map(key => ({
    type: 'open',
    name: 'shitlist',
    key
  }));

  const readListName$ = key$.map(key => ({
    type: 'read',
    name: 'shitlist',
    path: '/name.txt',
  }))

  const listName$ = sources.HYPER
    .select('shitlist')
    .read('/name.txt')
    .map(data => data.toString())

  return {
    DOM: xs.combine(key$, listName$)
      .map(([key, name]) => (div([
        h2(name),
        p(`key: ${key}`)
      ]))),
    HYPER: xs.merge(
      openArchive$,
      readListName$
    )
  }
}

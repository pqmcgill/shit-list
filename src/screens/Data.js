import xs from 'xstream'
import { div, button } from '@cycle/react-dom';

export default function Data(sources) {
  const state$ = sources.state.stream
  const actions = intent(sources.key$, sources.HYPER, sources.DOM)
  const reducer$ = model(actions)
  const dom$ = view(state$)
  const hyper$ = hyper(actions)

  return {
    DOM: dom$,
    state: reducer$,
    HYPER: hyper$
  }
}

function intent(keySrc, hyperSrc, domSrc) {
  const key$ = keySrc

  const archiveReady$ = hyperSrc
    .select('open')
    .take(1)
    .remember()

  const readdirResponse$ = hyperSrc
    .select('readdir')
    .debug('ls')
    .subscribe({})

  const writeResponse$ = hyperSrc
    .select('testWrite')
    .map(() => archiveReady$)
    .flatten()

  return {
    archiveReady$,
    key$,
    readdirResponse$,
    writeResponse$
  }
}

function model(actions) {
  return xs.empty()
}

function view(state$) {
  return xs.of(
    div('Data')
  )
}

function hyper(actions) {
  const readdirRequest$ = xs.merge(
    actions.archiveReady$.take(1),
    actions.writeResponse$
  ).map(({ key }) => ({
      type: 'readdir',
      category: 'readdir',
      path: '/data',
      key
    }))

  return xs.merge(
    readdirRequest$
  )
}
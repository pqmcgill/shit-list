import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { div } from '@cycle/react-dom';
import { today, nextDay, previousDay } from '../lib/day'

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
  const defaultReducer$ = xs.of(
    function defaultReducer(prev) {
      return {
        day: nextDay(today())
      }
    }
  )
  return xs.merge(
    defaultReducer$
  )
}

function view(state$) {
  return state$.map(state => ([
    div('Data'),
    state.day
  ]))
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

  const write$ = actions.archiveReady$
    .take(1)
    .map(({ key }) => ({
      type: 'write',
      category: 'testWrite',
      path: '/data/foo.bar',
      data: 'helloworld',
      key
    }))
    .compose(delay(3000))

  return xs.merge(
    readdirRequest$,
    write$
  )
}
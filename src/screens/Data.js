import xs from 'xstream'
import debounce from 'xstream/extra/debounce'
import delay from 'xstream/extra/delay'
import { h } from '@cycle/react'
import { div, button } from '@cycle/react-dom';
import { today, nextDay, previousDay } from '../lib/day'
import styled from 'styled-components'
import DayNav from '../components/DayNav';
import AddEvent from './AddEvent'

const DataList = styled.div`
  flex: 1;
`

export default function Data(sources) {
  const addEventSinks = AddEvent(sources)
  const addEventDom$ = addEventSinks.DOM
  const submit$ = addEventSinks.submit$

  const state$ = sources.state.stream
  const actions = intent(sources.key$, sources.HYPER, sources.DOM)
  const reducer$ = model(actions)
  const dom$ = view(state$, addEventDom$)
  const hyper$ = hyper(actions, state$, submit$)

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
    .replaceError(err => xs.of('whoops'))
    .map(obj => Object.entries(obj).map(([key, val]) => val.data.toString()))
    .subscribe({})

  const writeResponse$ = hyperSrc
    .select('testWrite')
    .map(() => archiveReady$)
    .flatten()
    .debug('here')

  const dayChange$ = domSrc
    .select('dayNav')
    .events('change')

  const click$ = domSrc
    .select('btn')
    .events('click')

  return {
    archiveReady$,
    key$,
    readdirResponse$,
    writeResponse$,
    dayChange$,
    click$
  }
}

function model(actions) {
  const defaultReducer$ = xs.of(
    function defaultReducer(prev) {
      return {
        day: today(),
        key: null,
        isAdding: false
      }
    }
  )

  const dayReducer$ = actions.dayChange$
    .map(day => function dayReducer(prev) {
      return {
        ...prev,
        day 
      }
    })

  const keyReducer$ = actions.archiveReady$
    .map(({ key }) => function keyReducer(prev) {
      return {
        ...prev,
        key: key.toString('hex')
      }
    })

  const isAddingReducer$ = actions.click$
    .map(() => (
      function isAddingReducer(prev) {
        return {
          ...prev,
          isAdding: true
        }
      }
    ))

  return xs.merge(
    defaultReducer$,
    keyReducer$,
    dayReducer$,
    isAddingReducer$
  )
}

function view(state$, addEventDom$) {
  return xs.combine(state$, addEventDom$).map(([state, addEventDom]) => ([
    div('Data'),
    h(DataList, [
      button({ sel: 'btn' }, 'Click!')
    ]),
    h(DayNav, { sel: 'dayNav' }),
    state.isAdding && addEventDom
  ]))
}

function hyper(actions, state$, submit$) {
  const readdirRequest$ = xs.merge(
    xs.combine(
      actions.key$.take(1),
      actions.dayChange$,
    ),
    actions.writeResponse$
  ).map(() => state$.take(1))
  .flatten()
  .filter(({ key, day }) => key && day)
  .map(({ key, day }) => ({
    type: 'readdir',
    category: 'readdir',
    path: `/data/${day.split('/').join('-')}`,
    key
  }))
  .compose(debounce(1000))
  .debug('readdir')

  const write$ = submit$
    .map((data) => JSON.stringify(data))
    .map(data => state$.map(state => ({ ...state, data })).take(1))
    .flatten()
    .filter(({ key, day }) => key && day)
    .map(({ key, day, data }) => ({
      type: 'write',
      category: 'testWrite',
      path: `/data/${day.split('/').join('-')}/${Date.now()}.json`,
      data,
      key
    }))
    .debug('writeTest')

  return xs.merge(
    readdirRequest$,
    write$
  )
}
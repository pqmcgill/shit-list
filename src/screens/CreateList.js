import xs from 'xstream'
import { h } from '@cycle/react'
import { Fragment } from 'react'
import { h2, div, p } from '@cycle/react-dom'
import Input from '../components/Input'
import Button from '../components/Button'

function intent(domSrc, hyperSrc) {
  const nameChange$ = domSrc
    .select('name')
    .events('change')
    .map(e => e.target.value)
    .startWith('')
    .remember()

  const submitName$ = domSrc
    .select('submitBtn')
    .events('click')
    .map(() => nameChange$.take(1))
    .flatten()
    .remember()

  const archiveReady$ = hyperSrc
    .select('newShitList')
    .archive$
    .map(archive => submitName$.take(1).mapTo(archive))
    .flatten()
    .map(({ key }) => key.toString('hex'))

  return {
    nameChange$,
    submitName$,
    archiveReady$
  }
}

function model(actions) {
  return actions.nameChange$
    .map(name => ({ name }))
    .remember()
}

function view(state$) {
  return state$.map(state => (
    h(Fragment, [
      h2('Enter a name for you new shit list'),
      div([
        h(Input, { sel: 'name', type: 'text', value: state.name }),
        p([
          h(Button, { sel: 'submitBtn', type: 'submit' }, 'Submit')
        ])
      ])
    ]))
  )
}

function hyper(actions) {
  const createShitList$ = actions.submitName$
    .map(() => ({
      type: 'open',
      name: 'newShitList'
    }))

  const writeName$ = actions.archiveReady$
    .map(() => actions.nameChange$.take(1))
    .flatten()
    .map(name => ({
      type: 'write',
      name: 'newShitList',
      path: '/name.txt',
      data: name
    }));

  return xs.merge(
    createShitList$,
    writeName$
  );
}

function navigation(actions) {
  return actions.archiveReady$
    .take(1)
    .map(key => `/list/${key}`)
}

export default function CreateList(sources) {
  const actions = intent(sources.DOM, sources.HYPER)
  const state$ = model(actions)
  const nav$ = navigation(actions)
  const hyper$ = hyper(actions)
  const dom$ = view(state$)
  return {
    DOM: dom$,
    HYPER: hyper$,
    router: nav$
  }
}

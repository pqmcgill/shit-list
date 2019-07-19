import xs from 'xstream'
import { h } from '@cycle/react'
import { Fragment } from 'react'
import { h2, div, p } from '@cycle/react-dom'
import styled from 'styled-components'
import { colors } from '../style'
import Input from '../components/Input'
import Button from '../components/Button'

function intent(domSrc, hyperSrc, levelSrc) {
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
    .map(({ key }) => key.toString('hex'))

  return {
    nameChange$,
    submitName$,
    archiveReady$
  }
}

function model(actions) {
  const name$ = actions.nameChange$

  return xs.combine(
    name$,
  ).map(([ name, key ]) => ({
    name,
  })).remember()
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

function hyper(actions, state$) {
  const createShitList$ = actions.submitName$
    .map(() => ({
      type: 'open',
      name: 'newShitList'
    }))

  const writeName$ = actions.archiveReady$
    .map(() => actions.submitName$)
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

function level(actions, state$) {
  return actions.archiveReady$
    .map(key => actions.submitName$
      .map(name => ({ name, key }))
    )
    .flatten()
    .map(({ name, key }) => ({
      type: 'put',
      key: `shitlist-${key}`,
      value: name
    }))
}

export default function CreateList(sources) {
  const actions = intent(sources.DOM, sources.HYPER, sources.LEVEL)
  const state$ = model(actions)
  const level$ = level(actions, state$)
  const nav$ = level$.map(() => actions.archiveReady$.map(key => key).take(1)).flatten().map(key => `/list/${key}`)
  const hyper$ = hyper(actions, state$)
  const dom$ = view(state$)
  return {
    DOM: dom$,
    HYPER: hyper$,
    LEVEL: level$,
    router: nav$
  }
}

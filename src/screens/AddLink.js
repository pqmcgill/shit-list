import xs from 'xstream'
import { h } from '@cycle/react'
import { Fragment } from 'react'
import { h2, div, p } from '@cycle/react-dom'
import styled from 'styled-components'
import { colors } from '../style'
import Input from '../components/Input'
import Button from '../components/Button'

function intent(domSrc, hyperSrc, levelSrc) {
  const linkChange$ = domSrc
    .select('link')
    .events('change')

  const submitLink$ = domSrc
    .select('submitBtn')
    .events('click')

  const archiveReady$ = hyperSrc
    .select('newShitList')
    .archive$
    .map(({ key }) => key.toString('hex'))

  return {
    linkChange$,
    submitLink$,
    archiveReady$
  }
}

function model(actions) {
  const link$ = actions.linkChange$
    .map(e => e.target.value)
    .startWith('')

  const key$ = link$
    .map(link => link.match(/([0-9a-fA-F]{64})\/?$/))
    .map(match => match ? match[1] : false)

  return xs.combine(
    link$,
    key$
  ).map(([ link, key ]) => ({
    link,
    key
  })).remember()
}

function view(state$) {
  return state$.map(state => (
    h(Fragment, [
      h2('Paste in a URL link or a hexadecimal key'),
      div([
        h(Input, { sel: 'link', type: 'text', value: state.link }),
        p([
          h(Button, { sel: 'submitBtn', type: 'submit' }, 'Submit')
        ])
      ])
    ]))
  )
}

function hyper(actions, state$) {
  const createShitList$ = actions.submitLink$
    .map(() => state$
      .filter(({ key }) => !!key)
      .take(1)
      .map(({ key }) => ({
        type: 'open',
        name: 'newShitList',
        key
      }))
    ).flatten()

  return xs.merge(
    createShitList$
  );
}

function level(actions, state$) {
  return actions.archiveReady$
    .map(key => state$
      .take(1)
      .map(({ name }) => ({ name, key }))
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

import xs from 'xstream'
import { h } from '@cycle/react'
import { p, div, h3 } from '@cycle/react-dom'
import { makeCollection } from '@cycle/state'
import styled from 'styled-components'
import { colors } from '../style'
import ShadowBox from '../components/ShadowBox'
import Button from '../components/Button'

const WelcomeHeader = styled.h4`
  margin: 0.5rem 1rem 1rem 1rem;
  font-size: 1.3rem;
  text-align: center;
`

const Bold = styled.b`
  color: ${colors.darkBlue};
`

const Lists = styled.ul`
  padding: 0;
`

const List = styled.li`
  list-style-type: none;
  border: solid 2px ${colors.lightBlue};
  border-radius: 0.5rem;
  margin: 0 0 0.5rem 0;
  padding: 0 0.5rem;
  min-height: 3rem;
  position: relative;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  color: ${colors.darkBlue};
  transform: translateZ(0);
  transition: transform .25s ease-out;

  &:active {
    transform: scale(0.9)
  }

  &:hover {
    transform: scale(1.03);
  }
` 

const NoListMsg = styled.div`
  display: flex;
  justify-content: center;
`

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 1rem;
`

const CreateBtn = styled(Button)`
  height: 4rem;
`

const AddLinkBtn = styled(Button)`
  margin-top: 1rem;
  height: 2.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${colors.lightBlue};
  background-color: ${colors.white};
  border-color: ${colors.lightBlue};
`

function view(state$, listDom$) {
  return xs.combine(state$, listDom$)
    .map(([shitLists, listDom]) => (
      div([
        h(ShadowBox, [
          h(WelcomeHeader, 'Welcome to ShitList!'),
          p(['Shit lists are useful for collecting data on your newborn\'s ',
            h(Bold, 'eating,'), 
            ' ',
            h(Bold, 'sleeping,'), 
            ' and ',
            h(Bold, 'pooping'),
            ' habits.'
          ]),
          p(['Easily share your lists with your friends and family!']),
        ]),

        shitLists.length 
          ? listDom
          : h(NoListMsg,'You don\'t have any shit lists. Why don\'t you create one?'),

        h(BtnWrapper, [
          h(CreateBtn, { sel: 'createBtn' }, 'Create a new list'),
          h(AddLinkBtn, { sel: 'addLinkBtn' }, 'Link an existing list')
        ])
      ])
    ))
}

function model(actions) {
  const defaultReducer$ = xs.of(
    function defaultReducer(prev) {
      return []
    }
  )

  const listsReducer$ = actions.getShitLists$$
    .flatten()
    .map(shitLists => function listReducer(prev) {
      return shitLists
        .map(({ key, value }) => ({
          key: key.toString(),
          name: value.toString()
        }))
    })

  return xs.merge(
    defaultReducer$,
    listsReducer$
  )
}

function navigation(actions) {
  const navToCreate$ = actions.createBtnClick$
    .mapTo('/create')

  const navToAddLink$ = actions.addLinkBtnClick$
    .mapTo('/addlink')

  return xs.merge(
    navToCreate$,
    navToAddLink$
  )
}

function intent(levelSrc, domSrc) {
  const createBtnClick$ = domSrc
    .select('createBtn')
    .events('click')

  const addLinkBtnClick$ = domSrc
    .select('addLinkBtn')
    .events('click')

  const getShitLists$$ = levelSrc.read('lists')

  return {
    createBtnClick$,
    addLinkBtnClick$,
    getShitLists$$
  }
}

// TODO: doesn't work. fix!
function level() {
  return xs.of({
    name: 'lists',
    type: 'query',
    options: { gt: 'shitlist-', lt: 'shitlist-\xff' }
  })
}

function ShitListItem(sources) {
  const dom$ = sources.state.stream
    .map(({ name, key }) => 
      h(List, { key, sel: 'li' }, `${name}`)
    ) 

  const click$ = sources.DOM.select('li')
    .events('click')

  const nav$ = click$.map(() => sources.state.stream.take(1))
    .flatten()
    .map(({ key }) => `/list/${key.split('-')[1]}`)

  return {
    DOM: dom$,
    router: nav$
  }
}

export default function Home(sources) {
  const List = makeCollection({
    item: ShitListItem,
    itemKey: (state, index) => String(index),
    itemScope: key => key,
    collectSinks: instances => {
      return {
        DOM: instances.pickCombine('DOM').map(listDom => div([
          h3('Your Lists'),
          listDom
        ])),
        state: instances.pickMerge('state'),
        router: instances.pickMerge('router')
      }
    }
  })

  const listSinks = List(sources)

  const actions = intent(
    sources.LEVEL,
    sources.DOM
  )

  const homeReducer$ = model(actions)
  const homeNav$ = navigation(actions)
  const level$ = level()

  const dom$ = view(
    sources.state.stream, 
    listSinks.DOM
  )

  const reducer$ = xs.merge(
    homeReducer$, 
    listSinks.state
  )

  const nav$ = xs.merge(
    homeNav$, 
    listSinks.router
  )

  return {
    DOM: dom$,
    router: nav$,
    LEVEL: level$,
    state: reducer$
  }
}

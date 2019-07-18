import xs from 'xstream'
import { h } from '@cycle/react'
import { p, div } from '@cycle/react-dom'
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
  color: ${colors.lightBlue};
`

const Lists = styled.ul`
  padding: 0;
`

const List = styled.li`
  list-style-type: none;
  border: solid 2px ${colors.neutral20};
  border-radius: 0.5rem;
  margin: 0 0 0.5rem 0;
  padding: 0 0.5rem;
  min-height: 3rem;
  position: relative;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  color: ${colors.darkRed};
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

function view(state$) {
  return state$.map(({ lists }) => (
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
      renderLists(lists)
    ])
  ))

  function renderLists(lists) {
    const hasLists = !!lists.length
    return h(Lists, [
      hasLists
      ? lists.map(({ name, key }) => 
        h(List, `${name}`)) 
      : h(NoListMsg,'You don\'t have any shit lists. Why don\'t you create one?'),

      h(BtnWrapper, [
        h(CreateBtn, { sel: 'createBtn' }, 'Create a new list'),
        h(AddLinkBtn, { sel: 'addLinkBtn' }, 'Link an existing list')
      ])
    ])
  }
}

function model(actions) {
  const list$ = actions.getPersistedList$$
    .map(persistedList$ => persistedList$
      .debug('lists')
    )
    .flatten()
    .debug('data')
    .startWith([])

  return list$.map(lists => ({ 
    lists
  }))
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

  const getPersistedList$$ = levelSrc.read('lists')

  return {
    createBtnClick$,
    addLinkBtnClick$,
    getPersistedList$$
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

export default function Home(sources) {
  const actions = intent(
    sources.LEVEL,
    sources.DOM
  )

  const dom$ = view(model(actions))
  const nav$ = navigation(actions)
  const level$ = level()

  return {
    DOM: dom$,
    router: nav$,
    LEVEL: level$
  }
}

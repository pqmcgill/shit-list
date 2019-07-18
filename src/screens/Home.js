import xs from 'xstream'
import { h } from '@cycle/react'
import { h3, div } from '@cycle/react-dom'
import styled from 'styled-components'
import { colors } from '../style'

const Lists = styled.ul`
  padding: 0;
`

const List = styled.li`
  list-style-type: none;
  border: solid 2px ${colors.pink};
  border-radius: 1rem;
  margin: 1rem 0;
  padding: 1rem;
` 

const CreateBtn = styled.button`
  border: none;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: solid 2px ${colors.blue};
  display: flex;
  font-size: 1rem;
  justify-content: center;
  align-items: center;
`

const NoListMsg = styled.div`
  display: flex;
  justify-content: center;
`

function view(state$) {
  return state$.map(({ lists, hasLists }) => (
  div([
    h(Lists, [
      hasLists
        ? lists.map(({ name, key }) => 
            h(List, `${name}: ${key}`)) 
        : h(NoListMsg,'You don\'t have any shit lists. Why don\'t you create one?'),
      
      h(CreateBtn, { sel: 'createBtn' }, `+`)
    ])
  ])
  ))
}

function model(actions) {
  const list$ = actions.getPersistedList$$
    .map(persistedList$ => persistedList$
      .map(list => list.toString().split(',')
        .map(keyNameStr => {
          const [name, key] = keyNameStr.split(':')
          return { name, key }
        })))
    .flatten()
    .startWith([])

  return list$.map(lists => ({ 
    lists,
    hasLists: !!lists.length
  }))
}

function navigation(actions) {
  const navToCreate$ = actions.createBtnClick$
    .mapTo('/create')
  return navToCreate$
}


function intent(levelSrc, domSrc) {
  const createBtnClick$ = domSrc
    .select('createBtn')
    .events('click')

  const getPersistedList$$ = levelSrc.read('lists')

  return {
    createBtnClick$,
    getPersistedList$$
  }
}

export default function Home(sources) {
  const actions = intent(
    sources.LEVEL,
    sources.DOM
  )

  const dom$ = view(model(actions))
  const nav$ = navigation(actions)

  return {
    DOM: dom$,
    router: nav$
  }
}

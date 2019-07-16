import xs from 'xstream'
import { h } from '@cycle/react'
import { div, h1, ul, li } from '@cycle/react-dom'
import styled from 'styled-components'
import { colors } from '../style'

const Header = styled.h3`
  color: ${colors.neutral}
`

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

export default function Home(sources) {
  const readLists$$ = sources.LEVEL.read('lists')

  const list$ = readLists$$
    .map(req$ => req$
      .map(listData => listData
        .toString()
        .split(',')
        .map(listKeyName => {
          const [name, key] = listKeyName.split(':')
          return { name, key }
        })
      )
      .replaceError(err => xs.of([]))
    )
    .flatten()
    .startWith([])

  const dom$ = list$.map(lists => (
    div([
      h(Header, 'My lists'),
      h(Lists, [
        lists.length  
          ? lists.map(({ name, key }) => (
            h(List, `${name}: ${key}`)
          ))
          : 'You don\'t have any lists. Why don\'t you create one?'
      ])
    ])
  ))

  return {
    DOM: dom$
  }
}


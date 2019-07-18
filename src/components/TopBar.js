import xs from 'xstream'
import { h } from '@cycle/react'
import styled from 'styled-components'
import { colors, emojis } from '../style'

const Header = styled.nav`
  display: flex;
  flex: 0 64px;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 500;
  padding: 0 1rem;
  border: solid ${colors.pink} 2px;
  border-radius: 1rem;
`

export default function TopBar(sources) {
  const dom$ = xs.of(
    h(Header, [
      `${emojis.poop} ShitList`
    ])
  )
  return {
    DOM: dom$
  }
}

import xs from 'xstream'
import { h } from '@cycle/react'
import styled from 'styled-components'
import { colors, emojis } from '../style'

const Header = styled.nav`
  display: flex;
  flex: 0 64px;
  font-size: 1.5rem;
  font-weight: 700;
  padding: 0 1rem;
  color: ${colors.darkBlue};
  border-bottom: solid 1px ${colors.neutral10};
`

const Logo = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: opacity .15s ease-in;
  color: ${colors.lightRed};
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`

const FirstWord = styled.span`
color: #8E3B46;
`

export default function TopBar(sources) {
  const logoClick$ = sources.DOM
    .select('logo')
    .events('click')

  const navToHome$ = logoClick$
    .mapTo('/home')

  const dom$ = xs.of(
    h(Header, [
      h(Logo, { sel: 'logo' }, [
        `${emojis.poop} `,
        h(FirstWord,'Shit'),
        'List'
      ])
    ])
  )
  return {
    DOM: dom$,
    router: navToHome$
  }
}

import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
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

const Logo = styled(Link)`
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
  color: ${colors.darkRed};
`

export default function TopBar() {
  return (
    <Header>
      <Logo to='/home'>
        {`${emojis.poop} `}
        <FirstWord>Shit</FirstWord>
        List
      </Logo>
    </Header>
  )
}
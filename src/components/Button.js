import styled, { css } from 'styled-components'
import { colors } from '../style'

const Button = styled.button`
  color: ${colors.white};
  background-color: ${colors.lightBlue};
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: inline-block;
  backface-visibility: hidden;
  transform: translateZ(0);
  transition: transform .25s ease-out;
  border-color: transparent;
  border-radius: 1em;
  cursor: pointer;
  outline: none;

  &:active {
    ${props => !props.disabled && css`
      transform: scale(0.9)
    `}
  }

  &:hover {
    ${props => !props.disabled && css`
      transform: scale(1.05);
    `}
  }

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: progress;
  `}
`

export default Button

import styled, { css } from 'styled-components'
import { colors } from '../style'

const CollapseExpandButton = styled.div`
  position: absolute;
  top: -0.8rem;
  right: 0.6rem;
  z-index: 1;
  font-size: 0.8rem;
  cursor: pointer;
  color: ${colors.lightBlue};
  background: ${colors.white};
  border: 2px solid ${colors.neutral10};
  border-radius: 0.8rem;
  width: 5rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.expanded ?
    css`
      &::before { content: "⬆️ Collapse"; }
    ` :
    css`
      &::before { content: "⬇️ Expand"; }
    `
  }
`

export default CollapseExpandButton
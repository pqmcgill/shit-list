import xs from 'xstream'
import { h } from '@cycle/react'
import { Fragment } from 'react'
import { h2, form, p } from '@cycle/react-dom'
import styled from 'styled-components'
import { colors } from '../style'
import Button from '../components/Button'

const Input = styled.input`
  width: 100%;
  font-size: 1.5rem;
  outline-color: ${colors.lightBlue};
`
export default function CreateList(sources) {
  const dom$ = xs.of(h(Fragment, [
    h2('Enter a name for you new shit list'),
    form([
      h(Input, { type: 'text' }),
      p([
        h(Button, { type: 'submit' }, 'Submit')
      ])
    ])
  ]))

  return {
    DOM: dom$
  }
}

import React, { useState, useEffect } from 'react'
import { today, nextDay, previousDay } from '../lib/day'
import styled from 'styled-components'
import { colors } from '../style';

const Footer = styled.div`
  background-color: ${colors.darkBlue};
  flex: 0 64px;
  margin: 0 -1rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${colors.white}
`

export default function DayNav(props) {
  const [day, setDay] = useState(today())
  const noOp = () => {}
  const onChange = props.onChange || noOp

  useEffect(() => {
    console.log('change', day)
    onChange(day)
  }, [day])

  function handlePrev() {
    setDay(previousDay(day))
  }

  function handleNext() {
    setDay(nextDay(day))
  }

  return (
    <Footer>
      <span onClick={handlePrev}>previous</span>
      <span>today: ({day})</span>
      <span onClick={handleNext}>next</span>
    </Footer>
  )
}
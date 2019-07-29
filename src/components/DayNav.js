import React, { useState } from 'react'
import { today, nextDay, previousDay } from '../lib/day'
import styled from 'styled-components'
import { colors } from '../style';
import Button from './Button';

const Footer = styled.div`
  background-color: ${colors.lightBlue};
  flex: 0 64px;
  margin: 0 -1rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${colors.white};
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
`

const DayButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.lightBlue};
`

const Day = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
`

export default function DayNav(props) {
  const [day, setDay] = useState(today())

  const prettyDay = day.split('-').join('/')

  function handlePrev() {
    setDay(previousDay(day))
    props.onChange(day)
  }

  function handleNext() {
    setDay(nextDay(day))
    props.onChange(day)
  }

  return (
    <Footer>
      <DayButton onClick={handlePrev}>previous</DayButton>
      <Day>{prettyDay}</Day>
      <DayButton onClick={handleNext}>next</DayButton>
    </Footer>
  )
}
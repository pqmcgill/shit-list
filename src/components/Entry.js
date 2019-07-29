import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { colors } from '../style'

export const StyledEntry = styled.li`
  list-style: none;
  border-style: solid;
  border-width: 2px;
  border-color: ${props => props.color || colors.neutral};
  color: ${props => props.color || colors.neutral};
  display: flex;
  flex-direction: column;
  padding: 1rem 1rem 0 1rem;
  border-radius: 1rem;
  margin: 1rem 0;
`

const MoreOrLess = styled.div`
  display: flex;
  justify-content: center;
  font-size: 0.8rem;
  color: ${colors.neutral30};
  cursor: pointer;
  &:hover {
    color: inherit;
  }
`

const InlineData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
`

export function ExpandableEntry(props) {
  const {
    children,
    color
  } = props

  const [expanded, toggleExpanded] = useState(false)

  function handleClick() {
    toggleExpanded(!expanded)
  }

  return (
    <StyledEntry color={color} onClick={handleClick}>
      { children(expanded) }
      <MoreOrLess>
        { expanded ? '-- less --' : '-- more --' }
      </MoreOrLess>
    </StyledEntry>
  )
}

export function DiaperEntry(props) {
  let emojiStr = ''
  if (props.wet) emojiStr += '💧'
  if (props.poo) emojiStr += '💩'
  if (!props.wet && !props.poo) emojiStr += '🏜️'
  
  const Collapsed = () => (
    <InlineData>
      <span>
        Diaper - {emojiStr}
      </span>
      <span>{ props.eventTime }</span>
      <span>Logged by: { props.loggedBy }</span>
    </InlineData>
  )

  return (
    <ExpandableEntry color={colors.darkRed}>
      {(expanded) => (
        !expanded
          ? <Collapsed />
          : (
            <Fragment>
              <Collapsed />
              {props.poo && <div>TODO: color picker</div>}
              <div>{ props.notes }</div>
            </Fragment>
          )
      )}
    </ExpandableEntry>
  )
}

export function BottleFeedingEntry(props) {
  const Collapsed = () => (
    <InlineData>
      <span>
        Feeding - 🍼
      </span>
      <span>{ props.eventTime }</span>
      <span>Logged by: { props.loggedBy }</span>
    </InlineData>
  )

  return (
    <ExpandableEntry color={colors.pink}>
      {(expanded) => (
        !expanded
          ? <Collapsed />
          : (
            <Fragment>
              <Collapsed />
              <div>{ props.volume }</div>
              <div>{ props.notes }</div>
            </Fragment>
          )
      )}
    </ExpandableEntry>
  )
}

export function BreastFeedingEntry(props) {
  const Collapsed = () => (
    <InlineData>
      <span>
        Feeding - 🤱
      </span>
      <span>{ props.eventTime }</span>
      <span>Logged by: { props.loggedBy }</span>
    </InlineData>
  )

  return (
    <ExpandableEntry color={colors.pink}>
      {(expanded) => (
        !expanded
          ? <Collapsed />
          : (
            <Fragment>
              <Collapsed />
              <div>Left - { props.leftBreastDuration } Right - { props.rightBreastDuration}</div>
              <div>{ props.notes }</div>
            </Fragment>
          )
      )}
    </ExpandableEntry>
  )
}

export function SleepingEntry(props) {
  const Collapsed = () => (
    <InlineData>
      <span>
        Sleep - 💤
      </span>
      <span>{ props.startTime } - { props.endTime }</span>
      <span>Logged by: { props.loggedBy }</span>
    </InlineData>
  )

  return (
    <ExpandableEntry color={colors.purple}>
      {(expanded) => (
        !expanded
          ? <Collapsed />
          : (
            <Fragment>
              <Collapsed />
              <div>{ props.notes }</div>
            </Fragment>
          )
      )}
    </ExpandableEntry>
  )
}

export default function Entry(props) {
  if (props.type === 'diaper') {
    switch(props.diaperType) {
      case 'dirty':
        return <DiaperEntry poo {...props} />
      case 'mixed':
        return <DiaperEntry poo wet {...props} />
      case 'wet':
        return <DiaperEntry wet {...props} />
      default:
        return <DiaperEntry {...props} />
    }
  } else if (props.type === 'feeding') {
    if (props.feedingType === 'bottle') {
      return <BottleFeedingEntry {...props} />
    } else {
      return <BreastFeedingEntry {...props} />
    }
  } else if (props.type === 'sleep') {
    return <SleepingEntry {...props} />
  } else {
    return 'unknown entry type'
  }
}
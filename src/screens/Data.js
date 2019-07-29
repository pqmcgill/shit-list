import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import DayNav from '../components/DayNav'
import CreateEventForm from '../components/CreateEventForm'
import { today } from '../lib/day'
import Button from '../components/Button'
import Entry from '../components/Entry'
import { colors } from '../style'

const DataList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
`

const EnterDataButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.lightBlue};
  border: solid 2px ${colors.lightBlue};
  height: 1em;
  width: 1em;
  font-size: 4rem;
  font-weight: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 0;
  padding-bottom: 0.25em;
`

const Entries = styled.ul`
  padding: 0;
  margin: 0;
`

const mockData = [
  {
    type: 'diaper',
    diaperType: 'dirty',
    eventTime: '10:02 - AM',
    loggedBy: 'Pat',
    notes: 'fascinating! Hard to believe this came out of that!'
  },
  {
    type: 'diaper',
    diaperType: 'wet',
    eventTime: '10:25 - AM',
    loggedBy: 'Pat',
    notes: 'I think I got the hang of this'
  },
  {
    type: 'sleep',
    startTime: '2:30',
    endTime: '2:31 - PM',
    loggedBy: 'Sam',
    notes: 'holy hell, just go to sleep!'
  },
  {
    type: 'diaper',
    diaperType: 'mixed',
    eventTime: '10:56 - AM',
    loggedBy: 'Pat',
    notes: 'When will it end!?'
  },
  {
    type: 'diaper',
    diaperType: 'dry',
    eventTime: '11:01 - AM',
    loggedBy: 'Pat',
    notes: 'FOR THE LOVE OF GOD!!!'
  },
  {
    type: 'feeding',
    feedingType: 'bottle',
    eventTime: '12:20 - PM',
    loggedBy: 'Sam',
    volume: '100 - ML',
    notes: 'so freakin adorable'
  },
  {
    type: 'feeding',
    feedingType: 'breast',
    eventTime: '1:30 - AM',
    loggedBy: 'Sam',
    leftBreastDuration: '30 - min',
    rightBreastDuration: '24 - min',
    notes: 'Pat snores so loud'
  }
]

export default function Data2({ archive }) {
  const [ls, setLs] = useState([])
  const [day, setDay] = useState(today())
  const [showAddForm, toggleAddForm] = useState(false)

  useEffect(() => {
    readdir(day)
  }, [day])

  function readdir(day) {
      archive.readdir(`/data/${day}`, (err, ls) => {
        if (err) throw err
        let files = []
        if (ls.length === 0) setLs(ls)
        ls.forEach((fileName) => {
          archive.readFile(`/data/${day}/${fileName}`, (err, data) => {
            if (err) throw err
            files.push({ name: fileName, data: data.toString() })
            if (files.length === ls.length) {
              setLs(files.sort((a, b) => a.name < b.name))
            }
          })
        })
      })
  }

  function writeData(data, day) {
    const str = JSON.stringify(data)
    archive.writeFile(`/data/${day}/${Date.now()}.json`, str, (err) => {
      if (err) throw err
      readdir(day)
      toggleAddForm(false)
    })
  }

  function handleClick() {
    toggleAddForm(true)
  }

  function handleDayChange(day) {
    setDay(day)
  }

  function handleSubmit(d) {
    writeData(d, day)
  }

  function handleCancel() {
    toggleAddForm(false)
  }

  return (
    <Fragment>
      <DataList>
        <ButtonWrapper>
          <EnterDataButton onClick={handleClick}>+</EnterDataButton>
        </ButtonWrapper>
        <Entries>
          { mockData.map((data, i) => <Entry key={i} {...data} />) }
        </Entries>
      </DataList>
      { showAddForm && <CreateEventForm enter={handleSubmit} onCancel={handleCancel}/> }
      <DayNav onChange={handleDayChange}/>
    </Fragment>
  )
}
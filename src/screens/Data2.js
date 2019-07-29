import React, { useState, useEffect, Fragment } from 'react'
import styled from 'styled-components'
import DayNav from '../components/DayNav'
import CreateEventForm from '../components/CreateEventForm'
import { today } from '../lib/day'

const DataList = styled.div`
  flex: 1;
`

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
        <ul>
          { ls.map(f => <li key={f}>{ JSON.stringify(f) }</li>) }
        </ul>
        <button onClick={handleClick}>Enter Data</button>
      </DataList>
      { showAddForm && <CreateEventForm enter={handleSubmit} onCancel={handleCancel}/> }
      <DayNav onChange={handleDayChange}/>
    </Fragment>
  )
}
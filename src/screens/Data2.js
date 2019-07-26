import React, { useState, Fragment } from 'react'
import styled from 'styled-components'
import { today } from '../lib/day'

const DataList = styled.div`
  flex: 1;
`

export default function Data2({ archive }) {
  const [ls, setLs] = useState([])
  const [day, setDay] = useState(today())

  const dayPath = day.split('/').join('-')

  function readdir() {
    console.log(dayPath)
    archive.readdir(`/data/${dayPath}`, (err, ls) => {
      if (err) throw err
      setLs(ls)
    })
  }

  function handleClick() {

  }

  return (
    <Fragment>
      <DataList>
        <button onClick={handleClick}>Click!</button>
      </DataList>
    </Fragment>
  )
}
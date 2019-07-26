import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import AuthStatus from './AuthStatus2'
import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import levelup from 'levelup'
import leveljs from 'level-js'
import Data from './Data2'

const ShitListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function List(props) {
  const { archiveKey } = props
  const [archiveName, setName] = useState()
  const [archive, setArchive] = useState()

  useEffect(() => {
    const storage = rai(`shitlist-${archiveKey}`)
    const drive = hyperdrive(storage, archiveKey)
    setArchive(drive)
    drive.ready(() => {
      drive.readFile('/name.txt', (err, data) => {
        if (err) throw err
        setName(data.toString())
      })
    })
  }, [archiveKey])

  useEffect(() => {
    const db = levelup(leveljs('shit-list-db', { prefix: 'shit-list:' }))
    db.put(`shitlist-${archiveKey}`, archiveName)
  }, [archiveKey, archiveName])

  return (
    <ShitListContainer>
      <h2>{ archiveName }</h2>
      {archive && (
        <Fragment>
          <AuthStatus archive={ archive } />
          <Data archive={archive} />
        </Fragment>
      )}
    </ShitListContainer>
  )
}
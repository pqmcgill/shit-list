import React, { Fragment, useState, useEffect } from 'react'
import styled from 'styled-components'
import AuthStatus from './AuthStatus'
import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import levelup from 'levelup'
import leveljs from 'level-js'
import prettyHash from 'pretty-hash'
import Data from './Data'
import connectToGateway from '../lib/connectToGateway';
import { colors } from '../style';
import Button from '../components/Button';
import useLevelDB from '../hooks/useLevelDB';

const ShitListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Name = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Hash = styled(Button)`
  height: 2.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${colors.lightBlue};
  background-color: ${colors.white};
  border-color: ${colors.lightBlue};
  cursor: pointer;
`

export default function List(props) {
  const key = props.match.params.key
  const [archiveName, setName] = useState()
  const [archive, setArchive] = useState()
  const db = useLevelDB()

  useEffect(() => {
    const storage = rai(`shitlist-${key}`)
    const drive = hyperdrive(storage, key)
    connectToGateway(drive, (err) => {
      setArchive(drive)
      if (err) throw err
      drive.readFile('/name.txt', (err, data) => {
        if (err) throw err
        setName(data.toString())
      })
    })
  }, [key])

  useEffect(() => {
    if (archiveName) {
      db.put(`shitlist-${key}`, archiveName)
    }
  }, [db, key, archiveName])

  function copyUrl() {
    navigator.clipboard.writeText(window.location.href)
  }

  return (
    <ShitListContainer>
      <Name>{ archiveName } <Hash onClick={copyUrl}>{ `📋 ${prettyHash(key)}` }</Hash></Name>
      {archive && (
        <Fragment>
          <AuthStatus archive={ archive } />
          <Data archive={archive} />
        </Fragment>
      )}
    </ShitListContainer>
  )
}
import React, { useState, useEffect, Fragment } from 'react'
import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import styled, { css } from 'styled-components'
import { colors } from '../style'
import ShadowBox from '../components/ShadowBox'
import Button from '../components/Button'
import CollapseExpandButton from '../components/CollapseExpandButton'
import Input from '../components/Input'

export default function List(props) {
  const key = props.match.params.key
  const keyBuf = Buffer.from(key, 'hex')
  const [archive, setArchive] = useState()
  const [archiveName, setArchiveName] = useState()

  useEffect(() => {
    let _archive = hyperdrive(rai(`shitlist-db-${key}`), keyBuf)
    setArchive(_archive)
    _archive.ready(() => {
      console.log('actual', _archive.key.toString('hex'))
      _archive.readFile('/name.txt', (err, name) => {
        if (err) throw err
        console.log('read', name)
        setArchiveName(name.toString())
      })
    })
  }, [key])

  return (
    <Fragment>
      <h2>{archiveName}</h2>
  { archive && <AuthStatus archive={archive} /> }
    </Fragment>
  )
}

const AuthText = styled.span`
  font-weight: 700;
  ${props => props.ok 
    ? css`
      color: ${colors.lightBlue};
    `
    : css`
      color: ${colors.darkRed};
    `
  }
`

const LocalKeySection = styled.div`
  background: ${colors.neutral10};
  padding: 1rem;
`

const Key = styled.div`
  color: ${colors.lightBlue};
  font-size: 1.1rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  margin: 1rem 0;
`

const AuthForm = styled.div`
  margin: 0;
  display: flex;
  align-items: center;
`

const Label = styled.label`
  white-space: nowrap;
  margin-right: 0.5rem;
`

const InlineInput = styled(Input)`
  margin-right: 0.5rem;
  flex: 1;
`

function AuthStatus(props) {
  const { archive } = props
  const [auth, setAuth] = useState(false)
  const [remoteLocalKey, setRemoteLocalKey] = useState('')
  const [localKey, setLocalKey] = useState()

  useEffect(() => {
    archive.ready(() => {
      const localKey = archive.db.local.key
      console.log('localkey', localKey.toString('hex'))
      setLocalKey(localKey.toString('hex'))
      archive.db.authorized(localKey, (err, auth) => {
        if (err) throw err
        setAuth(auth)
      })
      archive.db.watch(() => {
        console.log('watch')
        archive.db.authorized(localKey, (err, auth) => {
          if (err) throw err
          setAuth(auth)
        })
      })
    })
  }, [archive])

  function handleChange(e) {
    setRemoteLocalKey(e.target.value)
  }

  function handleSubmit() {
    console.log('authorizing key: ' + remoteLocalKey)
    archive.db.authorize(Buffer.from(remoteLocalKey, 'hex'), (err) => {
      if (err) throw err
      console.log('should be authorized???')
    })
  }

  return (
    <ShadowBox>
      { auth
        ? <Fragment>
            <AuthText ok>You are authorized to write to this shit list</AuthText>
            <p>You can share this shit list to multiple devices or other people. Just copy the URL and paste it into another browser. Other copies may write to this list if you authorize them by passing their "local <span role="img" aria-label="key">🔑</span>" into the form below.</p>
            <AuthForm>
              <Label>Add a writer:</Label>
              <InlineInput value={remoteLocalKey} onChange={handleChange}/>
              <Button onClick={handleSubmit}>Authorize</Button>
            </AuthForm>
          </Fragment>
        : <Fragment>
            <AuthText ok={false}>You are not currently authorized to write to this shit list.</AuthText>,
            <p>You may edit your local copy, but changes wil not be synchronized until you pass your "local <span role="img" aria-label="key">🔑</span>" to an owner of the document and they authorize you.</p>,
            <LocalKeySection>
              Your local <span role="img" aria-label="key">🔑</span> is:
              <Key>{localKey}</Key>
            </LocalKeySection>
          </Fragment>
      }
    </ShadowBox>
  )
}

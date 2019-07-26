import React, { useState, useEffect, Fragment } from 'react'
import styled, { css } from 'styled-components'

import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'

import ShadowBox from '../components/ShadowBox'
import Button from '../components/Button'
import CollapseExpandButton from '../components/CollapseExpandButton'
import Input from '../components/Input'
import { colors } from '../style'

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

export default function AuthStatus(props) {
  const { archive } = props

  const [expanded, setExpanded] = useState(false)
  const [localKey, setLocalKey] = useState()
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    archive.ready(() => {
      let local = archive.db.local.key
      setLocalKey(local.toString('hex'))
      archive.db.authorized(local, (err, isAuth) => {
        if (err) throw err
        setAuth(isAuth)
      })

      archive.readdir('/', (err, data) => {
        if (err) throw err
        console.log(data)
      })
    })
  }, [archive])

  const childProps = {
    ...props,
    localKey,
    auth
  }

  function handleExpand() {
    setExpanded(!expanded)  
  }

  return (
    <ShadowBox>
      <CollapseExpandButton expanded={expanded} onClick={handleExpand} />
      { expanded ? <Expanded {...childProps}/> : <Collapsed {...childProps}/>}
    </ShadowBox>
  )
}

function Expanded({ auth, localKey, onSubmit }) {
  const [keyInput, setKeyInput] = useState('')

  function handleChange(e) {
    setKeyInput(e.target.value)
  }

  function handleSubmit() {
    onSubmit(keyInput)
  }

  function handleCopy() {
    console.log('TODO: copy key')
  }

  return auth ?
    <Fragment>
      <AuthText ok={true}>You are authorized to write to this shit list</AuthText>
      <p>You can share this shit list to multiple devices or other people. Just copy the URL and paste it into another browser. Other copies may write to this list if you authorize them by passing their "local 🔑" into the form below.</p>
      <AuthForm>
        <Label>Add a writer:</Label>
        <InlineInput value={keyInput} onChange={handleChange}/>
        <Button onClick={handleSubmit}>Authorize</Button>
      </AuthForm>
    </Fragment> :
    <Fragment>
      <AuthText ok={false}>You are not currently authorized to write to this shit list.</AuthText>
      <p>You may edit your local copy, but changes wil not be synchronized until you pass your "local 🔑" to an owner of the document and they authorize you.</p>
      <LocalKeySection>
        Your local 🔑 is:
        <Key>{ localKey }</Key>
        <Button onClick={handleCopy}>Copy 🔑 to Clipboard</Button>
      </LocalKeySection>
    </Fragment>
}

function Collapsed({ auth }) {
  return (
    <Fragment>
      <AuthText ok={auth}>
        { auth ? 'Authorized' : 'Not Authorized' }
        { auth ? ' (Expand to add a writer)' : ' (Expand for more info)' }
      </AuthText>
    </Fragment>
  )
}
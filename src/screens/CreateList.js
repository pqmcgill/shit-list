import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import hyperdrive from 'hyperdrive'
import crypto from 'hypercore-crypto'
import rai from 'random-access-idb'
import Input from '../components/Input';
import Button from '../components/Button';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function CreateList() {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [key, setKey] = useState()

  function handleChange(e) {
    setName(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    const { publicKey, secretKey } = crypto.keyPair()
    const keyHex = publicKey.toString('hex')
    const storage = rai(`shitlist-${keyHex}`)
    const archive = hyperdrive(storage, publicKey, { secretKey })
    archive.ready(() => {
      archive.writeFile('/name.txt', name, (err) => {
        if (err) throw err
        setKey(keyHex)
      })
    })
  }

  return (
    <Form>
      <h2>Enter a name for your new shit list</h2>
      <div>
        <Input value={name} onChange={handleChange}/>
        <p>
          <Button isLoading={loading} onClick={handleSubmit}>Submit</Button>
        </p>
      </div>
      { key && <Redirect to={`/list/${key}`} />}
    </Form>
  )
}
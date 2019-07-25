import React, { Fragment, useState } from 'react'
import { Redirect } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'
import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import crypto from 'hypercore-crypto'

export default function CreateList() {
  const [name, setName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [key, setKey] = useState(false)

  function handleChange(e) {
    setName(e.target.value)
  }

  function handleSubmit() {
    setProcessing(true)
    const { publicKey, secretKey } = crypto.keyPair()
    const keyHex = publicKey.toString('hex')
    const storage = rai(`shitlist-db-${keyHex}`)
    const archive = hyperdrive(storage, publicKey, { secretKey })
    archive.ready(() => {
      archive.writeFile('/name.txt', name, (err) => {
        if (err) throw err
        setKey(archive.key.toString('hex'))
      })
    })
  }

  return (
    <Fragment>
      <h2>Enter a name for your new shit list</h2>
      <div>
        <Input type="text" 
          value={name} 
          onChange={handleChange}
        />
        <p>
          <Button
            disabled={processing} 
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </p>
      </div>
      { key && <Redirect to={`/list/${key}`} /> }
    </Fragment>
  )
}
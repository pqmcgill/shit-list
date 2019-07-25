import React, { useState, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import Input from '../components/Input'
import Button from '../components/Button'

export default function AddLink() {
  const [val, setVal] = useState('')
  const [remoteKey, setRemoteKey] = useState()
  const [processing, setProcessing] = useState(false)

  function handleChange(e) {
    setVal(e.target.value)
  }

  function handleSubmit() {
    setProcessing(true)
    setRemoteKey(val)
  }

  return (
    <Fragment>
      <h2>Paste in a URL link or a hexadecimal key</h2>
      <div>
        <Input 
          type="text" 
          value={val}
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
      {remoteKey && <Redirect to={`/list/${remoteKey}`} />}
    </Fragment>
  )
}
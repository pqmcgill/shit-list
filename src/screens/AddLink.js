import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Input from '../components/Input'
import Button from '../components/Button'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`

export default function AddLink() {
  const [link, setLink] = useState('')
  const [valid, setValid] = useState(false)
  const [key, setKey] = useState()

  useEffect(() => {
    setValid(link.match(/([0-9a-fA-F]{64})\/?$/))
  }, [link])

  function handleChange(e) {
    setLink(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (valid) {
      setKey(link)
    }
  }

  return (
    <Form>
      { key && <Redirect to={`/list/${key}`} /> }
      <h2>Paste in a URL link or a hexidecimal key</h2>
      <div>
        <Input value={link} onChange={handleChange}/>
        <p>
          <Button disabled={!valid} onClick={handleSubmit}>Submit</Button>
        </p>
      </div>
    </Form>
  )
}
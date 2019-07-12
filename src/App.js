import React from 'react'

const ws = new WebSocket('ws://localhost:4000')
ws.addEventListener('open', () => {
  console.log('sending: helloworld')
  ws.send('helloworld')
})

ws.addEventListener('message', ({ data }) => {
  const reader = new FileReader()
  reader.addEventListener('loadend', e => {
    const msg = e.srcElement.result
    console.log('received: ' + msg)
  })
  reader.readAsText(data)
})

export default function() {
  return <h1>Shit List</h1>
}

const path = require('path')
const express = require('express')
const expressWs = require('express-ws')
const websocketStream = require('websocket-stream')
const RAM = require('random-access-memory')
const hyperdrive = require('hyperdrive')
const pump = require('pump')

const PORT = process.env.PORT || 4000

const app = express()
expressWs(app)

app.use(express.static(__dirname + '/build'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/build/index.html'))
})

const archives = {}

app.ws('/archive/:key', (ws, req) => {
  const { key } = req.params

  let archive
  if (archives[key]) {
    archive = archives[key]
  } else {
    archive = hyperdrive(RAM, key)
    archives[key] = archive 
  }

  archive.ready(() => {
    const stream = websocketStream(ws)
    const replicationStream = archive.replicate({
      live: true
    })

    pump(
      stream,
      replicationStream,
      stream,
      (err) => {
        console.log('pipe finished', err)
      }
    )
  })
})

app.listen(PORT, (err) => {
  if (err) throw err
  console.log('Listening on port: ' + PORT)
})


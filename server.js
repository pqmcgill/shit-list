/**
 * TODO
 * 
 * done - spin up a webserver
 * serve public folder over http
 * spin up a websocket server
 * create a channel that uses a dynamic segment representing an archive key
 * create a new archive with hyperdb backend
 * join the archive to hyperdiscovery
 * wrap the socket in a duplex stream
 * replicate the archive over the stream
 * nice to have: manage active archive cache
 * nice to have: debug logs
 */

const express = require('express')
const path = require('path')

const PORT = 4000

const app = express()

app.use(express.static(__dirname + '/build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/build/index.html'))
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

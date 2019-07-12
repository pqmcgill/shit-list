/**
 * TODO
 * 
 * done - spin up a webserver
 * done - serve public folder over http
 * done - spin up a websocket server
 * create a channel that uses a dynamic segment representing an archive key
 * create a new archive with hyperdb backend
 * join the archive to hyperdiscovery
 * done - wrap the socket in a duplex stream
 * replicate the archive over the stream
 * nice to have: manage active archive cache
 * nice to have: debug logs
 */

const express = require('express')
const path = require('path')
const wss = require('websocket-stream')
const http = require('http')

const PORT = process.env.PORT || 4000

const app = express()
const server = http.createServer(app)

app.use(express.static(__dirname + '/build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/build/index.html'))
})

wss.createServer({ server }, (ws, err) => {
  ws.pipe(ws)
  ws.on('error', err => {
    console.log('incoming connection timout')
  })
})

server.listen(PORT, (err) => {
  if (err) throw err
  console.log('Listening on port: ' + PORT)
})


/**
 * TODO
 * 
 * done - spin up a webserver
 * done - serve public folder over http
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
const WebSocketServer = require('ws').Server
const http = require('http')
const path = require('path')

const PORT = process.env.PORT || 4000

const app = express()
const server = http.createServer(app)

app.use(express.static(__dirname + '/build'))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/build/index.html'))
})

server.listen(PORT, (err) => {
  if (err) throw err
  console.log('Listening on port: ' + PORT)
})

const wss = new WebSocketServer({ server })

wss.on('connection', (socket) => {
  console.log('connected via ws!')
})

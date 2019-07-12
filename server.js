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


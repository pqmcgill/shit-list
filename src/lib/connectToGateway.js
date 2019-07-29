import websocketStream from 'websocket-stream'
import pump from 'pump'

export default function connectToGateway(archive, cb) {
  archive.ready(() => {
    const key = archive.key.toString('hex')
    const stream = websocketStream(`ws://localhost:4000/archive/${key}`)
    const replicationStream = archive.replicate({
      live: true,
      sparse: true
    })

    pump(
      stream,
      replicationStream,
      stream,
      err => {
        console.log('pipe finished', err)
        cb(err)
      }
    )

    cb()
  })
}
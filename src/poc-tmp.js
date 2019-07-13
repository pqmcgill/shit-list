import wsStream from 'websocket-stream'
import hyperdrive from 'hyperdrive'
import RAM from 'random-access-memory'
import pump from 'pump'

let archive

if (window.location.hash.length > 0) {
  const key = window.location.hash.split('#')[1]
  archive = hyperdrive(RAM, key)
  archive.ready(() => {
    archive.db.authorized(archive.local.key, console.log)
    archive.readFile('/test.txt', 'utf-8', (err, data) => {
      if (err) throw err
      console.log('read', data)
    })
  })
} else {
  archive = hyperdrive(RAM)
  archive.ready(() => {
    archive.db.authorized(archive.local.key, console.log)
    console.log('key', archive.key.toString('hex'))
    archive.writeFile('/test.txt', 'helloworld', 'utf-8', (err) => {
      if (err) throw err
      console.log('wrote!')
    })
  })
}


archive.ready(() => {
  const key = archive.key.toString('hex')
  const stream = wsStream(`ws://localhost:4000/archive/${key}`)
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
    }
  )
})

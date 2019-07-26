import xs from 'xstream'
import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import websocketStream from 'websocket-stream'
import pump from 'pump'
import crypto from 'hypercore-crypto'

export default function hyperDriver(sink$) {
  const cache = {}

  const open$ = sink$.filter(({ type }) => type === 'open')
  const write$ = sink$.filter(({ type }) => type === 'write')
  const read$ = sink$.filter(({ type }) => type === 'read')
  const readDir$ = sink$.filter(({ type }) => type === 'readdir')
  const authorize$ = sink$.filter(({ type }) => type === 'authorize')
  const isAuth$ = sink$.filter(({ type }) => type === 'isAuth')

  open$.subscribe({
    next({ key, category }) {
      getArchive(key, archive => {
        cache[category]._n(archive)
      })
    }
  })

  isAuth$.subscribe({
    next({ key, category }) {
      getArchive(key, archive => {
        archive.db.authorized(archive.db.local.key, handleUpdate)
        archive.db.watch(() => {
          archive.db.authorized(archive.db.local.key, handleUpdate)
        })
        function handleUpdate(err, isAuth) {
          if (err) {
            cache[category]._e(err)
          } else {
            console.log('isAuth', isAuth)
            cache[category]._n(isAuth)
          }
        }
      })
    }
  })

  authorize$.subscribe({
    next({ key, localKey, category }) {
      if (typeof localKey === 'string') {
        localKey = Buffer.from(localKey, 'hex')
      }
      getArchive(key, archive => {
        archive.db.authorize(localKey, (err) => {
          if (cache[category]) {
            if (err) {
              cache[category]._e(err)
            } else {
              cache[category]._n()
            }
          }
        })
      })
    }
  })

  read$.subscribe({
    next({ key, category, path }) {
      getArchive(key, archive => {
        const readStream$ = xs.create({
          start(listener) {
            archive.ready(() => {
              readFile()
              archive.db.watch(path, readFile)
            })

            function readFile() {
              archive.readFile(path, (err, data) => {
                if (err) return listener.error(err)
                listener.next(data)
              })
            }
          },
          stop() {}
        })
        readStream$.subscribe({
          next(v) { cache[category]._n(v) }
        })
      })
    }
  })

  readDir$.subscribe({
    next({ key, category, path }) {
      getArchive(key, archive => {
        const readDirStream$ = xs.create({
          start(listener) {
            archive.ready(() => {
              readDir()
              // TODO: why isn't this working? apparently it does?
              archive.db.watch(() => {
                console.log('watched')
                readDir()
              })
            })
            function readDir() {
              archive.readdir(path, (err, ls) => {
                if (err) return listener.error(err)
                const files = {}
                ls.forEach((fileName, i) => {
                  archive.readFile(path + '/' + fileName, (err, data) => {
                    if (err) return listener.error(err)
                    files[i] = { name: fileName, data }
                    if (Object.keys(files).length === ls.length) {
                      listener.next(files)
                    }
                  })
                })
              })
            }
          },
          stop() {}
        })
        readDirStream$.subscribe({
          next(v) { cache[category]._n(v) }
        })
      })
    }
  })

  write$.subscribe({
    next({ key, category, path, data }) {
      getArchive(key, archive => {
        archive.writeFile(path, data, function(err) {
          if (err)  { 
            cache[category]._e(err)
          } else { 
            cache[category]._n()
          }
        })
      })
    }
  })

  return {
    select(category) {
      if (!cache[category]) {
        cache[category] = xs.createWithMemory()
      }
      return cache[category]
    }
  }

  function getArchive(key, cb) {
    let archive
    if (key) {
      console.log('loading existing')
      key = key.toString('hex')
      const dbName = `shitlist-${key}`
      const storage = rai(dbName)
      archive = hyperdrive(storage, key)
    } else {
      console.log('creating new')
      const { publicKey, secretKey } = crypto.keyPair()
      key = publicKey.toString('hex')
      const dbName = `shitlist-${key}`
      const storage = rai(dbName)
      archive = hyperdrive(storage, publicKey, { secretKey })
    }

    archive.ready(() => {
      cb(archive)
    })

    connectToGateway(archive)
  }
}

function connectToGateway(archive) {
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
      }
    )
  })
}

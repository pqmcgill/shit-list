import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import hyperdrive from 'hyperdrive'
import raw from 'random-access-web'
import websocketStream from 'websocket-stream'
import pump from 'pump'

export default function hyperDriver(sink$) {
  const cache = {};

  const open$ = sink$.filter(({ type }) => type === 'open')
  const write$ = sink$.filter(({ type }) => type === 'write')
  const authorization$ = sink$.filter(({ type }) => type === 'authorize')

  open$.subscribe({
    next({ name, key, persist }) {
      if (cache[name]) {
        let archive
        const storage = raw('shitlists')
        if (key) {
          archive = hyperdrive(storage, key)
        } else {
          archive = hyperdrive(storage)
        }

        cache[name].archive = archive

        // activate archive stream
        archive.ready(() => {
          cache[name].archive$._n(archive)
        });

        const authorized$ = createAuthStream(archive)
        authorized$
          .compose(dropRepeats())
          .subscribe({
            next(v) {
              cache[name].authorized$._n(v)
            }
          })

        // activate read streams
        Object.keys(cache[name].reads).forEach(path => {
          const read$ = createReadStream(path, archive)
          read$.subscribe({
            next(v) {
              cache[name].reads[path]._n(v)
            }
          })
        })

        // TODO: connect to peers
        //// activate peer stream
        //const peer$ = createPeerStream(dat, archive)
        //cache[name].peer$.imitate(peer$)
        
        connectToGateway(archive)
      }
    }
  })

  write$.subscribe({
    next({ name, path, data }) {
      const archive = cache[name].archive
      if (archive) {
        archive.ready(() => {
          archive.writeFile(path, data, function(err) {
            if (err) throw err
          })
        })
      } else {
        throw new Error('archive not opened for ' + name)
      }
    }
  })

  authorization$.subscribe({
    next({ name, key }) {
      const archive = cache[name].archive
      if (archive) {
        archive.ready(() => {
          archive.db.authorize(Buffer.from(key, 'hex'), (err) => {
            if (err) throw err
          })
        })
      } else {
        throw new Error('archive not opened for ' + name)
      }
    }
  })

  return {
    select(archiveName) {
      if (!cache[archiveName]) {
        cache[archiveName] = {
          reads: {},
          peer$: xs.create(),
          archive$: xs.createWithMemory(),
          authorized$: xs.createWithMemory()
        }
      }

      return {
        read(path) {
          if (!cache[archiveName].reads[path]) {
            cache[archiveName].reads[path] = xs.create()
          }           

          return cache[archiveName].reads[path]
        },

        peer$: cache[archiveName].peer$,
        archive$: cache[archiveName].archive$,
        authorized$: cache[archiveName].authorized$
      } 
    }
  }
}

function createReadStream(path, archive) {
  return xs.create({
    start(listener) {
      archive.ready(() => {
        readFile()
        archive.db.watch(path, function() {
          readFile()
        })
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
}


//function createPeerStream(dat, archive) {
//  return xs.create({
//    start(listener) {
//      archive.ready(() => {
//        listener.next()
//        dat.onNetworkActivity(archive, (network) => {
//          listener.next(network)
//        })
//      });
//    },
//    stop() {}
//  })
//}

function createAuthStream(archive) {
  return xs.create({
    start(listener) {
      archive.ready(() => {
        archive.db.authorized(archive.db.local.key, handleUpdate)
        archive.db.watch(() => {
          archive.db.authorized(archive.db.local.key, handleUpdate)
        })
      })
      function handleUpdate(err, isAuth) {
        if (err) return listener.error(err)
        listener.next(isAuth)
      }
    },
    stop() {}
  })
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

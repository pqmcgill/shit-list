
import xs from 'xstream'
import hyperdrive from 'hyperdrive'
import ram from 'random-access-memory'
import websocketStream from 'websocket-stream'
import pump from 'pump'

export default function hyperDriver(sink$) {
  const cache = {};

  const open$ = sink$.filter(({ type }) => type === 'open')

  const write$ = sink$.filter(({ type }) => type === 'write')

  open$.subscribe({
    next({ name, key, persist }) {
      if (cache[name]) {
        let archive
        if (key) {
          archive = hyperdrive(ram, key)
        } else {
          archive = hyperdrive(ram)
        }

        cache[name].archive = archive

        // activate key stream
        cache[name].getArchive = createArchiveFactory(archive)

        // activate read streams
        Object.keys(cache[name].reads).forEach(path => {
          const read$ = createReadStream(path, archive)
          cache[name].reads[path].imitate(read$)
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
            console.log('wrote!')
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
          archive$: xs.create()
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
        archive$: cache[archiveName].archive$
      } 
    }
  }
}

function createReadStream(path, archive) {
  return xs.create({
    start(listener) {
      archive.ready(() => {
        archive.db.watch(path, function() {
          archive.readFile(path, (err, data) => {
            if (err) return listener.error(err)
            listener.next(data)
          })
        })
      })
    },
    stop() {}
  })
}


function createPeerStream(dat, archive) {
  return xs.create({
    start(listener) {
      archive.ready(() => {
        listener.next()
        dat.onNetworkActivity(archive, (network) => {
          listener.next(network)
        })
      });
    },
    stop() {}
  })
}

function createArchiveFactory(archive) {
  return function() { 
    return xs.create({
      start(listener) {
        archive.ready(() => {
          listener.next(archive)
        })
      },
      stop() {}
    })
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

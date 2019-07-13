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
        const key$ = createKeyStream(archive)
        cache[name].key$.imitate(key$)

        // activate read streams
        Object.keys(cache[name].reads).forEach(path => {
          const read$ = createReadStream(path, archive)
          cache[name].reads[path].imitate(read$)
        })

        //// activate peer stream
        //const peer$ = createPeerStream(dat, archive)
        //cache[name].peer$.imitate(peer$)
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
          archive: null,
          reads: {},
          peer$: xs.create(),
          key$: xs.create()
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

        key$: cache[archiveName].key$
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

function createKeyStream(archive) {
  return xs.create({
    start(listener) {
      archive.ready(() => {
        listener.next(archive.key)
      })
    },
    stop() {}
  })
}


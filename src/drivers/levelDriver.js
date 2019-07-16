import xs from 'xstream'
import levelup from 'levelup'
import leveljs from 'level-js'

export default function createLevelDriver(name, opts) {
  const db = levelup(leveljs(name, opts))

  const reads = {}

  return function levelSource(sink$) {
    const get$ = sink$.filter(({ type }) => type === 'get')
    const put$ = sink$.filter(({ type }) => type === 'put')
    const del$ = sink$.filter(({ type }) => type === 'del')

    get$.subscribe({
      next({ key }) {
        read(key)
      }
    })

    put$.subscribe({
      next({ key, value, rerun }) {
        db.put(key, value, (err) => {
          if (err) throw err
          if (rerun) {
            processReruns(rerun)
          }
        })
      }
    })

    del$.subscribe({
      next({ key, value, rerun }) {
        db.del(key, (err) => {
          if (err) throw err
          if (rerun) {
            processReruns(rerun)
          }
        })
      }
    })

    return {
      read(key) {
        if (!reads[key]) {
          reads[key] = xs.create()
        }
        return reads[key]
      }
    }
  }

  function read(key) {
    if (reads[key]) {
      const stream = xs.create({
        start(listener) {
          db.get(key, (err, data) => {
            if (err) return listener.error(err)
            listener.next(data)
          })
        },
        stop() {}
      })
      reads[key]._n(stream)
    }
  }

  function processReruns(reads) {
    reads = Array.isArray(reads) ? reads : [reads]
    reads.forEach(read)
  }
}


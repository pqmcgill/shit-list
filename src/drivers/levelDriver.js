import xs from 'xstream'
import levelup from 'levelup'
import leveljs from 'level-js'

export default function createLevelDriver(name, opts) {
  const db = levelup(leveljs(name, opts))

  const reads = {}

  return function levelSource(sink$) {
    const get$ = sink$.filter(({ type }) => type === 'get')
    const query$ = sink$.filter(({ type }) => type === 'query')
    const put$ = sink$.filter(({ type }) => type === 'put')
    const del$ = sink$.filter(({ type }) => type === 'del')

    get$.subscribe({
      next({ name, key }) {
        read(name, key)
      }
    })

    query$.subscribe({
      next({ name, options }) {
        query(name, options)
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
      read(name) {
        if (!reads[name]) {
          reads[name] = xs.create()
        }
        return reads[name]
      },

      query(name) {
        if (!reads[name]) {
          reads[name] = xs.create()
        }
        return reads[name]
      }
    }
  }

  function read(name, key) {
    if (reads[name]) {
      const stream = xs.create({
        start(listener) {
          db.get(key, (err, data) => {
            if (err) return listener.error(err)
            listener.next(data)
          })
        },
        stop() {}
      })
      reads[name]._n(stream)
    }
  }

  function query(name, options) {
    if (reads[name]) {
      const stream = xs.create({
        start(listener) {
          let data = []
          db.createReadStream(options)
            .on('data', d => {
              console.log(d)
              data.push(d)
            })
            .on('error', listener.error)
            .on('end', () => {
              console.log('data', data)
              listener.next(data)
            })
        },
        stop() {}
      })
    }
  }

  function processReruns(reads) {
    reads = Array.isArray(reads) ? reads : [reads]
    reads.forEach(read)
  }
}


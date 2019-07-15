import xs from 'xstream'
import levelup from 'levelup'
import leveljs from 'level-js'

//const db = levelup(leveljs('test-db', { prefix: 'shit-list:' }))
//
//db.put('test', 'helloworld', err => {
//  if (err) throw err
//
//  db.get('hello', (err, value) => {
//    console.log('value', value.toString())
//  })
//})

export function LevelTest(sources) {
  const readResponse$ = sources.LEVEL
    .select('test')
    .flatten()
    .map(v => v.toString())
    .debug('test')
    .subscribe({})

  const readRequest$ = xs.of({
    type: 'get',
    name: 'test',
    key: 'test'
  })

  return {
    LEVEL: readRequest$
  }
}


export default function createLevelDriver(name, opts) {
  const db = levelup(leveljs(name, opts))

  const ops = {}

  return function levelSource(sink$) {
    const get$ = sink$.filter(({ type }) => type === 'get')
    const put$ = sink$.filter(({ type }) => type === 'put')
    const del$ = sink$.filter(({ type }) => type === 'del')

    sink$.debug('sinks').subscribe({})

    get$.subscribe({
      next({ name, key }) {
        if (ops[name]) {
          ops[name]._n(
            createReadStream(key)
          )
        }
      }
    })

    put$.subscribe({
      next({ key, val }) {
        db.put(key, val)
      }
    })

    return {
      select(name) {
        if (!ops[name]) {
          ops[name] = xs.create()
        }
        return ops[name]
      }
    }
  }

  function createReadStream(key) {
    return xs.create({
      start(listener) {
        db.get(key, (err, data) => {
          if (err) return listener.error(err)
          listener.next(data)
        })
      },
      stop() {}
    })
  }
}


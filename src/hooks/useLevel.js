import { useState, useEffect } from 'react'
import levelup from 'levelup'
import leveljs from 'level-js'

export default function useLevel(name, opts) {
  const [db] = useState(levelup(leveljs(name, opts)))

  useEffect(() => {
    return () => { db.close() }
  }, [db])

  function get(key, cb) {
    db.get(key, cb)
  }

  function query(options, cb) {
    let data = []
    db.createReadStream(options)
      .on('data', d => {
        data.push(d)
      })
      .on('error', cb)
      .on('end', () => {
        cb(null, data)
      })
  }

  function put(key, value, cb) {
    db.put(key, value, cb)
  }

  function del(key, cb) {
    db.del(key, cb)
  }

  return {
    get,
    query,
    put,
    del
  }
}

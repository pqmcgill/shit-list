import { useReducer, useEffect } from 'react'
import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import crypto from 'hypercore-crypto'

const initialState = {
  ready: false,
  auth: false
}

function reducer(state, action) {
  switch(action.type) {
    case 'ready':
      return {
        ...state,
        ready: true,
        key: action.archive.key.toString('hex'),
        localKey: action.archive.db.local.key.toString('hex')
      }
    case 'authChange':
      return {
        ...state,
        auth: action.auth
      }
    default:
      throw new Error('unknown action type', action)
  }
}

export default function useArchive(key) {
  const [state, dispatch] = useReducer(reducer, initialState)
  let archive
  let watchers = {}

  useEffect(() => {
    if (key) {
      const storage = rai(`shitlist-${key}`)
      archive = hyperdrive(storage, key)
    } else {
      const { publicKey, secretKey } = crypto.keyPair()
      const storage = rai(`shitlist-${key.toString('hex')}`)
      archive = hyperdrive(storage, publicKey, { secretKey })
    }

    archive.ready(() => {
      dispatch({
        type: 'ready',
        archive
      })

      watchers['__root__'] = archive.db.watch

      checkAuth()
      archive.db.watch(() => {
        checkAuth()
      })
    })

    function checkAuth() {
      archive.db.authorized((err, auth) => {
        if (err) throw err
        dispatch({
          type: 'authChange',
          auth
        })
      })
    }

    return function cleanup() {
      Object.values(watchers).forEach(watcher => {
        watcher.destroy()
      })
    }
  }, [])

  function read(path, cb) {
    if (!watchers[path]) {
      const watcher = archive.db.watch(path)
      watchers[path] = watcher
    } 
    watchers[path].on('change', cb)
  }

  return {
    state,
    read   
  }
}

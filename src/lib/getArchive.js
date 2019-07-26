import hyperdrive from 'hyperdrive'
import rai from 'random-access-idb'
import crypto from 'hypercore-crypto'

const archives = {}

export default function getArchive(key, cb) {
  let archive
  if (key) {
    key = key.toString('hex')
    if (archives[key]) {
      archive = archives[key]
    } else {
      archive = hyperdrive(rai(`shitlist-${key}`), key)
    }
  } else {
    const { publicKey, secretKey } = crypto.keyPair()
    key = publicKey.toString('hex')
    archive = hyperdrive(rai(`shitlist-${key}`), key, { secretKey })
  }

  archive.once('ready', () => {
    cb(archive)
  })
}
import { useState } from 'react'
import levelup from 'levelup'
import levelJs from 'level-js'

export default function useLevelDB() {
  const [db] = useState(levelup(levelJs('shit-list-db', { prefix: 'shit-list:' })))
  return db
}
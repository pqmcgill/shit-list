import xs from 'xstream'
import { div, h1 } from '@cycle/react-dom'

export default function AuthTest(sources) {
  // DAT STUFF ===========================
  const createOwnerArchive$ = xs.of({ type: 'open', name: 'owner' })
  const owner = sources.HYPER.select('owner')
  const ownerKey$ = owner.archive$.map(({ key }) => key)
    .map(key => key.toString('hex'))
    .debug('owner key')
  
  const createVisitorArchive$ = ownerKey$
    .map(key => ({ type: 'open', name: 'visitor', key }))
  const visitor = sources.HYPER.select('visitor')
  const visitorKey$ = visitor.archive$.map(archive => archive.db.local.key)
    .map(key => key.toString('hex'))
    .debug('visitor key')

  const authorize$ = visitorKey$
    .map(key => ({
      name: 'owner',
      type: 'authorize',
      key,
    }))

  const hyper$ = xs.merge(
    createOwnerArchive$,
    createVisitorArchive$,
    authorize$
  ).debug('hyper')
  
  // MODEL ==============================
  const state$ = xs.of(true)
  
  // VIEW ==============================
  const dom$ = state$.map(isAuth => (
    div([
      h1([
        `Authorized: ${ isAuth ? '✅' : '❌' }`
      ])
    ])
  ))

  return {
    DOM: dom$,
    HYPER: hyper$
  }
}

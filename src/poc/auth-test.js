import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { div, h1 } from '@cycle/react-dom'

export default function AuthTest(sources) {
  // DAT STUFF ===========================
  const createOwnerArchive$ = xs.of({ type: 'open', name: 'owner' })
  const owner = sources.HYPER.select('owner')
  const ownerKey$ = owner.archive$
    .map(({ key }) => key)
    .map(key => key.toString('hex'))
    .debug('owner key')
  
  const createVisitorArchive$ = ownerKey$
    .map(key => ({ type: 'open', name: 'visitor', key }))
  const visitor = sources.HYPER.select('visitor')
  const visitorKey$ = visitor.archive$
    .map(archive => archive.db.local.key)
    .map(key => key.toString('hex'))
    .debug('visitor key')

  const ownerAuth$ = owner.authorized$
  const visitorAuth$ = visitor.authorized$
    .debug('is visitor authorized')

  const authorize$ = visitorKey$
    .map(key => ({
      name: 'owner',
      type: 'authorize',
      key,
    }))
    .compose(delay(1000))

  const hyper$ = xs.merge(
    createOwnerArchive$,
    createVisitorArchive$,
    authorize$
  ).debug('hyper')
  
  // MODEL ==============================
  const state$ = xs.combine(ownerAuth$, visitorAuth$)
    .map(([ownerAuth, visitorAuth]) => ({
      ownerAuth,
      visitorAuth
    }))
  
  // VIEW ==============================
  const dom$ = state$.map(({ ownerAuth, visitorAuth }) => (
    div([
      h1([
        `Owner Authorized: ${ ownerAuth ? '✅' : '❌' }`
      ]),
      h1([
        `Visitor Authorized: ${ visitorAuth ? '✅' : '❌' }`
      ])
    ])
  ))

  return {
    DOM: dom$,
    HYPER: hyper$
  }
}

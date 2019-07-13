import xs from 'xstream'
import { h1 } from '@cycle/react-dom'

export default function App(sources) {
  const key$ = sources.HYPER
    .select('my-drive')
    .key$
    .map(key => key.toString('hex'))
    .debug('key')
    .subscribe({})

  const read$ = sources.HYPER
    .select('my-drive')
    .read('/test.txt')
    .map(data => data.toString())
    .debug('reading!')
    .subscribe({})

  const dom$ = xs.of(h1('Shit List'))

  const open$ = xs.of({
    type: 'open',
    name: 'my-drive'
  })

  const write$ = xs.of({
    type: 'write',
    name: 'my-drive',
    path: '/test.txt',
    data: 'hello world!'
  })

  return {
    DOM: dom$,
    HYPER: xs.merge(open$, write$)
  }
}

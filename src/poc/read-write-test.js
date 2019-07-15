import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { h1, textarea } from '@cycle/react-dom'

export default function ReadWriteTest(sources) {
  const hash$ = sources.HISTORY
    .map(({ hash }) => hash)

  const data$ = sources.HYPER
    .select('my-drive')
    .read('/test.txt')
    .map(data => data.toString())
    .debug('reading!')

  const open$ = hash$
    .map(hash => {
      const opts = {
        type: 'open',
        name: 'my-drive'
      }
      if (hash.length > 0) {
        return {
          ...opts,
          key: hash.split('#')[1]
        };
      } else {
        return opts
      }    
    })
    .debug('opening')

  const write$ = hash$
    .filter(hash => hash.length === 0)
    .mapTo({
      type: 'write',
      name: 'my-drive',
      path: '/test.txt',
      data: 'hello world!'
    })
    .compose(delay(5000))

  const view$ = data$.map(data => {
    return (
      textarea({ sel: 'txt', value: data })
    )
  }).startWith(
    h1('loading...')
  )

  const update$ = sources.DOM
    .select('txt')
    .events('change')
    .map(({ target: { value }}) => value)
    .map(value => ({
      type: 'write',
      name: 'my-drive',
      path: '/test.txt',
      data: value
    }));

  return {
    HYPER: xs.merge(open$, write$, update$),
    DOM: view$
  }
}

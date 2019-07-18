import xs from 'xstream'
import delay from 'xstream/extra/delay'
import { div, h1, ul, li } from '@cycle/react-dom'

export function LevelTest(sources) {
  const readResponse$ = sources.LEVEL
    .read(['test', 'foo'])
    .map(req => req.replaceError(err => xs.of('not found')))
    .flatten()
    .map(v => v.toString())

  const readRequest$ = xs.of({
    type: 'get',
    key: ['test', 'foo']
  })

  const put$ = xs.of({
    type: 'put',
    key: ['test', 'foo'],
    value: ['abc123', '123abc'],
    rerun: ['test', 'foo']
  }).compose(delay(5000))

  const del$ = xs.of({
    type: 'del',
    key: ['test', 'foo'],
    rerun: ['test', 'foo']
  }).compose(delay(10000))

  const dom$ = readResponse$
    .map(text => (
      div([
        h1('DB Contents'),
        ul(text.split(',').map(key => (
          li(key)
        )))
      ])
    ))

  return {
    LEVEL: xs.merge(
      readRequest$,
      put$,
      del$
    ),
    DOM: dom$
  }
}

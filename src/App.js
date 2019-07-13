import xs from 'xstream'
import { h } from '@cycle/react'
import { h1 } from '@cycle/react-dom'

export default function App(sources) {
  const dom$ = xs.of(h1('Shit List'))

  return {
    DOM: dom$
  }
}

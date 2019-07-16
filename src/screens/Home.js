import xs from 'xstream'
import { h1 } from '@cycle/react-dom'

export default function Home(sources) {
  const dom$ = view()
  return {
    DOM: dom$
  }
}

function view() {
  return xs.of(h1('Home'))
}

import { div, h1, p } from '@cycle/react-dom'

export default function List(sources) {
  const { key$ } = sources
  return {
    DOM: key$.map(key => (div([
      h1('List'),
      p(`key: ${key}`)
    ])))
  }
}

import xs from 'xstream'
import { form, label, input, button } from '@cycle/react-dom'

export default function CreateList(sources) {
  const dom$ = xs.of(
    form([
      label('Enter a name for you new shit list'),
      input({ type: 'text' }),
      button({ type: 'submit' }, 'Submit')
    ])
  )

  return {
    DOM: dom$
  }
}

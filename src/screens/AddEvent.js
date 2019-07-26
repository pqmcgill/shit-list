import CreateEventForm from '../components/CreateEventForm';
import xs from 'xstream';
import { h } from '@cycle/react';

function intent(domSrc) {
  return {
    submit$: domSrc.select('form')
      .events('submit'),
    cancel$: domSrc.select('form')
      .events('cancel')
  }
}

function view() {
  return (
    xs.of(h(CreateEventForm, { sel: 'form' }))
  )
}

export default function AddList(sources) {
  const actions = intent(sources.DOM)
  const dom$ = view();
  return {
    DOM: dom$,
    submit$: actions.submit$,
    cancel$: actions.cancel$
  }
}
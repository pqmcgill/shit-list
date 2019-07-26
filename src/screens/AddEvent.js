import Button from '../components/Button';
import FormDiv from '../components/FormDiv';
import styled from 'styled-components';
import CreateEventForm from '../components/CreateEventForm';
import xs from 'xstream';
import { h } from '@cycle/react';

const FormButton = styled(Button)`
  min-width: 100px;
  margin: 5px;
`

function intent(domSrc) {
  return {
    submit$: domSrc.select('form')
      .events('submit')
  }
}

function view() {
  return (
    xs.of(h(CreateEventForm, { sel: 'form' })))
}

export default function AddList(sources) {
  const actions = intent(sources.DOM)
  const dom$ = view();
  return {
    DOM: dom$,
    submit$: actions.submit$
  }
}
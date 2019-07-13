import * as serviceWorker from './serviceWorker'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/react-dom'
import { makeHistoryDriver } from '@cycle/history'
import hyperDriver from './hyperDriver'
import Poc from './Poc'

// TODO: remove eventually.
//import './poc-tmp'

const drivers = {
  DOM: makeDOMDriver(document.querySelector('#root')),
  HYPER: hyperDriver,
  HISTORY: makeHistoryDriver()
}

run(Poc, drivers)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


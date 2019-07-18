import * as serviceWorker from './serviceWorker'
import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/react-dom'
import { makeHistoryDriver } from '@cycle/history'
import hyperDriver from './drivers/hyperDriver'
import makeLevelDriver from './drivers/levelDriver'
import { routerify } from 'cyclic-router'
import switchPath from 'switch-path'
import './index.css'
import App from './App'

const drivers = {
  DOM: makeDOMDriver(document.querySelector('#root')),
  HYPER: hyperDriver,
  HISTORY: makeHistoryDriver(),
  LEVEL: makeLevelDriver('test-db', { prefix: 'shit-list:' })
}

const Main = routerify(App, switchPath, {
  historyName: 'HISTORY'
})

run(Main, drivers)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


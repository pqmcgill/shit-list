import xs from 'xstream'
import { getSink } from './util/getSink'
import Home from './screens/Home'
import List from './screens/List'

export default function App(sources) {
  const pageSink$ = sources.router.routedComponent({
    '/home': Home,
    '/list/:key': key => sources => List({ ...sources, key$: xs.of(key) }),
    '*': () => ({ DOM: xs.of('404'), router: xs.of('/home') })
  })(sources);

  return {
    DOM: pageSink$.compose(getSink('DOM')),
    router: pageSink$.compose(getSink('router'))
  }
}


import xs from 'xstream'
import { h } from '@cycle/react'
import { div } from '@cycle/react-dom'
import styled from 'styled-components'
import { getSink } from './util/getSink'
import TopBar from './components/TopBar'
import Home from './screens/Home'
import CreateList from './screens/CreateList'
import List from './screens/List'
import { colors } from './style'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  height: 100%;
	font-family: 'Source Sans Pro','PT Sans',Calibri,sans-serif; 
  color: ${ colors.blueDarker };
`

export default function App(sources) {
  const topBarSinks = TopBar(sources)

  const pageSink$ = sources.router.routedComponent({
    '/home': Home,
    '/create': CreateList,
    '/list/:key': key => sources => List({ ...sources, key$: xs.of(key) }),
    '*': () => ({ DOM: xs.of('404'), router: xs.of('/home') })
  })(sources);

  const layout$ = xs.combine(
    topBarSinks.DOM,
    pageSink$.compose(getSink('DOM'))
  ).map(([topBar, page]) => {
    return h(Wrapper, [
      topBar,
      page
    ])
  })

  return {
    DOM: layout$,
    router: pageSink$.compose(getSink('router'))
  }
}


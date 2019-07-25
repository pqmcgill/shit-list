import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import TopBar from './components/TopBar'
import Home from './screens/Home2'
import CreateList from './screens/CreateList'
import AddLink from './screens/AddLink2'
import List from './screens/List2'
import NoMatch from './screens/NoMatch'
import { colors } from './style'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  height: 100%;
	font-family: 'Source Sans Pro','PT Sans',Calibri,sans-serif; 
  color: ${colors.darkBlue};
  background-color: ${colors.white};
  height: 100vh;
`

const Content = styled.section`
  margin: 1rem 1rem 2rem 1rem;
`

export default function App() {
  return (
    <Router>
      <Wrapper>
        <TopBar />
        <Content>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/create' component={CreateList} />
            <Route path='/addlink' component={AddLink} />
            <Route path='/list/:key' component={List} />
            <Route component={NoMatch} />
          </Switch>
        </Content>
      </Wrapper>
    </Router>
  )
}
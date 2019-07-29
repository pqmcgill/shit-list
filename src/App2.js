import React from 'react'
import styled from 'styled-components'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { colors } from './style'
import Home from './screens/Home'
import List from './screens/List'

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
  margin: 1rem 1rem 0 1rem;
  display: flex;
  flex: 1;
`

export default function App() {
  return (
    <Wrapper>
      <Content>
        <Router>
          <Switch>
            <Route exact path='/home' component={Home} />
            <Route path='/list/:key' component={List} />
            <Redirect to='/home' />
          </Switch>
        </Router>
      </Content>
    </Wrapper>
  )
}
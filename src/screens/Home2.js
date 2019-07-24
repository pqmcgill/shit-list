import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import useLevel from '../hooks/useLevel'
import Button from '../components/Button'
import ShadowBox from '../components/ShadowBox'
import { colors } from '../style'

const WelcomeHeader = styled.h4`
  margin: 0.5rem 1rem 1rem 1rem;
  font-size: 1.3rem;
  text-align: center;
`

const Bold = styled.b`
  color: ${colors.darkBlue};
`

const Lists = styled.ul`
  padding: 0;
`

const List = styled.li`
  list-style-type: none;
  border: solid 2px ${colors.lightBlue};
  border-radius: 0.5rem;
  margin: 0 0 0.5rem 0;
  padding: 0 0.5rem;
  min-height: 3rem;
  position: relative;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  color: ${colors.darkBlue};
  transform: translateZ(0);
  transition: transform .25s ease-out;

  &:active {
    transform: scale(0.9)
  }

  &:hover {
    transform: scale(1.03);
  }
` 

const NoListMsg = styled.div`
  display: flex;
  justify-content: center;
`

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 1rem;
`

const CreateBtn = styled(Button)`
  height: 4rem;
`

const AddLinkBtn = styled(Button)`
  margin-top: 1rem;
  height: 2.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${colors.lightBlue};
  background-color: ${colors.white};
  border-color: ${colors.lightBlue};
`

export default function Home() {
  const [shitLists, setShitLists] = useState([])
  const { query } = useLevel('shit-list-db', { prefix: 'shit-list:' })

  useEffect(() => {
    query({ gt: 'shitlist-', lt: 'shitlist-\xff' }, (err, data) => {
      if (err) throw new Error('Trouble loading shitlists: ', err)
      const parsedData = data.map(d => ({
        key: d.key.toString(),
        name: d.value.toString()
      }))
      setShitLists(parsedData)
    })
  }, [query])

  return (
    <div>
      <ShadowBox>
        <WelcomeHeader>Welcome to ShitList!</WelcomeHeader>
        <p>
          Shit lists are useful for collecting data on your newborn's
          {' '}
          <Bold>eating</Bold>
          {' '}
          <Bold>sleeping</Bold>
          {' '}and{' '}
          <Bold>shitting</Bold>
          {' '}
          habits
        </p>
        <p>
          Easily share your lists with your friends and family!
        </p>
      </ShadowBox>
      { shitLists.length
        ? <ShitLists shitLists={shitLists} />
        : <NoListMsg>You don\'t have any shit lists. Why don't you create one?</NoListMsg>
      }
      <BtnWrapper>
        <Link to="/create"><CreateBtn>Create a new list</CreateBtn></Link>
        <Link to="/addlink"><AddLinkBtn>Link an existing list</AddLinkBtn></Link>
      </BtnWrapper>
    </div>
  )
}

function ShitLists({ shitLists }) {
  return (
    <div>
      <h3>Your Lists</h3>
      {shitLists.map(list => (
        <List key={list.key}>{ list.name }</List>
      ))}
    </div>
  )
}
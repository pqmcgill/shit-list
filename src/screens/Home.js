import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import levelup from 'levelup'
import levelJs from 'level-js'
import { Link } from 'react-router-dom'
import { colors } from '../style'
import Button from '../components/Button'
import ShadowBox from '../components/ShadowBox';
import useLevelDB from '../hooks/useLevelDB';

const WelcomeHeader = styled.h4`
  margin: 0.5rem 1rem 1rem 1rem;
  font-size: 1.3rem;
  text-align: center;
`

const Bold = styled.b`
  color: ${colors.darkBlue};
`

const ShitList = styled.li`
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
  justify-content: space-between;
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

const ShitLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`

const NoListMsg = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
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

function ShitLists({ shitLists }) {
  return (
    <div>
      <h3>Your Lists</h3>
      { shitLists.map(({ key, value}) => (
        <ShitLink to={`/list/${key}`}  key={key}>
          <ShitList>
            { value }
          </ShitList>
        </ShitLink>
      ))}
    </div>
  )
}

export default function Home() {
  const [shitLists, setShitLists] = useState([])
  const [loading, setLoading] = useState(true)
  const db = useLevelDB()

  useEffect(() => {
    let listAggregator = []
    const stream = db.createReadStream({ gt: 'shitlist-', lt: 'shitlist-\xff' })
    stream.on('data', d => listAggregator.push(d))
      .on('error', err => { throw err })
      .on('end', () => {
        setShitLists(listAggregator.map(d => ({
          key: d.key.toString().split('-')[1],
          value: d.value.toString()
        })))
        setLoading(false)
      })
  }, [db])

  return (
    <div>
      <ShadowBox>
        <WelcomeHeader>Welcome to the ShitList!</WelcomeHeader>
        <p>
          Shit lists are useful for collecting data on your newborn's
          {' '}
          <Bold>eating,</Bold>
          {' '}
          <Bold>sleeping,</Bold>
          {' and '}
          <Bold>pooping</Bold>
          {' habits '}
        </p>
        <p>Easily share your lists with your friends and family!</p>
      </ShadowBox>

      {loading 
        ? <NoListMsg>Loading shit lists...</NoListMsg>
        : shitLists.length 
          ? <ShitLists shitLists={shitLists}/>
          : <NoListMsg>You don't have any shit lists. Why don't you create one?</NoListMsg>
      }

      { !loading && (
        <BtnWrapper>
          <Link to='/create'><CreateBtn>Create a new list</CreateBtn></Link>
          <Link to='/addlink'><AddLinkBtn>Link an existing list</AddLinkBtn></Link>
        </BtnWrapper>
      )}
    </div>
  )
}
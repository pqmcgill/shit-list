import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const DateWrapper = styled.div`
  display: inline-block;
  font-size: 1.2rem;
`

const DateTime = function(props) {
  const {date} = props;
  return (
    <DateWrapper>
      {moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a')}
    </DateWrapper>
  )
}

export default DateTime;
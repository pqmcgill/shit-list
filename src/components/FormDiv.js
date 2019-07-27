import styled from 'styled-components';
import { colors } from '../style';

const FormDiv = styled.div`
  position: relative;
  top: 10vh;
  width: 50vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  background-color: ${colors.white}
  padding: 20px;
  margin: auto;
  overflow-y: scroll;
  font-size:1.2rem;
`

export default FormDiv;
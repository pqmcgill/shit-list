import styled from 'styled-components';
import Button from './Button';
import Input from './Input';
import { colors } from '../style';

export const FormDiv = styled.div`
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

export const FormGroup = styled.div`
width: 100%;
padding: 5px;
display: flex;
flex-direction: column;
align-items: center;
`

export const FormButton = styled(Button)`
  min-width: 100px;
  margin: 5px;
  ${props => props.isDisabled && `
    background-color:#C0C0C0;
    pointer-events:none;
  `}
`
export const CancelButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.neutral80}
`

export const NameInput = styled(Input)`
  width: 50%;
`
export const NumberInput = styled(Input)`
  width: 25%;
  font-size: 1.2rem;
  display: inline-block;
`
export const TimeInput = styled(Input)`
  width: 25%;
  font-size: 1.2rem;
  display: inline-block;
`

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`
export const HiddenRadioButton = styled.input.attrs({ type: 'radio' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`
export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`
import React, { Component } from 'react';
import Button from '../components/Button';
import DateTime from '../components/DateTime';
import FormDiv from '../components/FormDiv';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Modal from '../components/Modal';
import styled from 'styled-components';
import { emojis, colors } from '../style';
import EatForm from './EatForm';
import SleepForm from './SleepForm';

const FormButton = styled(Button)`
  min-width: 100px;
  margin: 5px;
  ${props => props.isDisabled && `
    background-color:#C0C0C0;
    pointer-events:none;
  `}
`
const CancelButton = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.neutral80}
`
const FormGroup = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const NameInput = styled(Input)`
  width: 50%;
`

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
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
const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const PoopIcon = styled.span`
  font-size:3rem;
  content:${emojis.poop},
`
class CreateEventForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: {
        loggedBy: '',
        entryTime: Date.now(),
        panic: false,
        notes: '',
        type: undefined,
      },
      typeSelected: false,
      
    }
  } 

  submit = (data) => {
   const {onSubmit} = this.props;
   onSubmit(data);
  }

  cancel = () => {
    this.props.onCancel();
  }

  selectType = e => {
    const {formData} = this.state;
    const type = e.target.value;
    this.setState({formData: {...formData, type}, typeSelected: true});
  }
  setName = e => {
    const {formData} = this.state;
    this.setState({formData: {...formData, loggedBy: e.target.value }});
  }
  setNotes = e => {
    const {formData} = this.state;
    this.setState({formData: {...formData, notes: e.target.value}});
  }
  setPanic = e => {
    const {formData} = this.state;
    this.setState({formData: {...formData, panic: e.target.checked}})
  }

  render() {
    const { formData, typeSelected }=this.state;
    return typeSelected ?
      (
        <Modal>
            {
              formData.type === 'eat' ? <EatForm formData={formData} submit={this.submit} cancel={this.cancel}/> :
              formData.type === 'sleep' ? <SleepForm formData={formData} submit={this.submit} cancel={this.cancel} /> :
              <PoopIcon>{emojis.poop}</PoopIcon>
            }
            <FormGroup>
              <strong>Logged By:</strong>
              <NameInput value={formData.loggedBy} onChange={this.setName} placeholder={"Name"} />
              <strong>Entered on</strong>
              <DateTime date={formData.entryTime} />
            </FormGroup>
            <FormGroup>
              Notes:
              <TextArea rows={5} value={formData.notes} onChange={this.setNotes} />
              </FormGroup>
              <FormGroup>
              <label>
                <CheckboxContainer>
                  <HiddenCheckbox checked={formData.panic} onChange={this.setPanic} />
                  {formData.panic ? '✅' : '⬜️'}
                </CheckboxContainer>
                <span>Panic?</span>
              </label>
              </FormGroup>
              <FormGroup>
                <FormButton onClick={this.submit} isDisabled={!formData.loggedBy}>Submit</FormButton>
                <CancelButton onClick={this.cancel} >Cancel</CancelButton>
              </FormGroup>
        </Modal>
      ) :
      (
        <Modal>
          <FormDiv>
            <FormButton onClick={this.selectType} value='eat'>Eat</FormButton>
            <FormButton onClick={this.selectType} value='sleep'>Sleep</FormButton>
            <FormButton onClick={this.selectType} value='poop'>Poop</FormButton>
          </FormDiv>
        </Modal>
      )
  }
}

export default CreateEventForm;
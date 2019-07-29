import React, { Component } from 'react';
import styled from 'styled-components';
import {FormDiv,
  FormGroup,
  FormButton,
  CancelButton,
  NameInput,
  NumberInput,
  CheckboxContainer,
  HiddenCheckbox,
  TimeInput } from './FormElements';
import TextArea from './TextArea'
import DateTime from './DateTime'
import {emojis} from '../style';

const SleepIcon = styled.span`
  font-size:3rem;
  content:${emojis.sleep},
`

export default class EatForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    
    this.state = {
      ...props.formData,
      startTime: '',
      endTime: ''
    };
    this.submit = props.submit;
    this.cancel = props.cancel;
  }

  setAmount = e => {
    // TODO: how to validate the time input?
    if (e.target.id === 'start-time') {
      this.setState({...this.state, start: e.target.value});
    }
    this.setState({...this.state, amount: e.target.value});
  }
  setName = e => {
    this.setState({...this.state, loggedBy: e.target.value });
  }
  setNotes = e => {
    this.setState({...this.state, notes: e.target.value});
  }
  setPanic = e => {
    this.setState({...this.state, panic: e.target.checked});
  }

  render() {
    const formData = this.state;
    return (
      <FormDiv>
        <SleepIcon>{emojis.eat}</SleepIcon>
          <FormGroup>
            <strong>Logged By:</strong>
            <NameInput value={formData.loggedBy} onChange={this.setName} placeholder={"Name"} />
            <strong>Entered on</strong>
            <DateTime date={formData.entryTime} />
          </FormGroup>
          <FormGroup>
            Start Time: <TimeInput value={formData.amount} type="datetime" onChange={this.setAmount}/>
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
              <FormButton onClick={() => this.submit(formData)} isDisabled={!formData.loggedBy}>Submit</FormButton>
              <CancelButton onClick={this.cancel} >Cancel</CancelButton>
            </FormGroup>
      </FormDiv>
    )
  }
}

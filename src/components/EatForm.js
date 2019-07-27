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
  HiddenRadioButton } from './FormElements';
import TextArea from './TextArea'
import DateTime from './DateTime'
import {emojis} from '../style';

const EatIcon = styled.span`
  font-size:3rem;
  content:${emojis.eat},
`

export default class EatForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    
    this.state = {
      ...props.formData,
      source: 'bottle',
      amount: 0,
    };
    this.submit = props.submit;
    this.cancel = props.cancel;
  }

  setSource = e => {
    this.setState({...this.state, source: e.target.id});
  }
  setAmount = e => {
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
        <EatIcon>{emojis.eat}</EatIcon>
          <FormGroup>
            <strong>Logged By:</strong>
            <NameInput value={formData.loggedBy} onChange={this.setName} placeholder={"Name"} />
            <strong>Entered on</strong>
            <DateTime date={formData.entryTime} />
          </FormGroup>
          <FormGroup>
            Food Source:
            <label>
              <CheckboxContainer>
                <HiddenRadioButton id='bottle' checked={formData.source === 'bottle'} onChange={this.setSource} />
                {formData.source === 'bottle' ? '🔵' : '⚪️'}
              </CheckboxContainer>
              <span>Bottle</span>
            </label>
            <label>
              <CheckboxContainer>
                <HiddenRadioButton id='boob' checked={formData.source === 'boob'} onChange={this.setSource} />
                {formData.source === 'boob' ? '🔵' : '⚪️'}
              </CheckboxContainer>
              <span>Boob</span>
            </label>
            Amount: <NumberInput value={formData.amount} type="number" onChange={this.setAmount}/> {formData.source === 'bottle' ? 'Oz.' : 'minutes'}
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

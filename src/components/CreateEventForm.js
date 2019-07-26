import React, { Component } from 'react';
import Button from '../components/Button';
import DateTime from '../components/DateTime';
import FormDiv from '../components/FormDiv';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import styled from 'styled-components';
import { emojis } from '../style';

const FormButton = styled(Button)`
  min-width: 100px;
  margin: 5px;
`
const FormGroup = styled.p`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const NameInput = styled(Input)`
  width: 50%;
`
const Checkbox = props => (
  <input type="checkbox" {...props} />
)

const EatIcon = styled.span`
  font-size:3rem;
  content:${emojis.eat},
`
const SleepIcon = styled.span`
  font-size:3rem;
  content:${emojis.sleep},
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

  submit = () => {
   const {onSubmit} = this.props;
   const {formData} = this.state;
   console.log(formData);
   onSubmit(formData);
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
        <FormDiv>
          {
            formData.type === 'eat' ? <EatIcon>{emojis.eat}</EatIcon> :
            formData.type === 'sleep' ? <SleepIcon>{emojis.sleep}</SleepIcon> :
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
            <Checkbox checked={formData.panic} onChange={this.setPanic} />
            <span>Panic?</span>
            </label>
            </FormGroup>
          <FormButton onClick={this.submit} >Submit</FormButton>
        </FormDiv>
      ) :
      (
        <FormDiv>
          <FormButton onClick={this.selectType} value='eat'>Eat</FormButton>
          <FormButton onClick={this.selectType} value='sleep'>Sleep</FormButton>
          <FormButton onClick={this.selectType} value='poop'>Poop</FormButton>
        </FormDiv>
      )
  }
}

export default CreateEventForm;
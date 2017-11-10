import React, { Component } from 'react';
import {
    Text, View,TextInput,
    Platform, Dimensions,
    DatePickerAndroid,
    TimePickerAndroid,
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import {CheckBox} from 'react-native-elements';
import moment from 'moment';
import 'moment-timezone';


import myStyles from './styles'
import flatListData from '../data/flatListData';
import ModalDropdown from 'react-native-modal-dropdown';

moment.tz.setDefault('Asia/Novosibirsk')
var screen = Dimensions.get('window');
export default class EditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskName: '',
            taskDescription: '',
            newPriority:'',
            taskMustComplete:'',
            taskIsComplete:false,
            taskWasCompleted:'',
        };
    }
    async openAndroidDatePicker() {
        try {
          const {action, year, month, day} = await DatePickerAndroid.open({
            date: new Date(),
            mode:'default',
          });
          if (action == DatePickerAndroid.dateSetAction){
            this.setState({year:year,month:month, day:day});
            this.setState({myDate:`${this.state.day}/${this.state.month}/${this.state.year}`});
          }else{
            alert('You have been close the Date')
          }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
      }

    async openAndroidTimePicker(){
        try {
          const {action, hour, minute} = await TimePickerAndroid.open({
            hour: 0,
            minute: 0,
            is24Hour: true,
          });
          if (action !== TimePickerAndroid.timeSetAction){
              alert('Вы не выбрали время')
          }else{
            this.setState({hour:hour, minutes:minute}) ;
            this.setState({myTime:`${this.state.hour}:${this.state.minutes}`});
            this.setState({taskMustComplete:this.state.myDate +' '+this.state.myTime});
          }
        } catch ({code, message}) {
          console.warn('Cannot open time picker', message);
        }
      }

    async _dateTime(){
        try {
            let getDate = await this.openAndroidDatePicker();
            let getTime = await this.openAndroidTimePicker();
        } catch (error) {
            console.log(error)
        }    
    }

    _checkBox = ()=>{
        var dateComplete = moment().format('DD/MM/YYYY HH:mm')
        this.setState({
            taskIsComplete:!this.state.taskIsComplete,
            taskWasCompleted:dateComplete,
        })
    }
    showEditModal = (editingTask, flatlistItem) => {                
        this.setState({
            key: editingTask.key,
            taskName: editingTask.name,
            taskDescription: editingTask.taskDescription,
            newPriority: editingTask.priority,
            taskMustComplete:editingTask.taskMustComplete,
            taskIsComplete:editingTask.taskIsComplete,
            taskWasCompleted:editingTask.taskWasCompleted,
            flatlistItem: flatlistItem
        });
        this.refs.myModal.open();
    } 
    generateKey = (numberOfCharacters) => {
        return require('random-string')({length: numberOfCharacters});        
    }
    render() {
        return (
            <Modal
                ref={"myModal"}
                style={myStyles.modal}
                position='center'
                backdrop={true}
                onClosed={() => {
                    // alert("Modal closed");
                }}
            >
                <Text style={myStyles.header}>Editing task</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={myStyles.textInput}           
                    onChangeText={(text) => this.setState({ taskName: text })}
                    placeholder="Edit task's name"
                    value={this.state.taskName}                 
                />
                <TextInput
                    underlineColorAndroid='transparent'
                    style={myStyles.textInput}           
                    onChangeText={(text) => this.setState({ taskDescription: text })}
                    placeholder="Edit task's description"
                    value={this.state.taskDescription}                 
                />
                <ModalDropdown
                    showsVerticalScrollIndicator={false}
                    style={myStyles.textInput}
                    textStyle={myStyles.text}
                    dropdownStyle={myStyles.dropdown}
                    dropdownTextStyle = {myStyles.dropdownText}
                    defaultValue ={this.state.newPriority}
                    animated={false}
                    options={['usual', 'important', 'very important']}
                    onSelect = {(idx, value) => this.setState({newPriority:value})}
                />
                <View style={[myStyles.textInput,myStyles.dateTime]}>
                    <Text 
                        style={{width:60, height:60}}
                        onPress = {()=>this._dateTime()}>
                    <Icon name="calendar"
                        size={40}
                        color='black'
                        />
                    </Text>
                    <Text style={myStyles.textInput}>
                        {this.state.taskMustComplete}
                    </Text>
                </View>
                <CheckBox
                    containerStyle={myStyles.textInput}
                    checked = {this.state.taskIsComplete}
                    onPress = {this._checkBox}
                    title={this.state.taskIsComplete?
                        `Задача выполнена :${this.state.taskWasCompleted}`:
                        'Задача не выполнена'}/>
                <Button
                    style={{ fontSize: 18, color: 'white' }}
                    containerStyle={{
                        padding: 8,
                        marginLeft: 70,
                        marginRight: 70,
                        height: 40,
                        borderRadius: 6,
                        backgroundColor: 'mediumseagreen'
                    }}
                    onPress={() => {
                         if (this.state.taskName.length == 0 || this.state.taskDescription.length == 0) {
                            alert("You must enter task's name and description");
                            return;
                        }       
                        //update existing task
                        var foundIndex = flatListData.findIndex(item => this.state.key == item.key);
                        if (foundIndex < 0) {
                            return; //not found
                        }
                        flatListData[foundIndex].name = this.state.taskName;
                        flatListData[foundIndex].taskDescription = this.state.taskDescription;
                        flatListData[foundIndex].priority = this.state.taskPriority;
                        flatListData[foundIndex].taskMustComplete = this.state.taskMustComplete;
                        flatListData[foundIndex].taskIsComplete = this.state.taskIsComplete;
                        flatListData[foundIndex].taskWasCompleted = this.state.taskWasCompleted;
                        //Refresh flatlist item
                        this.state.flatlistItem.refreshFlatListItem();
                        this.refs.myModal.close();                                                                       
                    }}>
                    Save
                </Button>
            </Modal>
        );
    }
}
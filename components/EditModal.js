import React, { Component } from 'react';
import {
    Text, View,TextInput,
    Platform, Dimensions,
    DatePickerAndroid,
    TimePickerAndroid,
    TouchableWithoutFeedback,
    Keyboard
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
        this.state = {};
    }

    async openAndroidDatePicker() {
        try {
          const {action, year, month, day} = await DatePickerAndroid.open({
            date: new Date(),
            mode:'default',
            minDate: new Date()
          });
          if (action == DatePickerAndroid.dateSetAction){
            this.setState({year:year,month:month+1, day:day});
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
            this.setState({editMustComplete:this.state.myDate +' '+this.state.myTime});
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
            editTaskIsComplete:!this.state.editTaskIsComplete,
            editDateComplete:dateComplete,
        })
    }
    showEditModal = (editingTask, flatlistItem) => {                
        this.setState({
            key: editingTask.key,
            editName: editingTask.name,
            editDescription: editingTask.description,
            editPriority: editingTask.priority,
            editMustComplete:editingTask.mustComplete,
            editTaskIsComplete:editingTask.isComplete,
            editDateComplete:editingTask.dateComplete,
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{flex:1}}>
                <Text style={myStyles.header}>Editing task</Text>
                <TextInput
                    underlineColorAndroid='transparent'
                    style={myStyles.textInput}           
                    onChangeText={(text) => this.setState({ editName: text })}
                    placeholder="Edit task's name"
                    value={this.state.editName}                 
                />
                <TextInput
                    underlineColorAndroid='transparent'
                    style={myStyles.textInput}           
                    onChangeText={(text) => this.setState({ editDescription: text })}
                    placeholder="Edit task's description"
                    value={this.state.editDescription}                 
                />
                <ModalDropdown
                    showsVerticalScrollIndicator={false}
                    style={myStyles.textInputNoSize}
                    textStyle={myStyles.text}
                    dropdownStyle={myStyles.dropdown}
                    dropdownTextStyle = {myStyles.dropdownText}
                    defaultValue ={this.state.editPriority}
                    animated={false}
                    options={['normal', 'important', 'very important']}
                    onSelect = {(idx, value) => this.setState({editPriority:value})}
                />
                <View style={[myStyles.textInputNoSize,myStyles.dateTime]}>
                    <Text 
                        style={{width:60, height:60}}
                        onPress = {()=>this._dateTime()}>
                    <Icon name="calendar"
                        size={40}
                        color='black'
                        />
                    </Text>
                    <Text style={myStyles.textInput}>
                        {this.state.editMustComplete}
                    </Text>
                </View>
                <CheckBox
                    containerStyle={myStyles.textInputNoSize}
                    checked = {this.state.editTaskIsComplete}
                    onPress = {this._checkBox}
                    title={this.state.editTaskIsComplete?
                        `Задача выполнена :${this.state.editDateComplete}`:
                        'Задача не выполнена'}/>
                        
                <View style={{
                    flex:1,
                    flexDirection:'row', 
                    justifyContent:'center'}}>
                    <Button
                        style={{fontSize: 18, color: 'white' }}
                        containerStyle={myStyles.buttonCancel}
                        onPress={() => {                              
                            this.refs.myModal.close();                                                                       
                        }}>
                        Отмена
                    </Button>
                <Button
                    style={{ fontSize: 18, color: 'white' }}
                        containerStyle={myStyles.buttonOk}
                    onPress={() => {
                         if (this.state.editName.length == 0 || this.state.editDescription.length == 0) {
                            alert("You must enter task's name and description");
                            return;
                        }       
                        //update existing task
                        var foundIndex = flatListData.findIndex(item => this.state.key == item.key);
                        if (foundIndex < 0) {
                            return; //not found
                        }
                        flatListData[foundIndex].name = this.state.editName;
                        flatListData[foundIndex].description = this.state.editDescription;
                        flatListData[foundIndex].priority = this.state.editPriority;
                        flatListData[foundIndex].mustComplete = this.state.editMustComplete;
                        flatListData[foundIndex].isComplete = this.state.editTaskIsComplete;
                        flatListData[foundIndex].dateComplete = this.state.editDateComplete;
                        //Refresh flatlist item
                        this.state.flatlistItem.refreshFlatListItem();
                        this.refs.myModal.close();                                                                       
                    }}>
                    Save
                </Button>
                </View>
            </View>
            </TouchableWithoutFeedback>
            </Modal>
        );
    }
}
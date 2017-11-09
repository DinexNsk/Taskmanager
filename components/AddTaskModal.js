import React, { Component } from 'react';
import {
    FlatList, StyleSheet, Text, View, Alert,
    Platform, Dimensions,TimePickerAndroid,
    TextInput,DatePickerAndroid, Keyboard, 
    TouchableWithoutFeedback,StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Modal from 'react-native-modalbox';
import ModalDropdown from 'react-native-modal-dropdown';
import Button from 'react-native-button';
import flatListData from '../data/flatListData';

  
var screen = Dimensions.get('window');
export default class AddTaskModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newTaskName: '',
            newTaskDescription: '',
            newPriority:'',
            myDate:'',
            myTime:' ',
            taskMustComlete:'',
        };
    }
    showAddTaskModal = () => {
        this.refs.myModal.open();
    }
    generateKey = (numberOfCharacters) => {
        return require('random-string')({length: numberOfCharacters});        
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
            this.setState({taskMustComlete:this.state.myDate +' '+this.state.myTime});
          }
        } catch ({code, message}) {
          console.warn('Cannot open time picker', message);
        }
      }


    render() {
        const clearState = {};
        return (
            <Modal
                style={styles.modal}
                ref={"myModal"}
                position='center'
                backdrop={true}
                onClosed={() => {
                    // alert("Modal closed");
                }}>
                <StatusBar hidden/>
                {/* Touchable needs here to fix Keyboard bug */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    }}>
                Adding new Task
                </Text>
                <TextInput
                    returnKeyType='next'
                    underlineColorAndroid='transparent'
                    style={styles.textInput}         
                    onChangeText={(text) => this.setState({ newTaskName: text })}
                    onEndEditing ={()=>Keyboard.dismiss()}
                    placeholder="Enter new Task's name"             
                />
                <TextInput
                    returnKeyType='next'
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({ newTaskDescription: text })}
                    placeholder="Enter new Task's description"
                    
                />
                <ModalDropdown
                    showsVerticalScrollIndicator={false}
                    style={styles.textInput}
                    textStyle={styles.text}
                    dropdownStyle={styles.dropdown}
                    dropdownTextStyle = {styles.dropdownText}
                    animated={false}
                    options={['usual', 'important', 'very important']}
                    defaultValue='Нажмите, чтобы выбрать приоритет'
                    onSelect = {(idx, value) => this.setState({newPriority:value})}
                />
                <View style={[styles.textInput,styles.dateTime]}>
                    <Text 
                        style={{width:60, height:60}}
                        onPress = {()=>
                            this.openAndroidTimePicker().then(
                            this.openAndroidDatePicker())}>
                    <Icon name="calendar"
                        size={40}
                        color='black'
                        />
                    </Text>
                    <Text style={styles.textInput}>
                        {this.state.taskMustComlete}
                    </Text>
                </View>
                <Button
                    style={{ fontSize: 18, color: 'white' }}
                    containerStyle={styles.button}
                    onPress={() => {
                         if (this.state.newTaskName.length == 0 || this.state.newTaskDescription.length == 0||
                            this.state.newPriority.length == 0) {
                            alert("Введена не вся информация");
                            return;
                        }       
                        const newKey = this.generateKey(24);
                        const newTask = {
                            key: newKey,
                            name: this.state.newTaskName,
                            taskDescription: this.state.newTaskDescription,
                            taskMustComlete: this.state.taskMustComlete,
                            priority:this.state.newPriority,
                            taskWasCompleted:'',
                            taskIsComplete:false,
                        };    
                        flatListData.push(newTask);    
                        this.props.parentFlatList.refreshFlatList(newKey);
                        Object.keys(this.state).forEach(stateKey => {
                          clearState[stateKey] = '';
                        });
                        this.setState(clearState);                                
                        this.refs.myModal.close();                                                                       
                    }}>
                    Save
                </Button>
                <Button
                    style={{fontSize: 18, color: 'white' }}
                    containerStyle={[styles.button, styles.cancel]}
                    onPress={() => {
                        Object.keys(this.state).forEach(stateKey => {
                            clearState[stateKey] = '';
                          });
                        this.setState(clearState);                               
                        this.refs.myModal.close();                                                                       
                    }}>
                    Отмена
                    </Button>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modal:{
        flex:1,
        justifyContent: 'center',
        borderRadius: Platform.OS === 'ios' ? 30 : 0,
        shadowRadius: 10,
        width: screen.width,
    },
    textInput:{
        height: 40,
        borderBottomColor: 'gray',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        borderBottomWidth: 1,
    },
    dateTime:{
        marginTop: 10,
        marginBottom: 5,
        flexDirection:'row',
    },
    dropdown: {
        margin:0,
        marginRight: 30,
        width:screen.width-60,
        height: 131,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
      },
    text:{
        height:40,
        fontSize:16,
        textAlignVertical:'center'
    },
    dropdownText:{
       borderWidth:0.2,
       fontSize:16,
    },
    button:{
        padding: 8,
        marginLeft: 70,
        marginRight: 70,
        height: 40,
        borderRadius: 6,
        backgroundColor: 'mediumseagreen'
    },
    cancel:{
        marginTop:20,
        backgroundColor: 'green',
    },
});


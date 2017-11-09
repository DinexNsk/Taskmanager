import React, { Component } from 'react';
import {
    AppRegistry, FlatList, StyleSheet, Text, View, Image, Alert,
    Platform, TouchableHighlight, Dimensions,
    TextInput,DatePickerAndroid,
    TimePickerAndroid,
} from 'react-native';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

import myStyles from './styles'
import flatListData from '../data/flatListData';
import ModalDropdown from 'react-native-modal-dropdown';

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
            taskWasCompleted:''
        };
    }
    showEditModal = (editingTask, flatlistItem) => {     
        // console.log(`editingTask = ${JSON.stringify(editingTask)}`);           
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
                    style={myStyles.textInput}           
                    onChangeText={(text) => this.setState({ taskName: text })}
                    placeholder="Edit task's name"
                    value={this.state.taskName}                 
                />
                <TextInput
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
                    animated={false}
                    options={['usual', 'important', 'very important']}
                    onSelect = {(idx, value) => this.setState({newPriority:value})}
                />
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
                            alert("You must enter food's name and description");
                            return;
                        }       
                        //Update existing Food
                        var foundIndex = flatListData.findIndex(item => this.state.key == item.key);
                        if (foundIndex < 0) {
                            return; //not found
                        }
                        flatListData[foundIndex].name = this.state.taskName;
                        flatListData[foundIndex].taskDescription = this.state.taskDescription;
                        flatListData[foundIndex].priority = this.state.taskPriority;
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
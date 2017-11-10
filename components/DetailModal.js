import React, { Component } from 'react';
import {
    FlatList, StyleSheet, Text, View, Alert,
    Dimensions,TextInput,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Modal from 'react-native-modalbox';
import Button from 'react-native-button';

import myStyles from './styles'
import flatListData from '../data/flatListData';

export default class DetailModal extends Component {
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

    showDetailModal = (editingTask, flatlistItem) => {     
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
                <Text style={myStyles.header}>{this.state.taskName}</Text>           
                <Text>Task description: {this.state.taskDescription}</Text>                 
                <Text>Task's priority : {this.state.newPriority}</Text>
                <Text style={myStyles.textInput}>
                    {this.state.taskMustComplete}
                </Text>
                <CheckBox
                    containerStyle={myStyles.textInput}
                    checked = {this.state.taskIsComplete}
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
                        this.refs.myModal.close();                                                                       
                    }}>
                    Return
                </Button>
            </Modal>
        );
    }
}


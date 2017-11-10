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
        };
    }

    showDetailModal = (currentTask) => {                
        this.setState({
            key: currentTask.key,
            taskName: currentTask.name,
            taskDescription: currentTask.taskDescription,
            newPriority: currentTask.priority,
            taskMustComplete:currentTask.taskMustComplete,
            taskIsComplete:currentTask.taskIsComplete,
            taskWasCompleted:currentTask.taskWasCompleted,
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
                <Text style={myStyles.textDescription}
                    >Task description: {this.state.taskDescription}</Text>                 
                <Text style={myStyles.textInput}>Task's priority : {this.state.newPriority}</Text>
                <Text style={myStyles.textInput}>
                    Task must complete: {this.state.taskMustComplete}
                </Text>
                <CheckBox
                    containerStyle={myStyles.textInputNoSize}
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


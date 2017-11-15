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
            detailName: currentTask.name,
            detailDescription: currentTask.description,
            detailPriority: currentTask.priority,
            detailMustComplete:currentTask.mustComplete,
            detailIsComplete:currentTask.isComplete,
            detailDateComplete:currentTask.dateComplete,
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
                <Text style={myStyles.header}>
                    "{this.state.detailName}"
                </Text>           
                <Text style={myStyles.textDescription}>
                    Task description: {this.state.detailDescription}
                </Text>                 
                <Text style={myStyles.textInput}>
                    Task's priority : {this.state.detailPriority}
                </Text>
                <Text style={myStyles.textInput}>
                    Task must complete: {this.state.detailMustComplete}
                </Text>
                <CheckBox
                    containerStyle={myStyles.textInputNoSize}
                    checked = {this.state.detailIsComplete}
                    title={this.state.detailIsComplete?
                        `Задача выполнена :${this.state.detailDateComplete}`:
                        'Задача не выполнена'}/>
                <Button
                    style={{ fontSize: 18, color: 'white'}}
                    containerStyle={[myStyles.button,{marginTop:20}]}
                    onPress={() => {   
                        this.refs.myModal.close();                                                                       
                    }}>
                    Return
                </Button>
            </Modal>
        );
    }
}


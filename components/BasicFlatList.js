import React, { Component } from 'react';
import { 
    AppRegistry, FlatList, StyleSheet,
    Text, View, Image, Alert, Platform,
    TouchableHighlight, StatusBar, Dimensions,  } from 'react-native';
import flatListData from '../data/flatListData';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons'

import AddTaskModal from './AddTaskModal';
import EditModal from './EditModal';

var screen = Dimensions.get('window');
class FlatListItem extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            activeRowKey: null,
            numberOfRefresh: 0,
        };
    }
    refreshFlatListItem = () => {
        this.setState((prevState) => {
            return {
                numberOfRefresh: prevState.numberOfRefresh + 1
            };
        });        
    }
    render() {   
        const swipeSettings = {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if(this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }              
            },          
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },      
            right: [
                { 
                    onPress: () => {                            
                        // alert("Update");
                        this.props.parentFlatList.refs.editModal.showEditModal(flatListData[this.props.index], this);
                    }, 
                    text: 'Edit', type: 'primary' 
                },
                { 
                    onPress: () => {    
                        const deletingRow = this.state.activeRowKey;          
                        Alert.alert(
                            'Alert',
                            'Are you sure you want to delete ?',
                            [                              
                              {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                              {text: 'Yes', onPress: () => {        
                                flatListData.splice(this.props.index, 1); 
                                //Refresh FlatList ! 
                                this.props.parentFlatList.refreshFlatList(deletingRow);
                              }},
                            ],
                            { cancelable: true }
                          ); 
                    }, 
                    text: 'Delete', type: 'delete' 
                }
            ],  
            rowId: this.props.index, 
            sectionId: 1    
        };               
        return (  
            <Swipeout {...swipeSettings}>

            <StatusBar hidden/>
                <View style={{flex: 1,flexDirection:'column'}}>           
                    <View style={{
                            flex: 1,
                            flexDirection:'row',                
                            backgroundColor: 'mediumseagreen',
                    }}>            
                        <View style={{
                                flex: 1,
                                flexDirection:'column',   
                                alignContent:'center',
                                alignItems:'center',                
                            }}>             
                            <Text style={[styles.flatListItem,{fontWeight:'bold'}]}>
                                "{this.props.item.name}"
                            </Text>
                            {/* asdasfasfasfasdsadsad */}
                            {this.props.item.taskIsComplete &&
                            <View >
                                <Text style={[styles.flatListItem,{color:'#f90101'}]}>
                                    Задача выполнена: {this.props.item.taskWasCompleted}
                                </Text>
                            </View> ||
                                <Text style={styles.flatListItem}>
                                    (Выполнить до: {this.props.item.taskMustComplete})
                                </Text>} 
                        </View>              
                    </View>
                    <View style={{
                        height: 1,
                        backgroundColor:'white'                            
                    }}>
                
                    </View>
                </View>   
            </Swipeout>      
            
        );
    }
}

export default class BasicFlatList extends Component {
    constructor(props) {
        super(props);     
        this.state = ({
            deletedRowKey: null,            
        });
        this._onPressAdd = this._onPressAdd.bind(this);        
    }
    refreshFlatList = (activeKey) => {
        this.setState((prevState) => {
            return {
                deletedRowKey: activeKey
            };
        });
        this.refs.flatList.scrollToEnd();
    }
    _onPressAdd () {
        // alert("You add Item");
        this.refs.addTaskModal.showAddTaskModal();
    }
    render() {
      return (
        <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
            <View style={styles.page}>
                <TouchableHighlight 
                    style = {styles.touchable}
                    underlayColor='tomato'
                    onPress={this._onPressAdd}
                    >
                    <View style={styles.page}>
                        <Text style={styles.text}>
                            Добавить задачу
                        </Text>
                        <Image
                            style={{width: 35, height: 35}}
                            source={require('../icons/icons-add.png')}/>
                    </View>
                </TouchableHighlight>
            </View>
            <FlatList 
                style={{flex:1}}
                ref={"flatList"}
                data={flatListData}
                renderItem={({item, index})=>{
                    //console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
                    return (
                    <FlatListItem item={item} index={index} parentFlatList={this}>

                    </FlatListItem>);
                }}
                >

            </FlatList>
            <AddTaskModal ref={'addTaskModal'} parentFlatList={this} >

            </AddTaskModal>
            <EditModal ref={'editModal'} parentFlatList={this}>

            </EditModal>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    page:{
        backgroundColor: 'tomato', 
        flexDirection: 'row',
        justifyContent:'center',                
        alignItems: 'center',
        height: 64
    },
    flatListItem: {
        color: 'white',
        padding: 10,
        fontSize: 17,
        fontStyle:'italic'    
    },
    touchable: {
        flex:1,
        flexDirection:'row', 
        justifyContent:'center'
    },
    text :{
        fontSize:24,
        padding:10,
        color:'white'
    }

});


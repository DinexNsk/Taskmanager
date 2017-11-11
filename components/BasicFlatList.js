import React, { Component } from 'react';
import { 
    AppRegistry, FlatList, StyleSheet,
    Text, View, Image, Alert, Platform,
    TouchableHighlight, StatusBar, Dimensions, Button,  } from 'react-native';
import flatListData from '../data/flatListData';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons'

import moment from 'moment';
import 'moment-timezone';

import myStyles from './styles'
import AddTaskModal from './AddTaskModal';
import EditModal from './EditModal';
import DetailModal from './DetailModal'

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
            buttonWidth:50,
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
                            `Deleting "${this.props.item.name}"`,
                            'Are you sure?',
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
            <TouchableHighlight
                title='detail'
                onPress={()=>{
                this.props.parentFlatList.refs.detailModal.
                    showDetailModal(flatListData[this.props.index])}
                }>  
                <View style={{flex: 1,flexDirection:'column'}}>           
                    <View style={{
                            flex: 1,
                            flexDirection:'row',                
                            backgroundColor: '#d35400',
                    }}>             
                        <View style={{
                                flex: 1,
                                flexDirection:'row',   
                                alignContent:'center',
                                alignItems:'center',                
                            }}>
                            <View style={{flex: 1}}>
                                <Text style={{
                                    fontSize:20,
                                    marginLeft:5,
                                    borderWidth:2,
                                    borderRadius: 50,
                                    borderColor:'red',
                                    textAlign:'center',
                                    color:'blue',
                                    fontStyle:'italic'
                                }}>
                                    {this.props.item.priority[0].toUpperCase()}
                                </Text>
                            </View>
                            <View style={{
                                flex: 17,
                                alignItems:'flex-start',                
                            }}>        

                            {moment(this.props.item.mustComplete, "DD-MM-YYYY HH-mm").isBefore(
                                    moment()) && !this.props.item.isComplete &&
                                    <Text style={[myStyles.flatListItem,
                                                {fontWeight:'bold', backgroundColor:'red'}]}>
                                        "{this.props.item.name}"
                                    </Text>
                                ||
                                    <Text style={[myStyles.flatListItem,{fontWeight:'bold'}]}>
                                        "{this.props.item.name}"
                                    </Text>
                            }

                            {this.props.item.isComplete &&
                                <Text style={{
                                    color:'#2ecc71',
                                    fontSize:18,
                                    fontWeight:'bold',
                                    padding: 10,}}>
                                    Задача выполнена: {this.props.item.dateComplete}
                                </Text>
                                 ||
                                <Text style={myStyles.flatListItem}>
                                    (Выполнить до: {this.props.item.mustComplete})
                                </Text>
                            } 
                            </View> 
                        </View>              
                    </View>
                    <View style={{
                        height: 1,
                        backgroundColor:'black'                            
                    }}>
                
                    </View>
                </View>  
                </TouchableHighlight> 
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
      var  myFilter ='normal'
      return (
        <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
            <View style={myStyles.page}>
                <TouchableHighlight 
                    style = {myStyles.touchable}
                    underlayColor='#d35400'
                    onPress={this._onPressAdd}
                    >
                    <View style={myStyles.page}>
                        <Text style={myStyles.textBasic}>
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
            <DetailModal ref={'detailModal'} parentFlatList={this}>

            </DetailModal>
        </View>
      );
    }
}



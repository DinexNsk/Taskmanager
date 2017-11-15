import React, { Component } from 'react';
import { 
    AppRegistry, FlatList, StyleSheet,
    Text, View, Image, Alert, Platform,AsyncStorage,
    TouchableHighlight, StatusBar, Dimensions, Button,
    TouchableWithoutFeedback  } from 'react-native';
import flatListData from '../data/flatListData';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/Ionicons'
import ModalDropdown from 'react-native-modal-dropdown';
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

    async deleteTask(value){
        try {
            let getData = await AsyncStorage.getItem("myData")
            let deletingData = JSON.parse(getData)

            deletingData.splice(value, 1)
            AsyncStorage.setItem("myData", JSON.stringify(deletingData))
            this.props.parentFlatList.setState({isChanged:true})
        } catch (error) {
            console.log(error)
        }
        
    }
    render() { 
        const swipeSettings = {
            buttonWidth:50,
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }              
            },          
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },      
            right: [
                { 
                    onPress: () => {                            
                        this.props.parentFlatList.refs.editModal.showEditModal(
                            this.props.parentFlatList.state.myData[this.props.index], this);
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
                                this.deleteTask(this.props.index); 
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
                    showDetailModal( this.props.parentFlatList.state.myData[this.props.index])}
                }>  
                <View style={{flex: 1,flexDirection:'column'}}>           
                    <View style={{
                            flex: 1,
                            flexDirection:'row',                
                            backgroundColor: '#d35400',
                    }}>             
                        <View style = {{
                                flex: 1,
                                flexDirection:'row',   
                                alignContent:'center',
                                alignItems:'center',                
                            }}>
                            <View style={{flex: 1}}>
                                <Text style = {{
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
        this.state =({
            deletedRowKey: null,
            filter:'all',
            myData:'',
            isChanged:false
        });
        this._onPressAdd = this._onPressAdd.bind(this);        
    }

    scrollFlatList(){
        this.refs.flatList.scrollToEnd();
    }

    _onPressAdd () {
        this.refs.addTaskModal.showAddTaskModal();
    }

    componentWillMount(){
        try {
            this.asyncData()
        } catch (error) {
            console.log(error)
        }  
    }

    componentDidUpdate(){
        if ( this.state.isChanged == true ){
            this.modifiedData()
        }
    }

    //init value for the state.myData before render
    async asyncData(){
        try {
            let getData = await AsyncStorage.getItem("myData");
            // true only on the first run of program
            if ( getData == null ){       
                console.log('Async is empty')  
                AsyncStorage.setItem('myData', JSON.stringify(flatListData));
                let parsedData = JSON.parse(getData);
                this.setState({ myData:parsedData });
            } else {
                let parsedData = JSON.parse(getData);
                this.setState({ myData:parsedData })
                console.log('Something already in the AsyncStorage');
            }
        } catch (error) {
            console.log(error)
        }
    }
    //call it when something has changed
    async modifiedData(){
        try {
            let getData = await AsyncStorage.getItem("myData");
            let parsedData = JSON.parse(getData);
            let filteredData = parsedData.filter((el)=>{
                return this.state.filter!='all'?(el.priority == this.state.filter):
            (el.priority == 'normal')|(el.priority == 'important')
            |(el.priority == 'very important')
            })
            this.setState({ myData:filteredData, isChanged:false })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
      return (
        <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 34 : 0}}>
            <View style={myStyles.page}>
                <TouchableWithoutFeedback 
                    style = {myStyles.touchable}
                    onPress = {this._onPressAdd}
                    >
                    <View style = {myStyles.page}>
                        <Text style = {myStyles.textBasic}>
                            Добавить задачу
                        </Text>
                        <Image
                            style = {{width: 35, height: 35}}
                            source = {require('../icons/icons-add.png')}/>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {/* dropdown filter */}
            <ModalDropdown
                    showsVerticalScrollIndicator = {false}
                    style = {myStyles.modalFilter}
                    textStyle = {myStyles.textFilter}
                    dropdownStyle = {myStyles.dropdownFilter}
                    dropdownTextStyle = {myStyles.dropdownTextFilter}
                    defaultValue = 'Выберите важность задачи'
                    animated = {false}
                    options = {['all', 'normal', 'important', 'very important']}
                    onSelect = {(idx, value) =>this.setState({ filter:value, isChanged:true })}
                />
            <FlatList 
                style = {{flex:1}}
                ref = {"flatList"}
                data = {this.state.myData}
                parentFlatList = {this}
                renderItem = {({item, index}) => {
                    return (
                    <FlatListItem 
                        item = {item} 
                        index = {index} 
                        parentFlatList = {this}
                    >
                    </FlatListItem>);
                }}
                >

            </FlatList>
            <AddTaskModal ref = {'addTaskModal'} parentFlatList = {this} >

            </AddTaskModal>
            <EditModal ref = {'editModal'} parentFlatList = {this}>

            </EditModal>
            <DetailModal ref = {'detailModal'} parentFlatList = {this}>

            </DetailModal>
        </View>
      );
    }
}



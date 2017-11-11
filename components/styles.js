import React from 'react-native';
import { Platform, Dimensions } from 'react-native'

var screen = Dimensions.get('window');
var myStyles = React.StyleSheet.create({

    container: {
        flex: 1
    },
    modal:{
        paddingTop:40,
        flex:1,
        justifyContent: 'center',
        borderRadius: Platform.OS === 'ios' ? 30 : 0,
        shadowRadius: 10,
        width: screen.width,
    },
    flatListItem: {
        color: 'white',
        padding: 10,
        fontSize: 17,
        fontStyle:'italic'    
    },
    header:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textInput:{
        fontSize:18,
        height: 40,
        borderBottomColor: 'gray',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        borderBottomWidth: 1,
    },
    textInputNoSize:{
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
        fontSize:18,
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
    page:{
        backgroundColor: '#2ecc71', 
        flexDirection: 'row',
        justifyContent:'center',                
        alignItems: 'center',
        height: 64
    },
    touchable: {
        flex:1,
        flexDirection:'row', 
        justifyContent:'center'
    },
    textBasic :{
        fontSize:24,
        padding:10,
        color:'white'
    },
    textDescription:{
        fontSize:18,
        borderBottomColor: 'gray',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        borderBottomWidth: 1,
    },
    buttonOk:{
        marginRight: 30,
        marginTop: 20,
        padding: 8,
        height: 40,
        flex:1,
        borderRadius: 6,
        backgroundColor: '#3498db'
    },
    buttonCancel:{
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        flex:1,
        padding: 8,
        height: 40,
        borderRadius: 6,
        backgroundColor: 'green'
    },
    modalFilter: {
        height: 40,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    textFilter:{
        height:40,
        textAlign:'center',
        justifyContent:'center',
        fontSize:18,
        textAlignVertical:'center'
    },
    dropdownTextFilter:{
        borderWidth:0.2,
        fontSize:18,
        textAlign:'center'
    },
    dropdownFilter: {
        width:screen.width,
        height: 175,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
    },
})

module.exports = myStyles;
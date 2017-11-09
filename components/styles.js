import React from 'react-native';
import { Platform, Dimensions } from 'react-native'

var screen = Dimensions.get('window');
var myStyles = React.StyleSheet.create({

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
    header:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
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
})

module.exports = myStyles;
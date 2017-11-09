/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import BasicFlatList from './components/BasicFlatList';


export default class App extends Component {
  render() {
    return (
      <BasicFlatList/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});




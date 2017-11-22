/**
 * Created by Shoaib on 12/6/2016.
 */
import React, {
  Component,
} from 'react';

import {
  Navigator,
  ScrollView,
  TouchableOpacity,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  ListView,
  Image,
  AsyncStorage,
  Switch,
} from 'react-native';


import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
import Icon from '../stylesheet/icons'
const {height, width} = Dimensions.get('window');
import * as Animatable from 'react-native-animatable';

var ds;
var SelectList = React.createClass(
  {
    getInitialState() {
      ds = new ListView.DataSource({
        rowHasChanged: (oldRow, newRow) => {
        }
      });
      return {
        listSource: ds.cloneWithRows(this.props.Data),
        showList: false,
        rowData: [],
      }
    },


    render() {
      return (
        <View style={{position: 'relative'}}>

          <TouchableOpacity style={styles.listStyle}
                            onPress={() => this.setState({showList: !this.state.showList})}>
            <Text style={{
              alignSelf: 'center',
              justifyContent: 'center',
              color: 'grey',
              marginVertical: 5,
              marginHorizontal: 10,
              fontFamily: Fonts.regFont[Platform.OS]
            }}>Payment Methods </Text>
          </TouchableOpacity>


          {this.state.showList ? this.renderList() : <View/>}

        </View>
      );
    },

    renderListItem(rowData, sectionID, rowID) {
      return (
        <TouchableOpacity style={[Style.listRow, {width: 140}]} onPress={() => {
          this.setState({showList: !this.state.showList});
          this.props.onItemPress(rowData.methodId)
        }}>
          <View style={[Style.rowWithSpaceBetween]}>
            <View style={Style.row}>
              <Text style={styles.textStyle}>
                <Icon name={'icon-credit-card'} fontSize={18} color={'black'}/>
              </Text>
              <Text style={styles.textStyle}>
                {rowData.addtionalParameters.brand + ' Card'}
              </Text>
            </View>
          </View>
          <View style={[Style.rowWithSpaceBetween]}>
            <View style={Style.row}>
              <Text style={styles.textStyle}>
                {'Name'}
              </Text>
              <Text style={styles.textStyle}>
                {rowData.name}
              </Text>
            </View>
          </View>
          <View style={[Style.rowWithSpaceBetween]}>
            <View style={[Style.row, {flexDirection: 'column'}]}>
              <Text style={styles.textStyle}>
                {'Card Number'}
              </Text>
              <Text style={[styles.textStyle, {fontSize: 10}]}>
                {'**** **** **** ' + rowData.addtionalParameters.last4}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );

    },

    renderList() {
      return (

        <View style={{zIndex: 3, alignSelf: 'center', width: 150, height: 500, flex: 4, position: 'absolute'}}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.listSource}
            renderRow={this.renderListItem}
            bounces={false}
          />
        </View>
      );
    },

    blockUserRelation() {
      console.log("Block User Relation Called")
    },

    unfriendRelation() {
      console.log("Unfriend Relation Called")
    },

  });

const styles = StyleSheet.create({
  listStyle: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  textStyle: {
    color: 'black',
    fontSize: 12,
    padding: 5,
    fontFamily: Fonts.regFont[Platform.OS]
  }

});

export default SelectList;

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  AsyncStorage,
  ListView
} from 'react-native';

import get from '../../../lib/get';


let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
	'left_caret': require('../../../res/common/back.png'),
	'plus': require('../../../res/common/add.png'),
};

import MenuBar from '../../common/MenuBar';
import SingleAddress from './components/SingleAddress';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

let HomeAddresses = React.createClass({

  getInitialState () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      addresses: ds,
      addressesList: [],
      show: false,
    };
  },

  componentDidMount () {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({ token: value });
      // This get method will get all Home Address(es) of user
      return get(value, 'Users/Profile/Addresses/home');
    })
    .then((value) => {
      // console.log(value);
      this.setState({
        addresses: this.state.addresses.cloneWithRows(value),
        addressesList: value,
        show: true,
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  },
  onPressBack () {
    this.props.navigator.pop();
  },
  updateView() {
    console.log("@@@@@@@@@2Welcome Back@@@@@@");
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({ token: value });
        // This get method will get all Home Address(es) of user
        return get(value, 'Users/Profile/Addresses/home');
      })
      .then((value) => {
        // console.log(value);
        this.setState({
          addresses: this.state.addresses.cloneWithRows(value),
          addressesList: value,
          show: true,
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  },
  onPressAdd () {
    this.props.navigator.push({ id: 131, type: 'HOME_ADDRESS', onUnmount: () => this.updateView()} );
  },

  onPressUpdateList () {
    get(this.state.token, 'Users/Profile/Addresses/home')
    .then((value) => {
      this.setState({ addresses: this.state.addresses.cloneWithRows(value) });
    })
    .catch((error) => {
      console.log('Error: onPressUpdateList', error);
    });
  },

  renderAddresses (rowData, sectionID, rowID) {
    // let {name, address1, address2, zipCode, city, state, country} = rowData;
    let {navigator} = this.props;
    let {address1, address2} = rowData;
    address1 = address1.trim();
    address2 = address2.trim();
    return (
      <SingleAddress
        key={rowID}
        navigator={navigator}
        token={this.state.token}
        {...rowData}
        addressId = {rowData.id}
        address1={address1}
        address2={address2}
        onPressUpdateList={this.onPressUpdateList}
      />
    );
  },

  render () {
    let {addresses, addressesList} = this.state;
    let {navigator} = this.props;
    addressesList = addressesList ? addressesList : [];
    renderEmpty = () => {
      if (this.state.show) {
        return (
          <View style={styles.emptyContainer}>
            <Text
              style={[Style.center, Style.f16]}>
                You Don't Have Any Addresses Added Yet
            </Text>
          </View>
        );
      }
    }

    renderList = () => {
      return (
        <ListView
          ref = 'list'
          style={styles.listView}
          dataSource={addresses}
          renderRow={this.renderAddresses}
          enableEmptySections={true}
          bounces = {false}
        />
      );
    }

    return (
      <View style = {styles.container}>

        <MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {'Home'} // Optional
          leftIcon = {'icon-back_screen_black'}
          rightIcon = {'+'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          onPressRightIcon = {this.onPressAdd} // Optional
        />

        <View style={styles.wrapper}>
          {addressesList.length > 0 ? renderList() : renderEmpty()}
        </View>
      </View>
    )
  }
});

const styles = StyleSheet.create({

	container: {
		flex:1,
		backgroundColor: StyleConstants.lightGray,
	},

	wrapper: {
		marginTop: 5,
		marginHorizontal: 5,
		flex: 1,
		// backgroundColor: 'white'
	},

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },

});


export default HomeAddresses;

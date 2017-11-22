import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  ListView,
  TextInput,
  ScrollView
} from 'react-native';
import {
  Style,
} from '../../stylesheet/style';
import SingleAddress from '../../settings/address/components/SingleAddress';
import Swiper from 'react-native-swiper';
var rightArrow = require('../../../res/common/subscribe_card_icon.png');
var creditCard = require('../../../res/common/credit_debit_card.png');
var { height, width } = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var address = [ {
      addressId: '12233',
      name:'Ehtisham Rao',
      address1:'Lahore Pakistan',
      address2:'Karachi Pakistan',
      zipCode:54000,
      city:'Lahore',
      state:'Punjab',
      country:'Pakistan',
      isDefault:'true',
},
{
      addressId: '12233',
      name:'Ehtisham Rao',
      address1:'Lahore Pakistan',
      address2:'Karachi Pakistan',
      zipCode:54000,
      city:'Lahore',
      state:'Punjab',
      country:'Pakistan',
      isDefault:'true',
}, ]


var paymentmethod = [  {
  "methodId": "b0e86b824b814ac4af221fd762b11f7e",
  "name": "Adeel",
  "addtionalParameters": {
    "token": "tok_19G4fyGM7D7lAlOfuW6EipD7",
    "last4": "4242",
    "brand": "Visa",
    "country": "US",
    "exp_month": "12",
    "exp_year": "2017",
    "funding": "credit"
  },
  "isDefault": false,
  "createdAt": "2016-11-15T11:00:30.389Z",
  "updatedAt": "2016-11-16T14:22:16.066Z"
},
]
let SelectCard = React.createClass({
  getInitialState()
  {
    return {
      SwitchState:  false,
      addresses:ds
    }
  },

  componentDidMount () {
    AsyncStorage.getItem("UserToken")
    .then((value) => {
      this.setState({ token: value });
      // This get method will get all Home Address(es) of user
      //return get(value, 'ProfileCard/GetAddress/billing');
      this.setState({
        addresses: this.state.addresses.cloneWithRows(value),
        show: true,
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
    });
  },
  renderPaymentMethods () {
       return(     <Swiper
          loop={true}
          height={height*0.23}
          width = {width}
          showButtons ={true}
        >
        <View style= {[Style.rowWithSpaceBetween, {marginHorizontal:20}]}>
          <Image
              source= {creditCard}
              resizeMode={'contain'}
              style = {{height:100,width:150}}
          />
          <View style={[{flexDirection: 'column', alignSelf:'center', justifyContent:'center',marginRight:20}]}>
            <Text style = {styles.textStyle}>
              3965
            </Text>
            <Text style = {styles.textStyle}>
              Ehtisham Rao
            </Text>
            <Text style = {styles.textStyle}>
              20/11/2016
            </Text>
          </View>
        </View>
        <View style= {[Style.rowWithSpaceBetween, {marginHorizontal:20}]}>
          <Image
              source= {creditCard}
              resizeMode={'contain'}
              style = {{height:100,width:150}}
          />
          <View style={[{flexDirection: 'column', alignSelf:'center', justifyContent:'center',marginRight:20}]}>
            <Text style = {styles.textStyle}>
              3965
            </Text>
            <Text style = {styles.textStyle}>
              Ehtisham Rao
            </Text>
            <Text style = {styles.textStyle}>
              20/11/2016
            </Text>
          </View>
        </View>  
        <View style= {[Style.rowWithSpaceBetween, {marginHorizontal:20}]}>
          <Image
              source= {creditCard}
              resizeMode={'contain'}
              style = {{height:100,width:150}}
          />
          <View style={[{flexDirection: 'column', alignSelf:'center', justifyContent:'center',marginRight:20}]}>
            <Text style = {styles.textStyle}>
              3965
            </Text>
            <Text style = {styles.textStyle}>
              Ehtisham Rao
            </Text>
            <Text style = {styles.textStyle}>
              20/11/2016
            </Text>
          </View>
        </View> 
        </Swiper>);
  },

  renderInputs() {
    return(
      <View>
       <TextInput
                ref = "BillingAddress"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter Billing Address Here..."
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {true}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(BillingAddress) => {
                  this.setState({ BillingAddress });
                }}
          />
        <View style={styles.lineSeparator} />
         <TextInput
                ref = "BillingAddress"
                placeholderTextColor={StyleConstants.textColorGray}
                placeholder="Enter Billing Address Here..."
                autoCapitalize = "words"
                keyboardType = "default"
                multiline = {true}
                returnKeyType = "done"
                underlineColorAndroid = "transparent"
                style={[styles.textInput, Style.f20]}
                onChangeText={(BillingAddress) => {
                  this.setState({ BillingAddress });
                }}
          />
          </View>
      );
  },

  renderList() {
      return (
        <ListView
          ref = 'list'
          style={styles.listView}
          dataSource={this.state.addresses}
          renderRow={this.renderAddresses}
          enableEmptySections={true}
          bounces = {false}
        />
      );
    },

  render() {
    return (
      <View>
       {this.renderStickyHeader()}
      <ScrollView >
        {this.renderPaymentMethods()}
        <View style={styles.lineSeparator} />
        {this.renderList()}
        {this.renderInputs()}
      </ScrollView>
      </View>
    );
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
        address1={address1}
        address2={address2}
        onPressUpdateList={this.onPressUpdateList}
      />
    );
  },

  renderStickyHeader() {
    return(
      <View>
        <TitleBar
          leftButton = {require('../../../res/common/back.png')}
          title = "Select Card"
          onLeftButtonPress={()=> this.props.navigator.pop() }
        />
      </View>
    );
  },
});

export default SelectCard;

let styles = StyleSheet.create({
  textStyle: {
    color:'black',
    fontSize:18,
    justifyContent:'flex-start',
    alignSelf: 'flex-start'
  },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    width: width - 20,
    marginHorizontal: 10,
  },

    textInput: {
    height: 100,
    padding: 0,
    marginHorizontal: 25,
    marginVertical: 10,
  },
  textStyleMini: {
    color:'black',
    fontSize:14,
    justifyContent:'center',
    alignSelf: 'flex-start'
  },


});
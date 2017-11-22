/**
 * Created by Shoaib on 11/14/2016.
 */
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Style,
} from '../stylesheet/style';

var rightArrow = require('../../res/common/arrow_right.png');
var { height, width } = Dimensions.get('window');
let PaymentHistory = React.createClass({
  getInitialState()
  {
    return {SwitchState:  false}
  },

  renderRowPayment(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity style={Style.listRow}>
        <View style = {[Style.rowWithSpaceBetween]}>
          <View style = {Style.row}>

          </View>
        </View>
      </TouchableOpacity>
    );

  },

  renderPayments() {
    var navigator = this.props.navigator;
    return (
      <View >
        <View  />
        <ListView
          enableEmptySections = {true}
          dataSource = {this.state.contactSource}
          renderRow = {this.renderRowPayment}
          bounces = {false}
        />
      </View>
    );
  },
  render() {
    return(
      <View>
        {this.renderStickyHeader()}
        <TouchableOpacity
          // onPress = {this.openCreator}
          style = {[ styles.spInfo,{marginTop: 10,backgroundColor:'black', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }]}>
          <Image
            style = {styles.SPLogoImageLarge}
            source = {{ uri:"https://3.bp.blogspot.com/-W__wiaHUjwI/Vt3Grd8df0I/AAAAAAAAA78/7xqUNj8ujtY/s1600/image02.png" }}
            resizeMode = {'cover'}
          />
        </TouchableOpacity>
        <View style={[Style.rowWithSpaceBetween,{marginHorizontal:15,marginVertical:15}]}>

        </View>
        <View style={styles.lineSeparator}/>
        <View style={[Style.rowWithSpaceBetween,{marginHorizontal:15}]}>
          <View style={{flexDirection:'column'}} >
            <Text style={[styles.textStyle]}>
              Subscription Paid
            </Text>
            <Text style={[styles.textStyleMini]}>
              Via VISA
            </Text>
            <Text style={[styles.textStyleMini]}>
              Nov 14 2016 11:34:56 AM
            </Text>
          </View>
          <Text style={[styles.textStyle,{color:'red', alignSelf:'center'}]}>
            $4.99
          </Text>
        </View>
        <View style={styles.lineSeparator}/>
        <View style={[Style.rowWithSpaceBetween,{marginHorizontal:15}]}>
          <View style={{flexDirection:'column'}} >
            <Text style={[styles.textStyle]}>
              Subscription Paid
            </Text>
            <Text style={[styles.textStyleMini]}>
              Via VISA
            </Text>
            <Text style={[styles.textStyleMini]}>
              Nov 14 2016 11:34:56 AM
            </Text>
          </View>
          <Text style={[styles.textStyle,{color:'red', alignSelf:'center'}]}>
            $4.99
          </Text>
        </View>
        <View style={styles.lineSeparator}/>
        <View style={[Style.rowWithSpaceBetween,{marginHorizontal:15}]}>
          <View style={{flexDirection:'column'}} >
            <Text style={[styles.textStyle]}>
              Subscription Paid
            </Text>
            <Text style={[styles.textStyleMini]}>
              Via VISA
            </Text>
            <Text style={[styles.textStyleMini]}>
              Nov 14 2016 11:34:56 AM
            </Text>
          </View>
          <Text style={[styles.textStyle,{color:'red', alignSelf:'center'}]}>
            $4.99
          </Text>
        </View>
        <View style={styles.lineSeparator}/>

      </View>
    );
  },

  renderStickyHeader() {
    return(
      <View>
        <TitleBar
          leftButton = {require('../../res/common/back.png')}
          title = "Family Group"
          onLeftButtonPress={()=> this.props.navigator.pop() }
        />
      </View>
    );
  },
});

export default PaymentHistory;

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
  SPLogoImage:
  {
    width: 53,
    height: 53,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: 'white',
    marginRight: width/60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spInfo:
  {
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyleMini: {
    color:'black',
    fontSize:14,
    justifyContent:'center',
    alignSelf: 'flex-start'
  },


});
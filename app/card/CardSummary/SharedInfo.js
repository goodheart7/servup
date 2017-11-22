import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
  Platform,
  ListView,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';

import {
  Style,
  StyleConstants,
  Fonts
} from '../../stylesheet/style';


const {height, width} = Dimensions.get('window');

import Checkbox from '../InputComponents/Checkbox';
import Size from '../InputComponents/Size';
import RadioButton from '../InputComponents/RadioButton';
import Color from '../InputComponents/Color';

import MenuBar from '../../common/MenuBar';

let SharedInfo = React.createClass({

  getInitialState () {
    return {
      listOfAttributes: [],
    }
  },

  componentDidMount () {
    let attributes = this.props.questions;
    console.log('@@@@@@@@@@@ attributes', attributes);
    this.setState({listOfAttributes: attributes});

  },

  renderAttributes(){
    let {listOfAttributes} = this.state;
    console.log('rendering attributsses', listOfAttributes);
    return listOfAttributes.map((item, key) => {
      return (
        <View key={key}>
          <View>
            <Text style={styles.textStyle}>
              {item.question}
            </Text>
            <View style={[Style.rowWithSpaceBetween, {marginHorizontal: 10}]}>
              {this.renderAttributeType(item.typeOfField, item.listOfValues, item.question, item.selectedAnswers)}
            </View>
          </View>
          <View style={styles.lineSeparator}/>
        </View>
      );
    })
  },

  renderTextInput(fieldName, selectedValues){
    return (
      <View>
        <Text style={styles.textStyle}>
          {selectedValues}
        </Text>
      </View>
    );
  },

  onPressBack() {
    this.props.navigator.pop();
  },

  renderStickyHeader() {
    return (
      <MenuBar
        // color = {'red'} // Optional By Default 'black'
        title={"Shared Information "} // Optional
        leftIcon={'icon-back_screen_black'}
        onPressLeftIcon={this.onPressBack} // Optional
      />
    );
  },

  renderAttributeType(type, values, name, selectedValues){
    //type is typeofFeild
    // values is list of Values
    // name is name of attributes
    //Sekected values are selected values
    /*console.log('@@@@@@ attribute type: ', type);
     console.log('@@@@@@ attribute name: ', name);
     console.log('@@@@@@ attribute values: ', values);
     console.log('@@@@@@ attribute selected Values: ', selectedValues);*/

    if (type == "choice") {
      return (
        <View style={[{flexDirection: 'column', marginHorizontal: 10}]}>
          <RadioItems values={values}
                      attributeName={name}
                      type={'choice'}
                      selectedValues={selectedValues}
                      updateList={this.updateList}
          />
        </View>
      )
    }
    else if (type == "mcqs") {
      return (
        <View style={[{flexDirection: 'column', marginHorizontal: 10}]}>
          <CheckBoxItems values={values}
                         attributeName={name}
                         type={'choice'}
                         selectedValues={selectedValues}
                         updateList={this.onCheckBoxPress}
          />
        </View>
      );
    }
    else if (type == "text-field") {
      return this.renderTextInput(name, selectedValues);
    }
    else if (type == "color") {
      return (
        <ColorItems colors={values}
                    attributeName={name}
                    type={'color'}
                    selectedValues={selectedValues}
        />
      );
    }
    else if (type == "size") {
      return (
        <SizeItems sizes={values}
                   attributeName={name}
                   type={'size'}
                   selectedValues={selectedValues}
        />
      );
    }
    else if (type == "quantity") {
      return (
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
          <View style={{flexDirection: 'row', marginHorizontal: 50}}>

            <Text style={[styles.textStyle, {padding: 20}]} onPress={() => {
              this.setState({quantity: this.state.quantity - 1})
            }}>
              -
            </Text>
            <Text style={[styles.textStyle, {padding: 20}]}>
              {this.state.quantity}
            </Text>

            <Text style={[styles.textStyle, {padding: 20}]} onPress={() => {
              this.setState({quantity: this.state.quantity + 1})
            }}>
              +
            </Text>

          </View>
        </View>
      );
    }
  },

  render () {
    return (
      <View>
        {this.renderStickyHeader()}
        <ScrollView style={{marginHorizontal: 10, height: height - 100, marginVertical: 5}}>
          {this.renderAttributes()}
        </ScrollView>
      </View>
    );
  }
});

let ColorItems = React.createClass({
  getInitialState () {
    return {
      colors: this.props.colors,
      attributeName: this.props.attributeName,
      selectedValues: this.props.selectedValues,
      notFound: true,
      inputsList: [],
      listOfAttributes: [],
      selectedColor: -1,
      selectedSize: -1,
    }
  },

  onColorPress(color, nameOfAttribute, index, listOfValues){
    this.setState({selectedColor: index});
    this.state.selectedValues[0] = color;
    console.log('@@@@@@@@@@my selected color values', this.state.selectedValues);
    this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
  },

  colors(){
    let {colors, selectedValues, attributeName}= this.state;
    console.log('@@@@@@@@@@ colors', colors);
    console.log('@@@@@@@@@@ selectedValues', selectedValues);
    console.log('@@@@@@@@@@ attributeName', attributeName);
    return (
      <Color item={selectedValues}
             index={1}
             onPressColor ={()=>{console.log("nothing")}}
             selectedColor={1}/>
    );
  },

  render() {

    return (
      <View style={{flexDirection: 'row'}}>
        {this.colors()}
      </View>
    );


  },

});

let SizeItems = React.createClass({
  getInitialState () {
    return {
      sizes: this.props.sizes,
      attributeName: this.props.attributeName,
      selectedValues: this.props.selectedValues,
      notFound: true,
      inputsList: [],
      listOfAttributes: [],
      selectedColor: -1,
      selectedSize: -1,
    }
  },

  onSizePress(size, nameOfAttribute, index, listOfValues){
    this.setState({selectedSize: index});
    this.state.selectedValues[0] = size;
    console.log('@@@@@@@@@@my selected size values', this.state.selectedValues);
    this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
  },

  sizes(){
    let {sizes, selectedValues, attributeName}= this.state;
    console.log('@@@@@@@@@@ sizes', sizes);
    console.log('@@@@@@@@@@ selectedValues', selectedValues);
    console.log('@@@@@@@@@@ attributeName', attributeName);
    return (
      <Size  item={selectedValues}
             index={true}
             onPressSize ={()=>{console.log("nothing")}}
             selectedSize={true}/>
    );
  },

  render() {

    return (
      <View style={{flexDirection: 'row'}}>
        {this.sizes()}
      </View>
    );


  },

});

let RadioItems = React.createClass({
  getInitialState () {
    return {
      values: this.props.values,
      attributeName: this.props.attributeName,
      selectedValues: this.props.selectedValues,
      notFound: true,
      inputsList: [],
      listOfAttributes: [],
      selectedColor: -1,
      selectedSize: -1,
    }
  },

  onRadioButtonPress(item, nameOfAttribute, index, listOfValues){
    this.setState({selectedRadio: index});
    this.state.selectedValues[0] = item;
    // console.log('@@@@@@@@@@my selected size values', this.state.selectedValues);
    this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
  },

  radioItems(){
    let {values, selectedValues, attributeName}= this.state;
    /*console.log('@@@@@@@@@@ radios', values);
     console.log('@@@@@@@@@@ selectedValues', selectedValues);
     console.log('@@@@@@@@@@ attributeName', attributeName);*/
    return (
      <RadioButton item={selectedValues}
                   index={0}
                   onPressRadio={()=>{console.log("hgghj")}}
                   selectedRadio={0}/>
    );
  },

  render() {
    return (
      <View >
        {this.radioItems()}
      </View>
    );
  },

});
let sel = [];
let check = [];
let CheckBoxItems = React.createClass({
  getInitialState () {
    return {
      values: this.props.values,
      attributeName: this.props.attributeName,
      selectedValues: this.props.selectedValues,
      notFound: true,
      inputsList: [],
      listOfAttributes: [],
      selectedColor: -1,
      selectedSize: -1,
    }
  },

  onRadioButtonPress(item, nameOfAttribute, index, listOfValues){
    this.setState({selectedRadio: index});
    this.state.selectedValues[0] = item;
    console.log('@@@@@@@@@@my selected size values', this.state.selectedValues);
    this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
  },
  checkboxItems(){
    let {values, selectedValues, attributeName}= this.state;
    console.log('@@@@@@@@@@ checkboxes',selectedValues);
    console.log('@@@@@@@@@@ selectedValues', selectedValues);
    console.log('@@@@@@@@@@ attributeName', attributeName);
    return selectedValues.map((label, i) => {
      return (
        <Checkbox item={label}
                  key={i}
                  isSelected={ !!selectedValues.find((value) => {
                    return value == label
                  })}
                  onPressAdd={()=>{console.log("do nothing")}}
                  onPress = {true}
        />
      );
    });
  },

  render() {
    return (
      <View >
        {this.checkboxItems()}
      </View>
    );
  },

});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    //padding: 10,
    marginVertical: 10,
  },

  textStyle: {
    fontSize: 20,
    color: 'black',
    paddingVertical: 5,
    fontFamily: Fonts.regFont[Platform.OS],
  },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    // width: width - 20,
    //marginHorizontal: 10,
  },
});

export default SharedInfo;

import React, {Component} from 'react';

import {
  StyleSheet,
  Text,
  Alert,
  View,
  TouchableOpacity,
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

//Stubs
let inputList = [];
/*[{
 "attributeName":'',
 "selectedValues":[]
 }];*/
let xlistOfAttributes = [
  {
    "attributeName": "How Did You know about us?",
    "typeOfField": "text-field",
    "isAvailable": true,
    "selectedValues": [],
  },
  {
   "attributeName": "Gender",
   "typeOfField": "choice",
   "isAvailable": true,
   "selectedValues": [],
   "listOfValues": [
   "Male",
   "Female",
   "Other"
   ]
   },
   {
   "attributeName": "Size",
   "typeOfField": "size",
   "isAvailable": true,
   "selectedValues": [],
   "listOfValues": [
   "S",
   "M",
   "L",
   "XL",
   "XXL",
   ]
   },
  {
    "attributeName": "How sDid You knoww about us?",
    "typeOfField": "text-field",
    "isAvailable": true,
    "selectedValues": [],
  },
  {
    "attributeName": "What are your Interests?",
    "typeOfField": "mcqs",
    "isAvailable": true,
    "selectedValues": [],
    "listOfValues": [
      "Reading",
      "Writing",
      "Playing",

    ]
  },
  {
    "attributeName": "Where did you Know About US?",
    "typeOfField": "mcqs",
    "isAvailable": true,
    "selectedValues": [],
    "listOfValues": [
      "Friends",
      "Facebook",
      "Email",
      "Expo",
    ]
  },
  {
    "attributeName": "Select Your Favourite Color",
    "typeOfField": "color",
    "isAvailable": true,
    "selectedValues": [],
    "listOfValues": [
      "red",
      "brown",
      "black",
      "orange",
      "red",
      "blue",
    ],

  }
]

// input component../s
import Checkbox from '../InputComponents/Checkbox';
import Size from '../InputComponents/Size';
import RadioButton from '../InputComponents/RadioButton';
import Color from '../InputComponents/Color';

import MenuBar from '../../common/MenuBar';

let Select = React.createClass({

  getInitialState () {
    return {
      selectedRadio: -1,
      selectedAttributes: xlistOfAttributes,
      quantity: 3,
      notFound: true,
      inputsList: [],
      listOfAttributes: [],
      selectedColor: -1,
      selectedSize: -1,
    }
  },

  componentDidMount () {
    let attributes = this.props.attributes;
    /*attributes.map((item, key) => {
      item.selectedValues = [];
    })*/
    //attributes = this.state.selectedAttributes.length ? this.state.selectedAttributes : attributes;
    //attributes[1] = {};
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
              {item.attributeName}
            </Text>
            <View style={[Style.rowWithSpaceBetween, {marginHorizontal: 10}]}>
              {this.renderAttributeType(item.typeOfField, item.listOfValues, item.attributeName, item.selectedValues)}
            </View>
          </View>
          <View style={styles.lineSeparator}/>
        </View>
      );
    })
  },

  renderTextInput(fieldName, selectedValues){
    let value = selectedValues.length ? selectedValues[0] : "";

    return (
      <View>
        <TextInput
          ref="textValue"
          placeholderTextColor={StyleConstants.textColorGray}
          placeholder="Enter details"
          defaultValue={value}
          autoCapitalize="words"
          keyboardType="default"
          autoFocus={false}
          multiline={true}
          returnKeyType="done"
          underlineColorAndroid="transparent"
          style={{fontSize: 20, color: 'black', width: width * 0.90}}
          onChangeText={(textValue) => {
            this.setState({textValue});
            this.submitText(fieldName);
          }}
          onBlur={() => this.submitText(fieldName)}
        />
      </View>
    );
  },
  onPressBack() {
    this.props.navigator.pop();
    /* Alert.alert(
     'Alert!!!',
     'Do You Want to Discard?',
     [
     {text: 'Yes', onPress: () => this.props.navigator.pop(), style: 'cancel'},
     {text: 'NO', onPress: () => console.log('No Pressed'), style: 'cancel'}
     ]
     )*/

  },
  renderStickyHeader() {
    return (
      <MenuBar
        // color = {'red'} // Optional By Default 'black'
        title={"Selected Specs"} // Optional
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
          />
        </View>
      )
    }
    else if (type == "mcqs") {
      return (
        <View style={[{flexDirection: 'column', marginHorizontal: 10}]}>
          <CheckBoxItems values={selectedValues}
                         attributeName={name}
                         type={'choice'}
                         selectedValues={selectedValues}
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

            <Text style={[styles.textStyle,{padding:20}]} onPress={() => {
              this.setState({quantity: this.state.quantity - 1})
            }}>
              -
            </Text>
            <Text style={[styles.textStyle,{padding:20}]}>
              {this.state.quantity}
            </Text>

            <Text style={[styles.textStyle ,{padding:20}]} onPress={() => {
              this.setState({quantity: this.state.quantity + 1})
            }}>
              +
            </Text>

          </View>
        </View>
      );
    }
  },




  submitText(fieldName){
    let value = [];
    value.push(this.state.textValue);
    inputList = inputList.filter((x) => {
      return x.attributeName != fieldName;
    });
    let textField = {
      attributeName: fieldName,
      selectedValues: value,
      typeOfField: 'text-field',
      isAvailable: true,
    }
    inputList.push(textField)
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
    console.log('@@@@@@@@@@ checkboxes', values);
    console.log('@@@@@@@@@@ selectedValues', selectedValues);
    console.log('@@@@@@@@@@ attributeName', attributeName);
    return values.map((label, i) => {
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
    //paddingVertical: 10
  },
  lineSeparator: {
    height: 0.7,
    backgroundColor: 'black',
    marginVertical: 5,
    // width: width - 20,
    //marginHorizontal: 10,
  },
});

export default Select;

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
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
} from '../stylesheet/style';
let images = {
  'right_caret': require('../../res/common/arrow_right.png'),
  'left_caret': require('../../res/common/back.png'),
  'check': require('../../res/common/check.png'),
  'empty': require('../../res/common/emptyPixel.png'),
};

let items = ['first', 'second', 'third',];
import Checkbox from './InputComponents/Checkbox';
import Size from './InputComponents/Size';
var radioButtons = [];
const {height, width} = Dimensions.get('window');
import RadioButton from './InputComponents/RadioButton';
import Color from './InputComponents/Color';
var radioitems = ['item one', 'item two', 'item three', 'item one1', 'item two2', 'item three3'];
var colors = ['red', 'blue', 'green', 'black', 'orange', 'yellow'];
var listOfDefaultAttributes = [
  {
    "attributeName": "Gender",
    "typeOfFeild": "radioButton",
    "isAvailable": true,
    "listOfValues": [
      "Male",
      "Female",
      "Other"
    ]
  },
  {
    "attributeName": "How Did You know about us?",
    "typeOfFeild": "textBox",
    "isAvailable": true,
  },
  {
    "attributeName": "Size",
    "typeOfFeild": "size",
    "isAvailable": true,
    "listOfValues": [
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ]
  },
  {
    "attributeName": "Interests",
    "typeOfFeild": "checkBox",
    "isAvailable": true,
    "listOfValues": [
      "Reading",
      "Writing",
      "Playing",

    ]
  },
  {
    "attributeName": "Hobbies",
    "typeOfFeild": "checkBox",
    "isAvailable": true,
    "listOfValues": [
      "Reading",
      "Writing",
      "Playing",
      "Reading",
      "Loving",
      "Boring",
    ]
  },
  {
    "attributeName": "Color",
    "typeOfFeild": "color",
    "isAvailable": true,
    "listOfValues": [
      "red",
      "brown",
      "black",
      "orange",
      "red",
      "blue",
    ]
  }
]

let cardQuestions = React.createClass({

  getInitialState () {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      myItems: ds,
      selectedRadio: -1,
      quantity: 3,
      selectedColor: -1,
      selectedSize: -1,
    }
  },

  componentDidMount () {
    this.setState({myItems: this.state.myItems.cloneWithRows(items)});
  },
  renderAttributes(){
    return listOfDefaultAttributes.map((item, key) => {
      return (
        <View key={key}>
          <View>
            <Text style={styles.textStyle}>
              {item.attributeName}
            </Text>
            <View style={[Style.rowWithSpaceBetween, {marginHorizontal: 10}]}>
              {this.renderAttributeType(item.typeOfFeild, item.listOfValues)}
            </View>
          </View>
          <View style={styles.lineSeparator}/>
        </View>
      );
    })
  },
  renderTextInput(){
    return (
      <View>
        <TextInput
          ref="address"
          placeholderTextColor={StyleConstants.textColorGray}
          placeholder="Enter details"
          autoCapitalize="words"
          keyboardType="default"
          multiline={true}
          returnKeyType="done"
          underlineColorAndroid="transparent"
          style={{fontSize: 20, color: 'black', width: width * 0.90}}
          onChangeText={(address1) => {
            this.setState({address1});
          }}
        />
      </View>
    );
  },

  renderStickyHeader() {
    return (
      <View>
        <TitleBar
          title="Select Attributes"
          leftButton={images.left_caret}
          rightButton2={images.check}
          onLeftButtonPress={() => this.props.navigator.pop()}
          //onRightButton2Press= {this.onPressSubmit}
        />
      </View>
    );
  },
  renderAttributeType(type, values){
    console.log('@@@@@@@@@@@@@@', values);
    if (type == "radioButton") {
      return (
        <View style={[{flexDirection: 'column', marginHorizontal: 10}]}>
          {this.renderRadioButtons(values)}
        </View>)
    }
    else if (type == "checkBox") {
      return (
        <View style={[{flexDirection: 'column', marginHorizontal: 10}]}>
          {this.renderCheckBox(values)}
        </View>
      );
    }
    else if (type == "textBox") {
      return this.renderTextInput();
    }
    else if (type == "color") {
      return this.renderColor(values);
    }
    else if (type == "size") {
      return this.renderSize(values);
    }
  },

  onPressAdd (item) {
    console.log('Yo I Am Being Pressed! ', item);
  },

  onPressRadio (item) {
    let items = ['first', 'second', 'third',];

    console.log('Yo I Am Being Pressed! ', item);
  },

  renderCheckBox(items) {
    return items.map((label, i) => {
      return (<Checkbox item={label} key={i} onPressAdd={this.onPressAdd}/>);
    });
  },

  handleRadioItem (i) {
    this.setState({selectedRadio: i});
  },
  handleColorItem (i) {
    this.setState({selectedColor: i});
  },
  handleSizeItem (i) {
    this.setState({selectedSize: i});
  },

  renderRadioButtons (radioitems) {
    return radioitems.map((item, i) => {
      return (
        <RadioButton key={i + item} item={item} index={i} onPressRadio={this.handleRadioItem}
                     selectedRadio={this.state.selectedRadio}/>
      );
    });
  },

  renderColor (colors) {
    return colors.map((item, i) => {
      return (
        <Color key={i} item={item} index={i} onPressColor={this.handleColorItem}
               selectedColor={this.state.selectedColor}/>
      );
    });
  },
  renderSize (values) {
    return values.map((item, i) => {
      return (
        <Size key={i} item={item} index={i} onPressSize={this.handleSizeItem} selectedSize={this.state.selectedSize}/>
      );
    });
  },

  renderQuantity () {
    return (
      <View style={Style.rowWithSpaceBetween}>
        <Text style={styles.textStyle}>
          Quantity
        </Text>
        <View style={Style.rowWithSpaceBetween}>
          <TouchableOpacity onPress={() => {
            this.setState({quantity: this.state.quantity - 1})
          }}>
            <Text style={styles.textStyle}>
              -
            </Text>
          </TouchableOpacity>
          <Text>
            {this.state.quantity}
          </Text>
          <TouchableOpacity onPress={() => {
            this.setState({quantity: this.state.quantity + 1})
          }}>
            <Text style={styles.textStyle}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

  },

  render () {
    return (
      <View>
        {this.renderStickyHeader()}
        <ScrollView style={{width: width, height: height - 50}}>
          <View style={{marginHorizontal: 10, flex: 1, marginVertical: 5}}>
            {this.renderAttributes()}
          </View>
        </ScrollView>
      </View>
    );
  }
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

export default cardQuestions;

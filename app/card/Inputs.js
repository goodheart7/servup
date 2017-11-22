
 import React, { Component } from 'react';
 import {
   StyleSheet,
   Text,
   Platform,
   View,
   Alert,
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
  var KeyboardSet = require('../common/KeyboardSet');

 var i = 0;
 import MenuBar from '../common/MenuBar';

 const {height, width} = Dimensions.get('window');
 let inputList = [];/*[{
    "question":'',
    "selectedAnswers":[]
  }];*/

 import Checkbox from './InputComponents/Checkbox';
 import Size from './InputComponents/Size';
 import RadioButton from './InputComponents/RadioButton';
 import Color from './InputComponents/Color';


 let Inputs = React.createClass({

   getInitialState () {
     return {
       selectedRadio: -1,
       questions: this.props.questions,
       selectedQuestions:this.props.selectedQuestions,
       quantity: 3,
       notFound: true,
       inputsList: [],
       listOfAttributes: [],
       cardQuestions:[],
       selectedColor: -1,
       selectedSize: -1,
     }
   },
   componentDidMount () {
     console.log('@@@@@@@@@@@@RRRRRRRRRRRRRRRRRRRRRRRRRRRRR', this.props.questions);
     let questions = this.props.questions;
     questions.map((item, key) => {
       item.selectedAnswers = [];
     })
     questions = this.state.selectedQuestions.length ? this.state.selectedQuestions : questions;
     this.setState({ cardQuestions: questions});
   },
   renderAttributes(){
     let {cardQuestions} = this.state;
     console.log('rendering attributsses', cardQuestions);
     return cardQuestions.map((item, key) => {
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
         title={"Select Attributes "} // Optional
         leftIcon={'icon-back_screen_black'}
         rightIcon={'icon-done'}// Optional
         onPressLeftIcon={this.onPressBack} // Optional
         onPressRightIcon={this.onPressSubmit} // Optional
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
                     updateList={this.updateList}
         />
       );
     }
     else if (type == "size") {
       return (
         <SizeItems sizes={values}
                    attributeName={name}
                    type={'size'}
                    selectedValues={selectedValues}
                    updateList={this.updateList}
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
   updateList(type, fieldName, selectedValues, listOfValues) {
     console.log('======================================================================');
     console.log('@@@@@@ attribute type: ', type);
     console.log('@@@@@@ attribute name: ', fieldName);
     console.log('@@@@@@ attribute values: ', listOfValues);
     console.log('@@@@@@ attribute selected Values: ', selectedValues);
     console.log('======================================================================');
     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ input list before', inputList);
     inputList = inputList.filter((x) => {
       return x.attributeName != fieldName;
     });
     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ input list after', inputList);
     console.log('======================================================================');
     let obj = {
       typeOfField: type,
       isAvailable: false,
       question: fieldName,
       selectedAnswers: selectedValues,
       listOfValues: listOfValues,
     }
     inputList.push(obj)
     console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ input list final', inputList);
   },


   onCheckBoxPress (obj, name, index, listOfValues) {
     console.log('@@@@@@@@@@@@@@@@@@checkbox obj', obj);
     console.log('@@@@@@@@@@@@@@@@@@checkbox name', name);
     console.log('@@@@@@@@@@@@@@@@@@checkbox name', listOfValues);
     console.log('@@@@@@@@@@@@@@@@@@input list', this.state.listOfAttributes);
     let flag = inputList.filter((x) => {
       return x.attributeName === name && x.typeOfField === 'mcqs';

     });
     if (flag.length) {
       inputList.map((item, i) => {
         if (item.attributeName == name) {
           if (obj.state) {
             item.selectedValues.push(obj.item)
           }
           else {
             let inx = item.selectedValues.indexOf(obj.item)
             item.selectedValues.splice(inx, 1);
           }
         }
       })
     }
     else {
       console.log('@@@@@@@@@@@@@@@@@@flag', flag);
       let sel = [];
       obj.state ? sel.push(obj.item) : '';
       let objn = {
         typeOfField: 'mcqs',
         isAvailable: false,
         question: name,
         selectedAnswers: sel,
         listOfValues: listOfValues,
       };
       inputList.push(objn);
     }

     console.log('@@@@@@@inputsList#########', inputList)
   },

   submitText(fieldName){
     let value = [];
     value.push(this.state.textValue);
     inputList = inputList.filter((x) => {
       return x.question != fieldName;
     });
     let textField = {
       question: fieldName,
       selectedAnswers: value,
       typeOfField: 'text-field',
       isAvailable: true,
     }
     inputList.push(textField)
   },

   onPressSubmit(){
     console.log('@@@@@@@@@@@@@@@@@@@  @finalasList', inputList);
     let flag = true;
     inputList.map((item, index) => {
       (item.selectedAnswers== null) ? (item.selectedAnswers = []) : item.selectedAnswers;
       if (item.selectedAnswers.length == 0 ) {
         flag = false;
         Alert.alert(
           'Alert!!!',
           'All Fields are Required',
           [
             {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
           ]
         )
         console.log('@@@@@@@@@incom')
       }
     })
     if (flag) {
       this.props.onPressSubmit(inputList);
       //    this.props.navigator.pop();
       let list = this.props.screenTransitionList;
       list = list.filter((x) => {
         return x != 18
       });
       console.log('@@@@@@@@@@@@Screen Trans select', list);
       if (list.length == 0) {
         let popN = this.props.popN ? this.props.popN : 1;
         this.props.navigator.popN(popN)
       }
       console.log('@@@@@@@@@@@@on submit press 18:', this.props.popN);
     }

   },

   render () {
     return (
       <View style={{
         flex: 1,
         backgroundColor: 'white',
       }}>
         <MenuBar
           // color = {'red'} // Optional By Default 'black'
           title = {"Inputs Required"} // Optional
           leftIcon = {'icon-back_screen_black'}
           rightIcon = {'icon-done'}// Optional
           onPressLeftIcon = {this.onPressBack} // Optional
           onPressRightIcon = {this.onPressSubmit} // Optional
         />
         <ScrollView style={{paddingHorizontal: 15,
           paddingVertical: 10}}>
           {this.renderAttributes()}
          <KeyboardSet/>
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
     return colors.map((itemColor, i) => {
       return (
         <Color key={i} item={itemColor} index={i}
                onPressColor={(color, index) =>
                  this.onColorPress(color, attributeName, index, colors)}
                selectedColor={
                  selectedValues.find((color) => {
                    return color == itemColor
                  }) ? i : this.state.selectedColor

                }/>
       );
     });
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
     return sizes.map((item, i) => {
       return (
         <Size key={i} item={item} index={i}
               onPressSize={(size, index) =>
                 this.onSizePress(size, attributeName, index, sizes)}
               selectedSize={ selectedValues.find((size) => {
                 return size == item
               }) ? i : this.state.selectedSize}/>
       );
     });
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
     return values.map((item, i) => {
       return (
         <RadioButton key={i} item={item} index={i}
                      onPressRadio={(value, index) => this.onRadioButtonPress(value, attributeName, index, values)}
                      selectedRadio={ selectedValues.find((value) => {
                        return value == item
                      }) ? i : this.state.selectedRadio}/>
       );
     });
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
   onCheckBoxPress (obj, nameOfAttribute, index, listOfValues) {
     console.log('@@@@@@@@@@@@@@@@@@checkbox obj', obj);
     console.log('@@@@@@@@@@@@@@@@@@checkbox name', nameOfAttribute);
     console.log('@@@@@@@@@@@@@@@@@@list of values', listOfValues);
     console.log('@@@@@@@@@@@@@@@@@@index', index);

     /* let checkbox = {
      typeOfField: 'mcqs',
      isAvailable: false,
      attributeName: nameOfAttribute,
      selectedValues: sel,
      listOfValues: listOfValues,
      };*/

     console.log('@@@@@@@@@@@@@@@@@@ checkbox', checkbox);
     /*  inputList.map((item, i) => {
      if (item.attributeName == name) {
      if (obj.state) {
      item.selectedValues.push(obj.item)
      }
      else {
      let inx = item.selectedValues.indexOf(obj.item)
      item.selectedValues.splice(inx, 1);
      }
      }
      })*/
     console.log('@@@@@@@inputsList#########', inputList)
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
                   onPressAdd={(obj) => this.props.updateList(obj, attributeName, i, values)}/>
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
     marginVertical:10,
   },

   textStyle: {
     fontSize: 18,
     color: 'black',
     fontFamily: Fonts.regFont[Platform.OS],
     //paddingVertical: 10
   },
   lineSeparator: {
     height: 0.5,
     backgroundColor: 'black',
     marginVertical: 5,
    // width: width - 20,
     //marginHorizontal: 10,
   },
 });

 export default Inputs;

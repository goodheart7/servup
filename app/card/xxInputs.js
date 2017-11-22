/**
 * Created by Shoaib on 11/16/2016.
 */
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
 let images = {
   'right_caret': require('../../res/common/arrow_right.png'),
   'left_caret': require('../../res/common/back.png'),
   'check': require('../../res/common/check.png'),
   'empty': require('../../res/common/emptyPixel.png'),
 };
 var i = 0;
 import MenuBar from '../common/MenuBar';
 let items = ['first', 'second', 'third', ];
 import Checkbox from './InputComponents/Checkbox';
 import Size from './InputComponents/Size';
 var radioButtons = [];
 const {height, width} = Dimensions.get('window');
 let inputList = [];/*[{
    "question":'',
    "selectedAnswers":[]
  }];*/

 import RadioButton from './InputComponents/RadioButton';
 import Color from './InputComponents/Color';
 var radioitems = ['item one', 'item two', 'item three','item one1', 'item two2', 'item three3'];
 var colors = ['red', 'blue', 'green','black', 'orange', 'yellow'];


 let Inputs = React.createClass({

   getInitialState () {
     return {
       selectedRadio: -1,
       quantity:3,
       cardQuestion:[],
       notFound:true,
       inputsList: [],
       selectedColor: -1,
       selectedSize: -1,
     }
   },
   componentDidMount () {
     this.setState({ cardQuestion: this.props.questions });
   },
   renderAttributes(){
     let {cardQuestion} = this.state,
     i=i+1;
     console.log('rendering attributes');
     return cardQuestion.map((item, key)=>{
       return (
         <View key={key} >
           <View style={{marginVertical:20}}>
             <Text style={[styles.textStyle, {marginBottom:10}]}>
               {item.question}
             </Text>
             <View style={[ Style.rowWithSpaceBetween, {marginHorizontal:10}]}>
               {this.renderAttributeType(item.typeOfField, item.listOfValues,item.question)}
             </View>
           </View>
           <View style={styles.lineSeparator}/>
         </View>
       );
     })
   },
   renderTextInput(fieldName){
     return(
       <View>
         <TextInput
           ref = "textValue"
           placeholderTextColor={StyleConstants.textColorGray}
           placeholder="Enter details"
           autoCapitalize = "words"
           keyboardType = "default"
           autoFocus = {false}
           multiline = {true}
           returnKeyType = "done"
           underlineColorAndroid = "transparent"
           style={{fontSize:18,color:'black',width:width*0.90,fontFamily: Fonts.regFont[Platform.OS],}}
           onChangeText={(textValue) => {
             this.setState({ textValue });
           }}
           onBlur = {() =>this.submitText(fieldName)}
         />
       </View>
     );
   },
   renderStickyHeader() {
     return(
       <MenuBar
         // color = {'red'} // Optional By Default 'black'
         title = {"Share Information"} // Optional
         leftIcon = {'icon-arrow-left2'}
         rightIcon = {'icon-done2'}// Optional
         onPressLeftIcon = {this.onPressBack} // Optional
         onPressRightIcon = {this.onPressSubmit} // Optional
       />

     );
   },
   renderAttributeType(type,values,name){

     if (type == "choice") {
       return(
         <View style={[ {flexDirection:'column',marginHorizontal:10}]}>
           {this.renderRadioButtons(values,name)}
         </View>)
     }
     else if (type == "mcqs") {
       return (
         <View style={[ {flexDirection:'column',marginHorizontal:10}]}>
           {this.renderCheckBox(values,name)}
         </View>
       );
     }
     else if (type == "text-field") {
       return this.renderTextInput(name);
     }
     else if (type == "color") {
       return this.renderColor(values, name);
     }
     else if(type == "size") {
       return this.renderSize(values, name);
     }
   },

   onSizePress(answer, fieldName, index){
     this.setState({selectedSize:index});
     this.updateList(answer,fieldName);
   },

   onColorPress(answer, fieldName, index){
     this.setState({selectedColor:index});
     this.updateList(answer,fieldName);
   },

   updateList(answer, fieldName) {
     inputList = inputList.filter((x) => { return x.question != fieldName; });
     let obj = {
       question: fieldName,
       selectedAnswers: answer,
     }
     inputList.push(obj)
   },
   onCheckBoxPress (obj,name) {
     inputList.map((item,i) => {
       if(item.question == name ) {
         if(obj.state) {
           item.selectedAnswers.push(obj.item)
         }
         else {
           let inx = item.selectedAnswers.indexOf(obj.item)
           item.selectedAnswers.splice(inx, 1);
         }
        }
     })
     console.log('@@@@@@@inputsList#########',inputList)
   },
   submitText(fieldName){
     inputList = inputList.filter((x) => { return x.question != fieldName; });
     let answer = {
       question: fieldName,
       selectedAnswers: this.state.textValue,
     }
     inputList.push(answer)
   },
   onRadioButtonPress (value, index,  fieldName) {
     this.setState({ selectedRadio: index });
     this.updateList(value, fieldName);
   },

   renderCheckBox(items,name) {
    if (i==1) {
      let objx = {
      "question": name,
      "selectedAnswers": [],
      }
     inputList.push(objx);
    }
    // console.log('@@@@@renderCheckBox called',inputList);
     return items.map((label, i)=>{
       return (<Checkbox item={label} key={i} onPressAdd={(obj)=>this.onCheckBoxPress(obj,name)} />);
     });
   },

   renderRadioButtons (radioitems,fieldName) {
     return radioitems.map((item, i) => {
       return (
         <RadioButton key={i+item} item={item} index={i} onPressRadio={(value,index)=>this.onRadioButtonPress(value,index,fieldName)} selectedRadio={this.state.selectedRadio}/>
       );
     });
   },

   renderColor (colors,name) {
     return colors.map((item, i) => {
       return (
           <Color key={i} item={item} index={i}
            onPressColor={(color, index) =>
               this.onColorPress(color, name, index)}
            selectedColor={this.state.selectedColor}/>
       );
     });
   },
   renderSize (values,fieldName) {
     return values.map((item, i) => {
       return (
         <Size key={i} item={item} index={i}
            onPressSize={(size, index) =>
               this.onSizePress(size, fieldName, index)}
            selectedSize={this.state.selectedSize}/>
       );
     });
   },
   onPressBack() {
     this.props.navigator.pop();
     /*Alert.alert(
       'Alert!!!',
       'Do You Want to Discard?',
       [
         {text: 'Yes', onPress: () => this.props.navigator.pop(), style: 'cancel'},
         {text: 'NO', onPress: () => console.log('No Pressed'), style: 'cancel'}
       ]
     )*/

   },
   renderQuantity () {
     if (i==1) {
        let objx = {
        "question": name,
        "selectedAnswers": [],
        }
      }
     return (
       <View style={Style.rowWithSpaceBetween}>
         <Text style={styles.textStyle}>
           Quantity
         </Text>
         <View style={Style.rowWithSpaceBetween}>
           <TouchableOpacity onPress= {()=> {this.setState({quantity:this.state.quantity-1})}}>
             <Text style={styles.textStyle}>
               -
             </Text>
             </TouchableOpacity>
           <Text>
             {this.state.quantity}
             </Text>
           <TouchableOpacity onPress= {()=> {this.setState({quantity:this.state.quantity+1})}}>
             <Text style={styles.textStyle}>
               +
             </Text>
           </TouchableOpacity>
         </View>
       </View>
     );

   },
   onPressSubmit(){
     console.log('@@@@@@@@@@@@@@@@@@@@finalasXList',inputList);
     let flag =true;
     inputList.map((item, index) => {
       (item.selectedAnswers==null) ?(item.selectedAnswers=[]):item.selectedAnswers;
       if(item.selectedAnswers.length == 0) {
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
     if (inputList.length != this.props.questions.length )
     {
       flag = false;
       Alert.alert(
         'Alert!!!',
         'All Fields are Required',
         [
           {text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         ]
       )

     }
     else if (flag) {
       this.props.onPressSubmit(inputList);
       let list =this.props.screenTransitionList;
       list = list.filter((x)=>{ return x != 18 });
       console.log('@@@@@@@@@@@@Screen Trans select', list);
       if(list.length== 0) {
         this.props.navigator.popN(this.props.popN)
       }
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
           leftIcon = {'icon-arrow-left2'}
           rightIcon = {'icon-done2'}// Optional
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

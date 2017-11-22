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
} from '../stylesheet/style';


const {height, width} = Dimensions.get('window');

//Stubs
let inputList = [];

// input components
import Checkbox from './InputComponents/Checkbox';
import Size from './InputComponents/Size';
import RadioButton from './InputComponents/RadioButton';
import Color from './InputComponents/Color';

import MenuBar from '../common/MenuBar';

let Select = React.createClass({

	getInitialState () {
		return {
			selectedRadio: -1,
			selectedAttributes: this.props.selectedAttributes,
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
		attributes.map((item, key) => {
			item.selectedValues = [];
		})
		attributes = this.state.selectedAttributes.length ? this.state.selectedAttributes : attributes;
		//attributes[1] = {};
		// console.log('@@@@@@@@@@@ attributes', attributes);
		this.setState({listOfAttributes: attributes});

	},

	renderAttributes(){
		let {listOfAttributes} = this.state;
		// console.log('rendering attributsses', listOfAttributes);
		return listOfAttributes.map((item, key) => {
			return (
				<View
					key = {key}
					style = {{
						flex: 1,
						marginHorizontal: 20,
						marginVertical: 10,
						borderRadius: 10,
						borderColor: StyleConstants.primary,
						borderWidth: 1,
						minHeight: 100,
					}}
				>
					<View style = {{flex: 1, paddingVertical: 10, margin: 10}}>
						<Text style={styles.textStyle}>
							{item.attributeName}
						</Text>
						<View style={[Style.rowWithSpaceBetween, {
							flex: 1,
							marginHorizontal: 10,
							marginTop: 10
						}]}>
							{this.renderAttributeType(item.typeOfField, item.listOfValues, item.attributeName, item.selectedValues)}
						</View>
					</View>
				</View>
			);
		})
	},

	renderTextInput(fieldName, selectedValues){
		let value = selectedValues.length ? selectedValues[0] : "";
		return (
			<View style = {{borderBottomWidth: 0.5, borderBottomColor: 'grey', height: 30}}>
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
					style={{fontSize: 15, color: 'black', height: 25, width: width*0.675, marginHorizontal: 5}}
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
				title = {"Choose Specs"} // Optional
				leftIcon = {'icon-back_screen_black'}
				rightIcon = {'icon-done'}// Optional
				onPressLeftIcon = {this.onPressBack} // Optional
				onPressRightIcon = {this.onPressSubmit} // Optional
			/>
		);
	},

	renderAttributeType(type, values, name, selectedValues){
		//type is typeofFeild.map
		// values is list of Values
		// name is name of attributes
		//Sekected values are selected values
		// console.log('@@@@@@ attribute type: ', type);
		// console.log('@@@@@@ attribute name: ', name);
		// console.log('ABCABCABC attribute values: ', values);
		var valueLengths = [];
		var largestValue = 12;
		if (values.length>0)
		{
			valueLengths = values.map((x)=> {
				return x.length;
			});
			valueLengths.sort((a,b) => {
				return a-b;
			});
			largestValue = valueLengths[valueLengths.length-1];
			// console.log('Largest Value', largestValue);
		}
		// console.log('@@@@@@ attribute selected Values: ', selectedValues);

		if (type == "choice") {
			return (
				<View style={[{flex: 1}]}>
					<RadioItems
						singleItemWidth = {largestValue <= 12? width/3 : width/1.25}
						values={values}
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
				<View style={[{flex: 1}]}>
					<CheckBoxItems
						singleItemWidth = {largestValue <= 12? width/3 : width/1.25}
						values={values}
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
				<View style={[{flex: 1}]}>
					<ColorItems
						colors={values}
						attributeName={name}
						type={'color'}
						selectedValues={selectedValues}
						updateList={this.updateList}
					/>
				</View>
			);
		}
		else if (type == "size") {
			return (
				<View style={[{flex: 1}]}>
					<SizeItems
						sizes={values}
						attributeName={name}
						type={'size'}
						selectedValues={selectedValues}
						updateList={this.updateList}
					/>
				</View>
			);
		}
		else if (type == "quantity") {
			return (
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 20}}>
					<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
						<Text style={[styles.textStyle,{padding:20}]} onPress={() => {
							this.setState({quantity: this.state.quantity - 1})
						}}>
							-
						</Text>
						<View style = {{borderColor: 'grey', borderWidth: 1}}>
							<Text style={[styles.textStyle,{padding: 5}]}>
								{this.state.quantity}
							</Text>
						</View>
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
		// console.log('======================================================================');
		// console.log('@@@@@@ attribute type: ', type);
		// console.log('@@@@@@ attribute name: ', fieldName);
		// console.log('@@@@@@ attribute values: ', listOfValues);
		// console.log('@@@@@@ attribute selected Values: ', selectedValues);
		// console.log('======================================================================');
		// console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ input list before', inputList);
		inputList = inputList.filter((x) => {
			return x.attributeName != fieldName;
		});
		// console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ input list after', inputList);
		// console.log('======================================================================');
		let obj = {
			typeOfField: type,
			isAvailable: false,
			attributeName: fieldName,
			selectedValues: selectedValues,
			listOfValues: listOfValues,
		}
		inputList.push(obj)
		// console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ input list final', inputList);
	},


	onCheckBoxPress (obj, name, index, listOfValues) {
		// console.log('@@@@@@@@@@@@@@@@@@checkbox obj', obj);
		// console.log('@@@@@@@@@@@@@@@@@@checkbox name', name);
		// console.log('@@@@@@@@@@@@@@@@@@checkbox name', listOfValues);
		// console.log('@@@@@@@@@@@@@@@@@@input list', this.state.listOfAttributes);
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
			// console.log('@@@@@@@@@@@@@@@@@@flag', flag);
			let sel = [];
			obj.state ? sel.push(obj.item) : '';
			let objn = {
				typeOfField: 'mcqs',
				isAvailable: false,
				attributeName: name,
				selectedValues: sel,
				listOfValues: listOfValues,
			};
			inputList.push(objn);
		}

		// console.log('@@@@@@@inputsList#########', inputList)
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

	onPressSubmit(){
		// console.log('@@@@@@@@@@@@@@@@@@@  @finalasList', inputList);
		let flag = true;
		inputList.map((item, index) => {
			(item.selectedValues == null) ? (item.selectedValues = []) : item.selectedValues;
			if (item.selectedValues.length == 0 ) {
				flag = false;
				Alert.alert(
					'Hey !!!',
					'All Fields are Required',
					[
						{text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
					]
				)
				// console.log('@@@@@@@@@incom')
			}
		})
		if (flag) {
			this.props.onPressSubmit(inputList);
			//    this.props.navigator.pop();
			let list = this.props.screenTransitionList;
			list = list.filter((x) => {
				return x != 17
			});
			// console.log('@@@@@@@@@@@@Screen Trans select', list);
			if (list.length == 0) {
				let popN = this.props.popN ? this.props.popN : 1;
				this.props.navigator.popN(popN)
			}
		}
		// console.log('@@@@@@@@@@@@on submit press 17:', this.props.popN);
	},

	render () {
		return (
			<View>
				{this.renderStickyHeader()}
				<ScrollView style={{flexGrow: 1, marginHorizontal: 10, height: height - 100, marginVertical: 10}}>
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
		// console.log('@@@@@@@@@@my selected color values', this.state.selectedValues);
		this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
	},

	colors(){
		let {colors, selectedValues, attributeName}= this.state;
		// console.log('@@@@@@@@@@ colors', colors);
		// console.log('@@@@@@@@@@ selectedValues', selectedValues);
		// console.log('@@@@@@@@@@ attributeName', attributeName);
		return colors.map((itemColor, i) => {
			return (
				<Color
					key = {i}
					item = {itemColor}
					index = {i}
					onPressColor = {(color, index) =>
						this.onColorPress(color, attributeName, index, colors)
					}
					selectedColor = {selectedValues.find((color) => {
							return color == itemColor
						}) ? i : this.state.selectedColor
					}
				/>
			);
		});
	},

	render() {

		return (
			<View style = {{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
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
		// console.log('@@@@@@@@@@my selected size values', this.state.selectedValues);
		this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
	},

	sizes(){
		let {sizes, selectedValues, attributeName}= this.state;
		// console.log('@@@@@@@@@@ sizes', sizes);
		// console.log('@@@@@@@@@@ selectedValues', selectedValues);
		// console.log('@@@@@@@@@@ attributeName', attributeName);
		return sizes.map((item, i) => {
			return (
				<Size
					key={i}
					item={item}
					index={i}
					onPressSize={(size, index) =>
						this.onSizePress(size, attributeName, index, sizes)
					}
					selectedSize={ selectedValues.find((size) => {
							return size == item
						}) ? i : this.state.selectedSize
					}
				/>
			);
		});
	},

	render() {

		return (
			<View style = {{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
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
				<RadioButton
					singleItemWidth = {this.props.singleItemWidth}
					key = {i}
					item = {item}
					index = {i}
					onPressRadio = {(value, index) => this.onRadioButtonPress(value, attributeName, index, values)}
					selectedRadio = {selectedValues.find((value) => {
						return value == item
					}) ? i : this.state.selectedRadio}
				/>
			);
		});
	},

	render() {
		return (
			<View style = {{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
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
		// console.log('@@@@@@@@@@my selected size values', this.state.selectedValues);
		this.props.updateList(this.props.type, nameOfAttribute, this.state.selectedValues, listOfValues);
	},

	onCheckBoxPress (obj, nameOfAttribute, index, listOfValues) {
		// console.log('@@@@@@@@@@@@@@@@@@checkbox obj', obj);
		// console.log('@@@@@@@@@@@@@@@@@@checkbox name', nameOfAttribute);
		// console.log('@@@@@@@@@@@@@@@@@@list of values', listOfValues);
		// console.log('@@@@@@@@@@@@@@@@@@index', index);

		/* let checkbox = {
		 typeOfField: 'mcqs',
		 isAvailable: false,
		 attributeName: nameOfAttribute,
		 selectedValues: sel,
		 listOfValues: listOfValues,
		 };*/

		// console.log('@@@@@@@@@@@@@@@@@@ checkbox', checkbox);
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
		// console.log('@@@@@@@inputsList#########', inputList)
	},

	checkboxItems(){
		let {values, selectedValues, attributeName}= this.state;
		// console.log('@@@@@@@@@@ checkboxes', values);
		// console.log('@@@@@@@@@@ selectedValues', selectedValues);
		// console.log('@@@@@@@@@@ attributeName', attributeName);
		return values.map((label, i) => {
			return (
				<Checkbox
					singleItemWidth = {this.props.singleItemWidth}
					item = {label}
					key = {i}
					isSelected = { !!selectedValues.find((value) => {
						return value == label
					})}
					onPressAdd = {(obj) => this.props.updateList(obj, attributeName, i, values)}
				/>
			);
		});
	},

	render() {
		return (
			<View style = {{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
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
		alignSelf: 'flex-start',
		fontSize: 20,
		color: 'black',
		textAlign: 'left',
		marginHorizontal: 10,
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

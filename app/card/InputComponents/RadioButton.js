import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
} from 'react-native';

import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
import attributeStyle from './Style';
export default class RadioButton extends Component {

	constructor (props) {
		super(props);
		this.state = { checked: false };
		this.onPressRadio = this.onPressRadio.bind(this);
	}

	onPressRadio () {
		let {index, item} = this.props;
		this.setState({ checked: true });
		// let itemIndex = index+item
		this.props.onPressRadio(item,index);
	}

	render () {
		let {index, item, selectedRadio} = this.props;
		let {checked} = this.state;
		return (
			<TouchableOpacity onPress={this.onPressRadio} style={[styles.row,{width: this.props.singleItemWidth}]}>
				<View style={styles.radioOutline}>
					{selectedRadio == index ? <View style={styles.selected}/> : <View></View>}
				</View>
				<Text style={attributeStyle.valueText}>{item}</Text>
			</TouchableOpacity>
		);
	}

}

const styles = StyleSheet.create({

	row: {
		flexDirection: 'row',
		height: 30,
		// left: -18,
		margin: 5,
	},

	radioOutline: {
		marginHorizontal: 5,
		marginVertical:3,
		width: 22,
		height: 22,
		alignItems:'center',
		justifyContent:'center',
		borderWidth: 1,
		borderRadius: 12,
		borderColor: StyleConstants.primary
	},

	dot: {
		width: 16,
		height: 16,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: 'transparent',
		backgroundColor: StyleConstants.primary,
	},

	selected: {
		width: 16,
		height: 16,
		borderRadius:10,
		alignSelf:'center',
		justifyContent:'center',
		padding:2,
		backgroundColor: StyleConstants.primary,
	}

});

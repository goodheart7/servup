/**
 * Created by Shoaib on 11/14/2016.
 */
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
let check= require('../../../res/common/check.png');

export default class Color extends Component {

	constructor (props) {
		super(props);
		this.state = { checked: false };
		this.onPressColor = this.onPressColor.bind(this);
	}

	onPressColor () {
		let {index, item} = this.props;
		this.setState({ checked: true });

		this.props.onPressColor(item,index);
	}

	render () {
		let {index, item, selectedColor} = this.props;
		let {checked} = this.state;
	//  console.log("Color", item);
		return (
			<TouchableOpacity
				onPress={this.onPressColor}
				style={styles.row}
			>
				<View style={[styles.colorOutline, {backgroundColor:item}]}>
					{selectedColor == index ? <View style={{
						borderWidth: 1,
						borderColor: StyleConstants.primary,
						borderRadius: 10,
						height: 41,
						width: 41
					}}>
					</View> : <View></View>}
				</View>
			</TouchableOpacity>
		);
	}

}

const styles = StyleSheet.create({

	row: {
		flexDirection: 'row',
	},

	colorOutline: {
		marginHorizontal: 5,
		width: 40,
		marginVertical:8,
		height: 40,
		alignItems:'center',
		justifyContent:'center',
		borderWidth: 1,
		borderRadius: 10,
		borderColor: 'transparent'
	},

	dot: {
		width: 14,
		height: 14,
		borderRadius: 7,
		borderWidth: 1,
		borderColor: 'transparent',
		backgroundColor: StyleConstants.primary,
	},

	selected: {
		width: 10,
		height: 10,
		borderRadius:3,
		alignSelf:'center',
		justifyContent:'center',
		padding:2,
		backgroundColor: StyleConstants.primary,
	}

});

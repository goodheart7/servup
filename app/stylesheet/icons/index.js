// Instructions On How To Use This Library
// import Icon from '../stylesheet/icons'
// <Icon name={'icon-dribbble'} fontSize={30} color={'black'} />

import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	Platform,
	View,
} from 'react-native';

import iconsCode from './iconsCode';

let glyphMapMaker = (glypy) => Object.keys(glypy).map((key) => {
	return {
		key,
		value: String.fromCharCode(parseInt(glypy[key], 16))
	};
})
.reduce((map, glypy) => {
	map[glypy.key] = glypy.value
	return map;
}, {});

let icons = glyphMapMaker(iconsCode);

export default class Icon extends Component {
	render () {
		let {name, fontSize, color, fontWeight} = this.props;

		let fSize = fontSize ? fontSize : 30;
		let fColor = color ? color : 'black';
		let fWeight = fontWeight ? fontWeight : 'normal';
		return (
			<Text style={[styles.icon, {fontSize: fSize, color: fColor, fontWeight:fWeight} ]}>
				{icons[name]}
			</Text>
		);
	}
}

const styles = StyleSheet.create({
	icon: {
		fontFamily: 'servup-icons',
	}
});

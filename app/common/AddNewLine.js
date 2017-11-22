import React, {
	Component,
} from 'react';

import {
	Navigator,
	ScrollView,
	TouchableOpacity,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	ListView,
	Image,
	AsyncStorage,


} from 'react-native';
import {fnt as fnt} from '../components/common/fontLib';
import {getCards as getCards} from '../lib/networkHandler';
import {themeColor as themeColor} from './theme';
var TitleBar = require('../components/common/TitleBar');

const {height, width} = Dimensions.get('window');


var AddNewLine = React.createClass( 
{
	render()
	{
		return (
		);
	},
});

const styles = StyleSheet.create(
{
	
});

module.exports = AddNewLine
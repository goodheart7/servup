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
var TitleBar = require('../components/common/TitleBar');
import {themeColor as themeColor} from './theme';

const {height, width} = Dimensions.get('window');


var NetworkSettings = React.createClass( 
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

module.exports = NetworkSettings
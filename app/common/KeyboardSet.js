import React, {
	Component,
} from 'react';

import {
	View,
	Platform
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

var KeyboardSet = React.createClass({

	render(){
		return <KeyboardSpacer topSpacing = {this.props.topSpacing || 0}/>;
	}

});

module.exports = KeyboardSet;

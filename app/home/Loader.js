import React, {
	Component,
} from 'react';

import {
	StyleSheet,
	View,
	Dimensions,
	ActivityIndicator,
} from 'react-native';


const {height, width} = Dimensions.get('window');
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

var Loader = React.createClass({

	render() {
    let {show} = this.props;

		return(
			<View style={[styles.container, styles.splash]}>
				<ActivityIndicator
					animating={!show}
					color={'white'}
					size= {'large'}
				/>
			</View>
		);
	},

});

const styles = StyleSheet.create({

	container: {
		flex: 1,
	},

	splash: {
    width: width,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: StyleConstants.primary,
  },

});

module.exports = Loader;

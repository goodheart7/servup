import React, {
	Component,
} from 'react';

import {
	StyleSheet,
	View,
	Image,
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
				<Image
					style={{justifyContent:'center', alignSelf:'center'}}
					source={require('../../res/cardLoader.gif')}
					resizeMode={'contain'}
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
    backgroundColor: '#FFFFFF',
  },

});

module.exports = Loader;

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

export default class Size extends Component {

	constructor (props) {
		super(props);
		this.state = { checked: false };
		this.onPressSize = this.onPressSize.bind(this);
	}

	onPressSize () {
		let {index, item} = this.props;
		this.setState({ checked: true });
		console.log('@@@@@@@@@@@@@@@@@@',item)
		this.props.onPressSize(item, index);
	}

	render () {
		let {index, item, selectedSize} = this.props;
		let {checked} = this.state;
		console.log("Color", item);
		return (
			<TouchableOpacity onPress={this.onPressSize} style={styles.row}>
				<View style={[styles.colorOutline]}>
					{selectedSize == index ? <View style={styles.selected}><Text style={{color:'white',fontSize:16,fontWeight:'bold'}}>{item}</Text></View> : <View ><Text>{item}</Text></View>}
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
		borderRadius: 35,
		borderColor: StyleConstants.primary
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
		marginHorizontal: 5,
		width: 40,
		marginVertical:8,
		height: 40,
		alignItems:'center',
		justifyContent:'center',
		borderWidth: 1,
		borderRadius: 35,
		borderColor: StyleConstants.primary,
		backgroundColor: StyleConstants.primary
	}

});

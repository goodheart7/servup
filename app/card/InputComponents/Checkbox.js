import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Dimensions,
} from 'react-native';
import attributeStyle from './Style';
import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
var { height, width } = Dimensions.get('window');
let Checkbox = React.createClass({

	getInitialState () {
		return {
			selected: this.props.isSelected,
		};
	},

	onPress (item) {

		this.setState({ selected: !this.state.selected }, () => {
			let obj = {
				"item": item,
				"state":this.state.selected,
			}
			this.props.onPressAdd(obj);
		});
	},

	render() {
		let {item} = this.props;

		renderSelect = () => {
			let {selected} = this.state;
			return selected ? <View style={styles.select}/> : <View></View>
		}

		return (
			<TouchableOpacity
				style={[styles.row, {width: this.props.singleItemWidth}]}
				onPress={() => this.onPress(item)}
				disabled = {this.props.onPress}
			>
				<View style={styles.checkbox}>
					{renderSelect()}
				</View>
				<Text style={attributeStyle.valueText}>{item}</Text>
			</TouchableOpacity>
		);
	}

});


const styles = StyleSheet.create({

	row: {
		flexDirection: 'row',
		//width: width/4,
		height: 30,
		//alignSelf:'center',
		margin: 5,
	},

	checkbox: {
		width: 20,
		height: 20,
		borderWidth: 0.75,
		borderColor: 'black',
		marginHorizontal: 10,
		marginVertical:3,
		//justifyContent: 'flex-start',
	},

	select: {
		width: 10,
		height: 10,
		marginVertical:5,
		backgroundColor: StyleConstants.primary,
		alignSelf: 'center',
		justifyContent:'center',
		alignItems:'center',
	}
});

export default Checkbox;

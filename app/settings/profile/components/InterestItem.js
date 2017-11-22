import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	Image,
} from 'react-native';

import _ from 'lodash';

import {
	Style,
	StyleConstants,
	Fonts
} from '../../../stylesheet/style';
const {height, width} = Dimensions.get('window');

var gearIconSource = 'http://cdn.mysitemyway.com/icons-watermarks/simple-black/raphael/raphael_gear-small/raphael_gear-small_simple-black_128x128.png';

export default class InterestCategory extends Component {

	constructor (props) {
		super(props);
		this.state = { status: this.props.status };
		this.handleOnPress = this.handleOnPress.bind(this);
		this.sendInformation = this.sendInformation.bind(this);
	}

	handleOnPress () {
		if (!this.state.status) {
			this.setState({ status: true }, () => { this.sendInformation() })
		} else {
			this.setState({ status: false }, () => { this.sendInformation() })
		}
	}

	sendInformation () {
		let obj = {
			categoryName: this.props.categoryName,
			interest: [this.props.interest],
			status: this.state.status,
		};
		this.props.onPressItem(obj);
	}

	selectedItem(status) {
		if (status)
			return (
				<View style = {{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
					<Image
						source = {{uri: gearIconSource}}
						style = {{width: 20, height: 20, tintColor: 'skyblue', top: 5}}
						resizeMode = {'contain'}
					/>
				</View>
			);
	}

	render () {
		let {interest} = this.props;
		let {status} = this.state;

		let containerBGColor = status ? StyleConstants.primary : 'white';
		let textColor = status ? StyleConstants.primary : 'black';

		return (
			<TouchableOpacity
				style={[styles.interest]}
				onPress={this.handleOnPress}
			>
				<View style = {styles.interestInternalView}>
					<View style = {[styles.imgContainer, {backgroundColor: status? 'white' : 'rgba(100,100,100,0.1)'}]}>
						<Image
							source = {{uri: gearIconSource}}
							style = {{width: 60, height: 60}}
							resizeMode = {'cover'}
						/>
						{this.selectedItem(status)}
					</View>
					<View style = {{flex: 1, marginVertical: 5}}>
						<Text style={[styles.interestText]}>{interest}</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({

	interest: {
		marginVertical: 5,
		marginHorizontal: 5,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: 'transparent',
		height: height/6,
		width: 100,
	},
	
	interestInternalView:
	{
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-around',
		marginVertical: 5,
		// marginHorizontal: 10,
	},

	imgContainer:
	{
		flex: 2,
		borderRadius: 4,
		padding: 5,
	},

	interestText: {
		color: 'black',
		textAlign: 'center',
		fontSize: 12,
		margin: 5,
		fontFamily: Fonts.regFont[Platform.OS],
	},

});

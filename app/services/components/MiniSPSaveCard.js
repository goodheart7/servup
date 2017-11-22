import React, { Component } from 'react';

import {
	StyleSheet,
	Text,
	View,
	Platform,
	TouchableOpacity,
 // Image,
	Dimensions,
} from 'react-native';

import {
	Style,
	StyleConstants,
	Fonts
} from '../../stylesheet/style';
const {height, width} = Dimensions.get('window');

let images = {
	'right_caret': require('../../../res/common/arrow_right.png'),
};
import Image from 'react-native-image-progress';
var defaultPic = require('../../../res/common/profile.png');
let MiniSPSaveCard = React.createClass({

	render () {

		let {featuredImage, serviceName, cardTitle, cardId, spLogo} = this.props;

		cardTitleText = cardTitle.length > 65 ? (cardTitle.substring(0, 65) + '...') : cardTitle;
		console.log('')
		spLogo = spLogo ? {uri: spLogo} : defaultPic;
		return (
			<TouchableOpacity
				style={[Style.rowWithSpaceBetween, styles.container]}
				onPress = {()=>this.props.navigator.push({id:40, cardId:cardId})}
			>

				<View style={[Style.rowWithSpaceBetween, {flex: 2, flexDirection: 'column'}]}>
					<View style={{backgroundColor: 'white'}}>
						<Image
							source={{uri: featuredImage}}
							style={[styles.image]}
							resizeMode="cover"
						/>
						<View style={{flexDirection:'row' }}>
							<Image
								source={spLogo}
								style={{bottom: 1, left: 6, width: 25, height: 25, borderRadius: 12,marginTop: -30,marginLeft:0, borderWidth:2.5, borderColor:'white',  marginHorizontal: 10}}
								resizeMode="cover"
							/>
						</View>
					</View>
					<View style={{alignSelf: 'stretch', paddingHorizontal: 8, flex: 3}}>
						<View style={{flexDirection:'row', justifyContent:'space-between'}}>
							<View>
								<Text style={[{
									fontWeight: '400',
									color: 'black',
									fontSize: 17,
									// fontFamily: Fonts.regFont[Platform.OS]
								}]}>
									{serviceName}
								</Text>
								<Text style={[styles.text, {paddingTop:5, paddingBottom:5}]}>
									{cardTitleText}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}

});

const styles = StyleSheet.create({

	container: {
		marginHorizontal: 5,
		marginTop: 5,
		marginVertical: 2,
		backgroundColor: 'white',
		padding: 5,
		height: height/3,
		width: height/3.5 + 20,
	},

	image: {
		alignSelf: 'center',
		width: height/3.5,
		height: height/7,
		marginHorizontal: 5,
		marginVertical: 5,
		borderWidth: 0.5,
		borderColor: 'gainsboro'
	},

	text: {
		color: 'black',
		fontSize: 15,
		fontFamily: Fonts.regFont[Platform.OS],
	},

});

export default MiniSPSaveCard;

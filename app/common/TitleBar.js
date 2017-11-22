import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	StyleSheet,
	Text,
	View,
	Image,
	Dimensions,
	Platform,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const {height, width} = Dimensions.get('window');

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

var defaultPic = require('../../res/common/emptyPixel.png');

var TitleBar = React.createClass({

	getDefaultProps() {
		return {
			// leftButton: defaultPic,
			// rightButton: defaultPic,
			// rightButton2: defaultPic,
			title: '',
			color1: StyleConstants.primary,
			color2: StyleConstants.primary,
			color3: StyleConstants.primary,
		};
	},

	render() {
		let {
			leftButton,
			onLeftButtonPress,
			title,
			rightButton,
			onRightButtonPress,
			rightButton2,
			onRightButton2Press,
			rightText,
			color1,
			color2,
			color3,
		} = this.props;

		// if (!leftButton) leftButton = defaultPic;
		// if (!rightButton) rightButton = defaultPic;
		// if (!rightButton2) rightButton2 = defaultPic;

		// if (rightButton && rightButton2) { leftMargin = 15 } else { leftMargin = 0 }

		let renderRightSide = () => {
			if (!rightText && rightButton && rightButton2) {
				return (
					<View style={styles.row}>
						<TouchableOpacity onPress={onRightButtonPress} style={styles.button}>
							<Image
								source={rightButton}
								resizeMode='contain'
								style={styles.icon}
							/>
						</TouchableOpacity>

						<TouchableOpacity onPress={onRightButton2Press} style={styles.button}>
							<Image
								source={rightButton2}
								resizeMode='contain'
								style={styles.icon}
							/>
						</TouchableOpacity>
					</View>
				);
			} else if (!rightText && rightButton && !rightButton2) {
				return (
					<TouchableOpacity onPress={onRightButtonPress} style={styles.button}>
						<Image
							source={rightButton}
							resizeMode='contain'
							style={styles.icon}
						/>
					</TouchableOpacity>
				);
			} else if (!rightButton && rightButton2) {
				return (
					<TouchableOpacity onPress={onRightButton2Press} style={styles.button}>
						<Image
							source={rightButton2}
							resizeMode='contain'
							style={styles.icon}
						/>
					</TouchableOpacity>
				);
			} else if (rightText && !rightButton && !rightButton2) {
				return (
					<TouchableOpacity onPress={onRightButton2Press} style={styles.text}>
						<Text style={styles.titleSideText}>
							{rightText}
						</Text>
					</TouchableOpacity>
				);
			} else if (!rightText && !rightButton && !rightButton2) {
				return (
					<TouchableOpacity style={styles.button}>
						<Image
							source={defaultPic}
							resizeMode='contain'
							style={styles.icon}
						/>
					</TouchableOpacity>
				);
			}
		}

		let renderTitleBar = () => {
			return(
				<LinearGradient
					style={[styles.container, Style.rowWithSpaceBetween, {zIndex: 5}]}
					colors={[color1, color2, color3]}>

					<TouchableOpacity onPress={onLeftButtonPress} style={styles.button}>
						<Image
							source={leftButton}
							resizeMode='contain'
							style={styles.icon}
						/>
					</TouchableOpacity>

					<Text style={styles.title}>
						 {title}
					</Text>

					{renderRightSide()}
				</LinearGradient>
			)
		}

		return(
			<View>
				{renderTitleBar()}
			</View>
		)
	}
});

const styles = StyleSheet.create(
{
	container: {
		height: StyleConstants.TitleFixedHeight,
		paddingHorizontal: 10,
	},

	icon: {
		width: 18,
		height: 18,
		justifyContent: 'center',
		// alignSelf: 'center',
		marginHorizontal: 10,
		marginTop: Platform.OS === 'ios' ? 30: 15,
	},

	button: {
		// marginTop: Platform.OS === 'ios' ? 10: 0,
	},

	row: {
		flexDirection: 'row',
	},

	title: {
		color: 'white',
		backgroundColor: 'transparent',
		fontSize: 22,
		fontWeight: '400',
		fontFamily: Fonts.regFont[Platform.OS],
		alignSelf: 'center',
		marginTop: Platform.OS === 'ios' ? 12: 0,
	},

	titleSideText: {
		color: 'white',
		backgroundColor: 'transparent',
		fontSize: 22,
		fontWeight: '400',
		fontFamily: Fonts.regFont[Platform.OS],
		alignSelf: 'center',
		marginTop: Platform.OS === 'ios' ? 12: 0,
	},

	text: {
		// marginHorizontal: 15,
		// marginVertical: 5,
		marginHorizontal: 10,
		// marginTop: Platform.OS === 'ios' ? 10 : 5,
		justifyContent: 'center',
	},

});

module.exports = TitleBar;

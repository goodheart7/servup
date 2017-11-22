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
	ScrollView,
	Image,
} from 'react-native';

import {
	Style,
	StyleConstants,
	Fonts
} from '../../../stylesheet/style';
const {height, width} = Dimensions.get('window');
var bgImg = require('./bgImage.jpg')
import InterestItem from './InterestItem';

export default class InterestCategory extends Component {

	constructor (props) {
		super(props);
		this.state = { show: false }
		this.renderItems = this.renderItems.bind(this);
	}

	renderItems (categoryName, interests) {
		// console.log('@@@@@@@@@@ Interests! ', interests);
		return interests.map((interest, i)=> {
			return (
				<InterestItem
					key={i}
					categoryName={categoryName}
					interest={interest.interestName}
					status={interest.status}
					onPressItem={this.props.onPressItem}
				/>
			);
		})
	}

	render () {
		let {show} = this.state;
		let {categoryName, interests, categoryUrl} = this.props;
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.categoryContainer}
					onPress={() => { this.setState({ show: !this.state.show }) }}
				>
					<Image
						source = {show? {uri: categoryUrl} : {uri: categoryUrl}}
						resizeMode = {'cover'}
						style = {{
							height: 70,
							width: width*0.9,
							padding: 5,
							borderWidth: 2,
							borderRadius: 4,
							alignItems: 'center',
							justifyContent: 'center',
							borderColor: show? 'transparent' : 'transparent',
						}}
					>
						<Text style={[styles.categoryName, {color: show? 'white' : 'black'}]}>
							{categoryName}
						</Text>
					</Image>
				</TouchableOpacity>

				<ScrollView
					style = {{flex: 1, backgroundColor: 'rgba(200,200,200,0.1)'}}
					horizontal = {true}
				>
					{show ? this.renderItems(categoryName, interests) : <View/>}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({

	container: {
		// paddingHorizontal: 10,
		flex: 1,
	},

	categoryContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		// backgroundColor: StyleConstants.primary,
		// paddingVertical: 15,
		marginVertical: 5,
		marginHorizontal: 10,
		borderWidth: 1,
		borderRadius: 4,
		borderColor: 'transparent',
		backgroundColor: 'transparent'
	},

	sign: {
		color: 'white',
		fontSize: 22,
		fontFamily: Fonts.regFont[Platform.OS],
	},

	categoryName: {
		width: width*0.9,
		fontSize: 20,
		color: 'black',
		textAlign: 'center',
		backgroundColor: 'rgba(200,200,200,0.7)',
		fontFamily: Fonts.regFont[Platform.OS],
		// marginVertical: 15,
	},

});

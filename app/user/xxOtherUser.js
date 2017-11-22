import React, {
	Component,
} from 'react';

import {
	TouchableOpacity,
	ScrollView,
	StyleSheet,
	Text,
	View,
	Dimensions,
	Platform,
	Image,
	AsyncStorage,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import get from '../../lib/get';
import MenuBar from '../common/MenuBar';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');

let images = {
	profileImage: require('../../res/common/profile.png'),
}

export default class OtherUser extends Component {

	constructor (props) {
		super(props);
		this.state = {
			otherPersonId: this.props.otherPersonId,
			info: [],
		}
	}

	componentDidMount () {
		// console.log('@@@@@@@@@@@@@ ###', this.state.otherPersonId);
		AsyncStorage.getItem("UserToken")
    .then((token) => {
      this.setState({ token });
			return get(token, 'ProfileCard/ViewOtherUserProfile/' + this.state.otherPersonId);
    })
		.then((res) => {
			if (res === 'Not Found') {
				console.log('@@@@@@@@@@@@ Not Found');
			}
			if (!res.Message && !res.Errors) {
				console.log(res);

				this.setState({
					info: res,
				});
			}
		})
		.catch((error) => {
      console.log('Error: ', error);
    });
	}

	render () {
    let {navigator} = this.props;
    let {info} = this.state;

		let name = info.name ? info.name : 'Username';
		let type = 'AppUser';

		renderAppUser = () => {

			image = info.profileUrl ? {uri: info.profileUrl} : images.profileImage;

			title = info.title ? info.title : 'Not Provided';
			description = info.description ? info.description: 'Not Provided';
			location = info.location ? info.location: 'Not Provided';
			personalUrl = info.personalUrl ? info.personalUrl : 'Not Provided';

			phone = info.mobileNumber ? info.mobileNumber.substring(2,14) : 'xxxxxxxxxx';
	    phone = '+' + phone.replace(/(.{2})(.{3})(.{3})/,'$1-$2-$3-');

			email = info.email ? info.email: 'Not Provided';

			return (
				<View>
					<View style={styles.rowProfileImageLocation}>

						<Animatable.View animation="fadeIn" style={styles.profileImagePlaceholder}>
							<Image source={image} style={styles.profileImageStyle} />
						</Animatable.View>

						<Text style={[Style.f16, Style.textColorBlack, styles.text]}>
							Location: {location}
						</Text>
					</View>

					<Animatable.View animation="fadeIn" style={styles.textGroup}>
						<Text style={[Style.f20, Style.textColorBlack]}>Phone:</Text>
						<Text style={[Style.f16, Style.textColorBlack]}>{phone}</Text>
					</Animatable.View>

					<Animatable.View animation="fadeIn" style={styles.textGroup}>
						<Text style={[Style.f20, Style.textColorBlack]}>Email:</Text>
						<Text style={[Style.f16, Style.textColorBlack]}>{email}</Text>
					</Animatable.View>

					<Animatable.View animation="fadeIn" style={styles.textGroup}>
						<Text style={[Style.f20, Style.textColorBlack]}>About Me:</Text>
						<Text style={[Style.f16, Style.textColorBlack]}>{description}</Text>
					</Animatable.View>

					<Animatable.View animation="fadeIn" style={styles.textGroup}>
						<Text style={[Style.f20, Style.textColorBlack]}>Title:</Text>
						<Text style={[Style.f16, Style.textColorBlack]}>{title}</Text>
					</Animatable.View>

					<Animatable.View animation="fadeIn" style={styles.textGroup}>
						<Text style={[Style.f20, Style.textColorBlack]}>Personal Url:</Text>
						<Text style={[Style.f16, Style.textColorBlack]}>{personalUrl}</Text>
					</Animatable.View>
				</View>
			)
		}

		return (
			<View style = {styles.container}>
				<MenuBar
          // color = {'red'} // Optional By Default 'black'
          title = {name} // Optional
          leftIcon = {'icon-arrow-left2'}
          // rightIcon = {'icon-done2'} // Optional
          // disableLeftIcon = {true} // Optional By Default false
          // disableRightIcon = {true} // Optional By Default false
          onPressLeftIcon = {() => { navigator.pop() }} // Optional
          // onPressRightIcon = {this.onSubmitForm} // Optional
        />

				<ScrollView style={styles.wrapper}>
					{type === 'AppUser' ? renderAppUser() : <View></View>}
				</ScrollView>
			</View>
		);
	}

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: StyleConstants.lightGray,
  },

	wrapper: {
		flex: 1,
		backgroundColor: 'white',
		borderColor: StyleConstants.lightGray,
		borderTopWidth: 2,
		borderBottomWidth: 0,
		borderLeftWidth: 2,
		borderRightWidth: 2,
	},

	rowProfileImageLocation: {
		borderBottomWidth: 0.45,
		borderBottomColor: 'black',
	},

	profileImagePlaceholder: {
    width: 100,
    height: 100,
		alignSelf: 'center',
		marginTop: 10,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    backgroundColor: StyleConstants.lightGray,
  },

  profileImageStyle: {
    width: 96,
    height: 96,
		alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 50,
		borderColor: 'transparent',
  },

	text: {
		width: width,
		textAlign: 'center',
		paddingVertical: 10,
	},

	textGroup: {
		padding: 10,
		borderBottomWidth: 0.45,
		borderBottomColor: 'black',
	},

});

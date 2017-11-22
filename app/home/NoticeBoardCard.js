import React, {
	Component,
} from 'react';

import {
	Navigator,
	View,
	Platform,
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	AsyncStorage,
	TimerMixin,
	Image,
} from 'react-native';

import Swiper from 'react-native-swiper';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import {
	Style,
	StyleConstants,
	Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');
const bgImage = require('../login/images/login1Light.png');
import get from '../../lib/get';
var adderInterval;
var adderTimeout;

var TelcoCards = React.createClass({

	getInitialState() {
		return {
			swiperHeight: 1,
			nbCards: [], // n.b.Cards as in Notice.Board.Cards
			// showNoticeLater: 'no',
			ready: false,
		};
	},

	componentDidMount() {
		get(this.props.token, 'Noticeboard')
		.then((value) => {
			console.log('@@@@@@@@@@@@@@@@@@@@@@@Notice Board Card', value)
			if (value.Message) {
				// If invalid token { Message: 'Authorization has been denied for this request.' }
				this.setState({ nbCards: [] });
			} else {
				this.setState({
					nbCards: value,
					swiperHeight: height/2.8,
				});
				setTimeout(()=> this.setState({ready: true}), 3000);
			}
		})
		.catch((error) => { console.log('NoticeBoardCard Error', error); });
	},

	onTouchEnd(e, state, context) {
		console.log('Swiped');
		this.props.later();
		// this.setState({ swiperHeight: 1 });
	},

	render() {
		let {nbCards, swiperHeight} = this.state;
		let {navigator} = this.props;

		let showCards = !((typeof nbCards == "undefined" ) || nbCards.length === 0) ? true : false;
			renderAllNotices = () => {
			 // console.log('@@@@@@@@@card', nbCards);
				return nbCards.map((card, i) => {
					//console.log('@@@@@@@@@@@@ index', i);
					return (
						<Image
							style = {styles.singleNotice}
							source = {bgImage}
							key={card.priority}
							// opacity = {}
						>
							<SingleNoticeBoardCard
								onTouchEnd = {this.onTouchEnd}
								navigator={navigator}
								text={card.text}
								cta={card.cta}
								ctaScreenId={card.screenId}
							/>
						</Image>
					);
				});
			};

		renderSingleNotice = () => {
			return (
				<LinearGradient
					style={styles.singleNotice}
					start={{x: 0, y: 0}} end={{x: 1, y: 0}}
					colors={[
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
				]}>
					<SingleNoticeBoardCard
						onTouchEnd = {this.onTouchEnd}
						later = {this.props.later}
						navigator={navigator}
						text={nbCards[0].text}
						cta={nbCards[0].cta}
						ctaScreenId={nbCards[0].screenId}
					/>
				</LinearGradient>
			);
		};

		loading = () => (
			<LinearGradient
				style={styles.singleNotice}
				start={{x: 0, y: 0}} end={{x: 1, y: 0}}
				colors={[
					'rgba(255, 255, 255, 1)',
					'rgba(255, 255, 255, 1)',
					'rgba(255, 255, 255, 1)',
			]}>
				<View style={styles.loader}>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" delay={500} easing={"linear"}
						style={styles.dot}>
					</Animatable.View>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" easing={"ease"}
						style={styles.dot}>
					</Animatable.View>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" delay={500} easing={"ease-in"}
						style={styles.dot}>
					</Animatable.View>
					<Animatable.View
						// ref="view"
						animation="bounceIn" iterationCount={"infinite"} direction="alternate" easing={"ease-out"}
						style={styles.dot}>
					</Animatable.View>
				</View>
			</LinearGradient>
		);

		renderSwiper = () => (
			<View style={styles.container}>
				<Swiper
					loop={false}
					showsPagination={false}
					height={swiperHeight}
					onMomentumScrollEnd = {this.props.later? this.onTouchEnd : null}
					scrollEnabled = {this.props.later? true : false}
				 	loadMinimal = {true}
				 	loadMinimalSize = {0}
					style={styles.swiperContainer}
				>
					{renderAllNotices()}


				</Swiper>
			</View>
		);

		return showCards ? this.state.ready? renderSwiper() : loading() : <View></View>
	}
});


let SingleNoticeBoardCard = React.createClass({
	getInitialState() {
		return {
			showNoticeLater: 'no',
			text: '',
		};
	},

	componentDidMount() {
		// console.log("Test is", this.props.text);
		// clearInterval(adderInterval);
		this.setState({text: ''});
		this.updateText(this.props.text);
		// AsyncStorage.getItem('NoticeBoardCardLater')
		// .then((showNoticeLater) => {
		// 	if (showNoticeLater == 'yes')
		// 		this.setState({showNoticeLater: 'yes'})
		// 	else
		// 		this.setState({showNoticeLater: 'no'})
		// })
		// .catch((showNoticeLaterError) => { console.log('showNoticeLaterError', showNoticeLaterError); });
	},

	componentWillUnmount() {
		this.adderInterval && clearInterval(this.adderInterval);
		this.adderTimeout && clearTimeout(this.adderTimeout);
	},

	textAdder() {
		var substringedText = this.state.textFull;
		substringedText = substringedText.substring(0, this.state.current+1);
		if (this.state.current != this.state.textFullLength)
		{
			this.adderTimeout = setTimeout(()=>
				this.setState({text: substringedText, current: this.state.current+1})
				, 50);
		}
		else
		{	
			this.componentWillUnmount();
		}
	},

	updateText(text) {
		this.setState({textFull: text, textFullLength: text.length, current: 0});
		this.adderInterval = setInterval(()=>this.textAdder(), 50);
	},

	delayNotice() {
		this.props.onTouchEnd(true);
		// this.setState({showNoticeLater: 'yes'});
		// AsyncStorage.setItem('NoticeBoardCardLater', 'yes')
		// .then((showNoticeLater) => {
		// 	console.log('showNoticeLater', showNoticeLater); 	
		// })
		// .catch((showNoticeLaterError) => { console.log('showNoticeLaterError', showNoticeLaterError) });
	},

	render() {
		let {text, cta, ctaScreenId, navigator} = this.props;
	//  console.log('@@@@@@@@@@@Cta Screen Id', ctaScreenId);
		let page = ctaScreenId === 'rateApp' || ctaScreenId === 'verifyEmail' ? 22 : ctaScreenId;
		return (
			<View style={{ flex: 1, justifyContent: 'center' }}>
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text style={styles.text}>
						{this.state.text}
					</Text>
				</View>

				<View style = {{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
					<TouchableOpacity
						style={styles.btnWhite}
						onPress={() => {
							navigator.push({ id: parseInt(page),
							props: {interestSelected: this.delayNotice} 
						}) }}
					>
						<Text style={styles.btnWhiteText}>{cta}</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
});

const styles = StyleSheet.create({

	container: {
		//marginVertical: 3,
		backgroundColor: '#FFFFFF',
		borderColor: '#F2F1EF',
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderBottomWidth: 5,
		borderTopWidth: 5,
	},

	swiperContainer: {
		height: height/2.8,
	},

	singleNotice: {
		height: height/2.8,
		justifyContent: 'center',
		// backgroundColor: StyleConstants.primary,//'red',
		padding: 20,
	},

	text: {
		fontSize: 22,
		textAlign: 'left',
		color: StyleConstants.primary,
		//fontWeight:'bold',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	btnWhite: {
		height: 45,
		// width: width/3,
		borderWidth: 1,
		borderRadius: 9,
		borderColor: StyleConstants.primary,//'#00833c',
		marginTop: 35,
		backgroundColor: StyleConstants.primary,
		paddingHorizontal: 15,
		// paddingVertical: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},

	btnWhiteText: {
		height: 25,
		color: 'white',
		fontSize: 18,
		textAlign: 'center',
		//fontWeight:'500',
		fontFamily: Fonts.regFont[Platform.OS],
	},

	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		marginHorizontal: 3,
		backgroundColor: 'black',
	},

	loader: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},

});

module.exports = TelcoCards

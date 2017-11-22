import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ListView,
  Dimensions,
  Navigator,
  Platform,
} from 'react-native';

var myList = ['Shoes X', 'Shoes Nike', 'Shoes Promotion', 'Shoes Marketing', 'Frog',
				'Shoes', 'Shoes Nike XL', 'Shoes Promotion International', 'Shoes Marketing Local', 'Frog The Prince'];

var suggestedSearchesArray = ['Shoes', 'Shoes Nike', 'Shoes Promotion', 'Shoes Marketing', 'Frog'];


var recentSearches =
	[
		{text:'Nike', image:'http://s3.amazonaws.com/coolchaser.com/thumb-13537278.jpg'}, // Nike Orange Logo
		{text:'Intel', image:'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Intel-logo.svg/150px-Intel-logo.svg.png'}, // Intel Logo
		{text:'1Byte', image:'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAb9AAAAJDk5ODg1ZjQwLTE0NjYtNDUzMy04ZGY2LTQ4OTYzYjUzYTUyYw.png'}, // OneByte Logo
		{text:'Apple', image:'http://thebrainfever.com/images/apple-logos/Silhouette.png'}, // Apple Logo
		{text:'Microsoft', image:'http://betanews.com/wp-content/uploads/2022/08/Microsoft-Logo1.jpg'}, // Microsoft Logo
		{text:'Gucci', image:'http://logok.org/wp-content/uploads/2015/02/Gucci-GG-logo.png'}, // Gucci Logo
		{text:'HP', image:'http://newscred.com/assets/img/v3/casestudies/client-logos/hp-logo-color.png'}, // HP Logo
		{text:'Superman', image:'https://s-media-cache-ak0.pinimg.com/236x/a5/fb/34/a5fb34354a92f7681663a625e72b8af4.jpg'}, // Superman Logo
	]

var cross = require('../../res/common/circled-corss_search_field.png');
const {height, width} = Dimensions.get('window');
const dismissKeyboard = require('dismissKeyboard');
var NavBar = require('../common/NavBar');
import {themeColor as themeColor} from '../common/theme';
import {fnt as fnt} from '../common/fontLib';
import SideMenu from '../common/xxSideMenu';
import Drawer from 'react-native-drawer';
var ds, recentSearchDS, updatedList;

var SearchScreen = React.createClass({
	getInitialState() {
		ds = new ListView.DataSource({
			rowHasChanged: (oldRow, newRow) => {
				// something
			}
		});

		recentSearchDS = new ListView.DataSource({
			rowHasChanged: (oldRow, newRow) => {
				// something
			}
		});

		suggestedSearchesDS = new ListView.DataSource({
			rowHasChanged: (oldRow, newRow) => {
				// Something
			}
		});

		return {
			recentSearchesDataSource: recentSearchDS.cloneWithRows(recentSearches),

			searchDataSource: ds.cloneWithRows(myList),

			suggestedSearches: suggestedSearchesDS.cloneWithRows(suggestedSearchesArray),

			searchText: '',
			searchCrossImage: null,
			expandedBar: false,
			PHC: 'rgba(255, 255, 255, 0.5)',
		}
	},

	// componentDidMount()
	// {
	// 	// SideMenu.changePic(this.props.ProfilePicFull);
	// },

	sideMenuScreen()
	{
	//	this.props.navigator.push ({id: 100,});
		this._drawer.open();
	},

	listviewRender() {
		if (this.state.expandedBar) {
			return (
				<View
					style={{ height: height }}
				>
					<ListView
						dataSource= {this.state.searchDataSource}
						renderRow= {this.expandedBar}
						enableEmptySections={true}
					/>
				</View>
			);
		}
	},

	header()
	{
		return (
			<View style={{backgroundColor:'#f2f1ef'}}>

			<View style={{backgroundColor:'white', marginHorizontal:5,}}>
				<Text style={styles.heading}>Recent Searches</Text>

				<View style={{marginHorizontal:10, flexDirection: 'row',}} >

					<ListView
						dataSource= {this.state.recentSearchesDataSource}
						renderRow= {this.recentSearchRenderRow}
						horizontal={true}
					/>

				</View>
			</View>


			<View style={{backgroundColor:'white', marginTop: 10, marginHorizontal:5 }}>
				<Text style={styles.heading}>Categories</Text>

				<View
					style={styles.category}
				>
					<Image
							resizeMode={'contain'}
							source={require('../../res/common/shopping_icon.png')}
					/>
					<Text style={styles.catText}>Shopping</Text>
				</View>

				<View
					style={styles.category}
				>
					<Image
							resizeMode={'contain'}
							source={require('../../res/common/music_icon.png')}
					/>
					<Text style={styles.catText}>Music</Text>
				</View>

				<View
					style={styles.category}
				>
					<Image
							resizeMode={'contain'}
							source={require('../../res/common//comedy_icon.png')}
					/>
					<Text style={styles.catText}>Comedy</Text>
				</View>

				<View
					style={styles.category}
				>
					<Image
							resizeMode={'contain'}
							source={require('../../res/common/food_icon.png')}
					/>
					<Text style={styles.catText}>Food</Text>
				</View>

			</View>

				<View style={styles.suggestedSearchesHeading} >
					<Text style={styles.heading}>Suggested Searches</Text>
				</View>
			</View>
		);
	},

	footer()
	{
		return (
			<View style={{ flex:1,  backgroundColor: '#f2f1ef' }}>
	 			<Text style={styles.heading}>Trending Tags</Text>
					<View style={styles.trending}>
					<View style={styles.trendingCol}>
						<View
							style={styles.trendingChildrenLeft}
						>
							<Text style={styles.trendingText}>#Music</Text>
						</View>
						<View
							style={styles.trendingChildrenLeft}
						>
							<Text style={styles.trendingText}>#Discounts</Text>
						</View>
					</View>

					<View style={styles.trendingCol}>
						<View
							style={styles.trendingChildrenRight}
						>
							<Text style={styles.trendingText}>#LOL</Text>
						</View>
						<View
							style={styles.trendingChildrenRight}
						>
							<Text style={styles.trendingText}>#ShoppingNew</Text>
						</View>
					</View>
				</View>
			</View>
		);
	},

	recentSearchRenderRow(rowData, sectionID, rowID) {
		console.log ('rendering image: ' + rowData);
		return (
			<View
				style={{ height:120, alignSelf: 'center', justifyContent: 'center', marginHorizontal: 10 }}
			>
				<Image
					style={{ alignSelf:'center', height: 60, width: 60, borderRadius:30, borderWidth: 0}}
					resizeMode={'cover'}
					source={{ uri: rowData.image }}
				>
				</Image>
				<Text style={{textAlign:'center', marginTop:5}}>
					{rowData.text}
				</Text>
			</View>
		);
	},

	ssRenderRow(rowData, sectionID, rowID) {
		return (
			<View style={styles.suggestedSearches} >
				<Text style={styles.catText}>{rowData}</Text>
				<Image
					resizeMode={'contain'}
					source={require('../../res/common/recent_search_icon.png')}
					style = {{marginRight: 10,}}
				/>
			</View>
		);
	},

	expandedBar(rowData, sectionID, rowID) {
		if (this.state.expandedBar)
			return (
				<View>
					<View style={styles.searchItem}>
						<View style={styles.searchItems}>
							<Text style = {styles.listItemText}>{rowData}</Text>
							<Image
								style={{ alignSelf:'center' }}
								resizeMode={'contain'}
								source={require('../../res/common/recent_search_icon.png')}
							/>
						</View>
					</View>
				</View>
			);
	},

	focus(){
		this.setState({
			expandedBar:true,
			PHC: 'rgba(255, 255, 255, 1)',
		});
	},

	change(e) {
		this.setState({
			searchText:e,
			expandedBar:true,
			searchCrossImage: cross,
		}, function() { console.log(e); } );

		// let updatedList = myList;
		// updatedList.filter(e);

		updatedList = myList.filter(function(l){
				return l.toLowerCase().match( e.toLowerCase() );
		});


		this.setState({
			searchDataSource: ds.cloneWithRows(updatedList),
		});
	},

	backButton(){
		this.props.navigator.pop();
	},

	clearSearchArea() {
		console.log('Button Pressed');
		dismissKeyboard();
		this.setState({
			searchText: '',
			expandedBar: false,
			searchCrossImage: null,
			PHC: 'rgba(255, 255, 255, 0.5)',
		});
	},

	render()
	{
		closeControlPanel = () =>
		{
			this._drawer.close()
		}

		openControlPanel = () =>
		{
			this._drawer.open()
		}

		return (
			<Drawer
				ref = {(ref) => {this._drawer = ref; return ref;}}
				type = "overlay"
				content = {<SideMenu navigator = {navigator}/>}
				openDrawerOffset = {0.2}
				side = "right"
				tapToClose = {true}
				tweenHandler = {(ratio) => {
					return {
						drawer: { shadowRadius: Math.min(ratio*5*5, 5)},
						main: { backgroundColor: 'black', opacity:(2-ratio)/2},
					}
				}}
			>
		  <View style={styles.container}>
			<View style = {styles.extraArea}>
			</View>
			<View
				// Search Area Container Starts Here
				style={styles.searchContainer} >

				<TouchableOpacity
					style={styles.searchAreaImage}
					onPress={this.backButton}
				>
					<Image
						style={styles.searchAreaImage}
						resizeMode={'contain'}
						source={require('../../res/common/back.png')}
					/>
				</TouchableOpacity>

				<View style={styles.mainborder}>
					<View style={{flex: 1, alignSelf: 'center', alignItems: 'center',}}>
						<Image
							style = {{marginLeft: 10}}
							resizeMode={'contain'}
							source={require('../../res/common/search_gray.png')}
						/>
					</View>

					<View style = {styles.searchFieldContainer}>
						<TextInput
							style={styles.searchField}
							placeholder={"Search"}
							onChangeText ={this.change}
							placeholderTextColor={'#6666'}
							maxLength={15}
							onFocus = {this.focus}
							value={this.state.searchText}
							onBlur={this.clearSearchArea}
							underlineColorAndroid={"white"}
						/>
					</View>
				</View>

				<TouchableOpacity
					style={{ flex: 3, marginLeft:10 }}
					onPress={this.clearSearchArea}
					disabled={!(this.state.expandedBar)}
				>
					<Text style={{color: this.state.PHC}}>Cancel</Text>
				</TouchableOpacity>
			</View>

			{this.listviewRender()}


			<View style={{backgroundColor:'white', marginTop: 10, flex: 1}}>

					<View style={{ flex: 1}}>
						<ListView
							dataSource= {this.state.suggestedSearches}
							renderRow= {this.ssRenderRow}
							renderHeader={this.header}
							renderFooter ={this.footer}
						/>
					</View>
			</View>

			<NavBar
				navigator = {this.props.navigator}
				profileImage = {this.props.ProfilePicFull}
			/>
		  </View>
		  </Drawer>
		);
	},

});

const styles = StyleSheet.create({

  container: {
	flex: 1,
	backgroundColor: '#f2f1ef',
  },

  extraArea:
	{
		height: height/40,
		backgroundColor: themeColor.wind,
	},

  // Search Area Style
  searchContainer: {
	// flex:1,
	flexDirection: 'row',
	backgroundColor: themeColor.wind,
	alignItems: 'center',
	height: height/12,
  },
  searchAreaImage: {
	marginHorizontal: 0,
	flex:1,
	padding: 5,
	alignItems: 'flex-start',
  },

	searchAreaImage2:
	{
		marginHorizontal: 5,
		flex:1,
		padding: 10,
		alignItems: 'flex-end',
	//  alignItems: 'center',
	},

  searchFieldContainer: {
  	flex: 8,
  	backgroundColor: "white",
  	borderColor: 'white',
  	alignItems: 'center',
  	alignSelf: 'center',
    borderRadius: width/50,
  	height: 35,
  },

  searchField: {
	  alignSelf: 'center',
	  justifyContent: 'center',
    backgroundColor: "transparent",
	  textAlign: 'left',
  	fontSize: 14,
  	width: width*0.65,
  	height: 38,
  	top: 1,
  },

  mainborder:
  {
  	flex:15,
  	alignItems:'center',
  	alignSelf:'center',
  	flexDirection: 'row',
  	backgroundColor: 'white',
  	borderWidth: 0,
  	borderRadius: width/50,
  },

  searchItem: {
	borderBottomColor: '#9999',
	borderBottomWidth: 1,
	borderTopWidth: 0,
	borderLeftWidth: 0,
	borderRightWidth: 0,
	backgroundColor: '#ececec',
  },
  searchItems: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	padding: 5,
	marginHorizontal: 15,
	marginVertical:5,
  },

  listItemText:
  {
  	color: '#9999',
  	fontFamily: fnt.regFont[Platform.OS],
  },

  heading: {
	alignSelf: 'flex-start',
	marginTop: 20,
	marginLeft: 10,
	marginBottom: 10,
	fontFamily: fnt.regFont[Platform.OS],
  },

  category: {
	backgroundColor: 'white',
	flexDirection: 'row',
	paddingVertical: 20,
	marginHorizontal: 10,
	// marginVertical: 2.5,
  },

  catText:
  {
	fontFamily: fnt.regFont[Platform.OS],
	flex:1,
	fontSize: 15,
	alignSelf: 'center',
	marginLeft: 20,
	fontFamily: fnt.regFont[Platform.OS],
  },

  suggestedSearchesHeading: {
  	backgroundColor: '#ffffff',
  	paddingHorizontal: 15,
	// marginHorizontal: 15,
  	borderBottomWidth: 2,
  	borderTopWidth: 10,
  	borderLeftWidth: 4,
  	borderRightWidth: 4,
  	borderColor: '#ececec',
  },

  suggestedSearches: {
  	backgroundColor: 'white',
	flexDirection: 'row',
	padding: 20,
	paddingHorizontal: 15,
	// marginHorizontal: 15,
  	borderBottomWidth: 2,
  	borderLeftWidth: 4,
  	borderRightWidth: 4,
  	borderColor: '#ececec',
  },

  trending: {
	flexDirection: 'row',
  },
  trendingCol: {
	flexDirection: 'column',
	flex:1,
  },
  trendingChildrenLeft: {
	flex: 1,
	backgroundColor: 'white',
	marginBottom: 5,
	marginRight: 2.5,
	marginLeft: 5,
	paddingVertical: 15,
  },
  trendingChildrenRight: {
	flex: 1,
	backgroundColor: 'white',
	marginBottom: 5,
	marginRight: 5,
	marginLeft: 2.5,
	paddingVertical: 15,
  },
  trendingText: {
	textAlign: 'center',
	fontFamily: fnt.regFont[Platform.OS],
  }




});

module.exports = SearchScreen;

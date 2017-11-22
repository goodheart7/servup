import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  TouchableOpacity,
  AsyncStorage,
  TextInput,
  Platform,
} from 'react-native';

import * as Animatable from 'react-native-animatable';
import TitleBar from '../common/TitleBar';
import MiniCard from './components/MiniCard';

import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';
const {height, width} = Dimensions.get('window');

import Icon from '../stylesheet/icons'

import {get} from '../../lib/rest';

let images = {
  'right_caret': require('../../res/common/arrow_right.png'),
  'left_caret': require('../../res/common/back.png'),
  'empty': require('../../res/common/emptyPixel.png')
}

var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})

export default class SearchScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      search: '',
      location: '',
      query: '',
      searchList: ds.cloneWithRows([]),
    };

    this.onPressBack = this.onPressBack.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.getSearch = this.getSearch.bind(this);
    this.renderSearchList = this.renderSearchList.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem("UserToken")
      .then((value) => {
        this.setState({
          token: value,
        });
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
  }

  onPressBack() {
    this.props.navigator.pop();
  }

  handleOnChange() {
    let {query} = this.state;

    let endPoint = `Users/Search/`;
    let param = `${query}`.trim();
    let api = endPoint + param;

    this.setState({loading: true});

    if (query.length !== 0) {
      this.getSearch(api);
    }
  }

  renderSearchPlate() {

    return (
      <TouchableOpacity onPress={onPressLeftIcon} style={{
				justifyContent: 'center',
				flexDirection: 'row',
				backgroundColor: '#f2f2f2',
				height: 35,
				paddingRight: 130,
				paddingLeft: 0,
				marginTop: 13
			}}>
        <View style={{paddingVertical: 5, marginLeft: 10}}>
          <Icon name={searchPlate} fontSize={25} color={fontColor}/>
        </View>
        <Text style={{
					color: 'grey',
					paddingHorizontal: 14,
					fontFamily: Fonts.regFont[Platform.OS],
					paddingVertical: 6,
					fontSize: 16
				}}>Search Servup</Text>
      </TouchableOpacity>
    );
  }

  getSearch(api) {

    get(this.state.token, api)
      .then((res) => {
        console.log('@@@@@@@@ :', res)
        if (res.Message) {
          this.setState({
            loading: false,
          });
        } else {
          this.setState({
            loading: false,
            searchList: this.state.searchList.cloneWithRows(res)
          });
        }
      })
      .catch((err) => {
        console.log('Error :', err);
      });

  }


  renderSearchList(rowData, sectionID, rowID) {
    let {navigator} = this.props;
    let {
      cardId,
      spId,
      spName,
      cardTitle,
      cardDescription,
      cardTags,
      location,
      primaryMediaUrl,
      price,
      cardStartDate,
      cardEndDate
    } = rowData;
    // console.log('@@@@@@@@@@@@@@@', rowData);
    return (
      <MiniCard
        key={rowID}
        navigator={navigator}
        token={this.state.token}
        {...rowData}
      />
    );
  }

  render() {
    let {loading, searchList, search, location, query} = this.state;
    let rowCount = searchList ? searchList.getRowCount() : '';
    console.log('@@@@@@ searchList', rowCount);
    renderLoader = () => {
      if (loading) {
        return (
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
        );
      } else {
        return rowCount ? renderList() : renderEmpty();
      }
    }
    renderEmpty = () => {
      return (
        <View style={{height:height*0.30, alignItems:'center',width:width, justifyContent:'center', alignSelf:'center', backgroundColor:StyleConstants.primary}}>
          <Text style={{fontSize:16,color:'white',fontFamily: Fonts.regFont[Platform.OS]}}> No Results Found</Text>

        </View>
      );
    }
    renderList = () => {
      return (
        <ListView
          ref='list'
          dataSource={searchList}
          renderRow={this.renderSearchList}
          enableEmptySections={true}
          bounces={false}
        />
      );
    }

    return (
      <View style={styles.container}>

        <View style={[styles.row, styles.navbar]}>

          <TouchableOpacity style={{justifyContent: 'center', marginHorizontal:10}} onPress={this.onPressBack}>
            <Icon name={'icon-back_screen_black'} fontSize={18} color={'black'}/>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <View style={{marginTop:5,flex:1}}>
              <Icon name={'icon-discover'} fontSize={18} color={'grey'}/>
            </View>
            <TextInput
              ref="query"
              autoFocus={true}
              placeholderStyle={[Style.f16, styles.input]}
              placeholderTextColor={StyleConstants.textColorGray}
              placeholder="Search Servup"
              keyboardType="default"
              value={query}
              returnKeyType="done"
              underlineColorAndroid="transparent"
              style={[Style.f16, styles.input]}
              onChangeText={(query) => {
								this.setState({query}, () => {
									this.handleOnChange();
								});
							}}
              onSubmitEditing={(event) => {
								this.handleOnChange();
							}}
            />
          </View>
        </View>

        <ScrollView style={styles.wrapper}>
          {renderLoader()}
        </ScrollView>
      </View>
    );
  }

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    //marginTop:5,
    backgroundColor: StyleConstants.lightGray,
  },

  wrapper: {
    flex: 1,
    margin: 5,
    backgroundColor: 'white',
    padding: 10
  },

  navbar: {
    height: 60,
    backgroundColor: 'white',
    borderBottomWidth: 0.5,
    borderBottomColor: 'grey',
    paddingHorizontal: 10,
  },

  row: {
    flexDirection: 'row',
  },

  title: {
    color: 'red',
    fontSize: 16,
  },

  inputContainer: {
    flex: 1,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    alignSelf: 'center',
    //borderRadius: 4,
    //borderWidth: 0.75,
    backgroundColor: '#f2f2f2',

    //borderColor: 'gray',
    marginLeft: 5,
  },

  input: {
    height: 35,
    marginHorizontal: 5,
    flex: 9,
    //paddingHorizontal: 20,
    paddingVertical: 6,
    fontFamily: Fonts.regFont[Platform.OS],
  },

  loader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
    backgroundColor: 'black',
  }

});

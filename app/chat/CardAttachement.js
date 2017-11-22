/**
 * Created by Shoaib on 11/7/2016.
 */
import React, {
  Component,
} from 'react';
import {getTimelineCards} from '../../lib/networkHandler';
import {
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  Animated,
  View,
  ListView,
  Image,
  AsyncStorage,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  Style,
  StyleConstants,
  Fonts
} from '../stylesheet/style';

import * as Animatable from 'react-native-animatable';
const {height, width} = Dimensions.get('window');
var CardAttachement = React.createClass(
  {
    getDefaultProps: function () {
      return {
        //rating
        maxQunatity: '12',
      };
    },
    getInitialState() {
      ds = new ListView.DataSource({ rowHasChanged: (oldRow, newRow) => { } });
      return {
        liked: false,
        cardSource: ds,
        Token: '',
      };
    },
    componentDidMount() {
      AsyncStorage.getItem("UserToken")
      .then((token) => {
        this.setState({token: token});
        return getTimelineCards(this.state.token);
      })
      .then((resp) => {
        var array;
        if (resp.Message)
          array = [];
        else
          array = resp;
        console.log('@@@@@@@@@@@@cards sss', array);
        this.setState({cardSource: ds.cloneWithRows(array)});
      })
      .done();
    },

    renderCards(rowData, sectionID, rowID) {
      return (
        <View >
         <TouchableOpacity
          style={[Style.rowWithSpaceBetween, styles.cardContainer]}
          onPress={() => this.props.shareCard(rowData)}
        >

          <View style={{flexDirection: 'row'}}>
            <Image
              source={{uri: rowData.primaryMediaUrl}}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={{alignSelf: 'center', paddingHorizontal: 10}}>
              <Text style={Style.b}>{rowData.spName}</Text>
              <Text style={styles.text}>{rowData.cardTitle}</Text>
            </View>
          </View>

          <View style={Style.center}>
            <Text>O</Text>
          </View>

        </TouchableOpacity>
        </View>
      );
    },

    render() {
      //console.log('@@@@@@@@@@@@@@@@@@@array',this.state.reviews);
      return (
        <ScrollView style={{height:height}}>
          <ListView
            ref='ListView'
            style={styles.listView}
            bounces={false}
          //  removeClippedSubviews={false}
            //renderHeader={this.renderHeader}
            dataSource={this.state.cardSource}
            renderRow={this.renderCards}
            enableEmptySections={true}
            //scrollEventThrottle={18}

          />
        </ScrollView>
      );
    },


  });
const styles = StyleSheet.create(
  {
    container:{
      width: width,
      backgroundColor: '#FFFFFF',
      borderColor: '#F2F1EF',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderBottomWidth: 5,
      borderTopWidth: 5,
    },
    cardContainer: {
      //marginHorizontal: 5,
      marginVertical: 2,
      backgroundColor: 'white',
      padding: 5
    },

    image: {
      width: 90,
      height: 90,
      borderWidth: 0.5,
      borderColor: 'gainsboro'
    },

    text: {
      width: width * 0.5,
    },

  });
export default CardAttachement;
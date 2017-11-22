import React, {
    Component,
} from 'react';

import {
    Navigator,
    ScrollView,
    TouchableOpacity,
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Platform,
    ListView,
    Image,
    AsyncStorage,
    Switch,
} from 'react-native';

import Drawer from 'react-native-drawer';
import Modal from 'react-native-simple-modal';
import {fnt as fnt} from './fontLib';
import {themeColor as themeColor} from './theme';
import {getUserSubscribedCards as getUserSubscribedCards} from '../../lib/networkHandler';
import {getRelations} from '../../lib/networkHandler'
import SideMenu from './xxSideMenu';

const {height, width} = Dimensions.get('window');
var TitleBar = require('./TitleBar');
var NavBar = require('./NavBar');

var ds;
var bgWhite = '#FFFFFF';
var arrow_right = require('../../res/common/arrow_right.png');

var phoneContacts = [
    {
        name: 'Adeel Imran',
        number: '092333472645487',
        relationship: 'Friends',
        image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
    },
    {
        name: 'Shoaib Riaz',
        number: '092333472645487',
        relationship: 'Friends',
        image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
    },
    {
        name: 'Adeel Imran',
        number: '092333472645487',
        relationship: 'Friends',
        image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
    },
    {
        name: 'Shoaib Riaz',
        number: '092333472645487',
        relationship: 'Family',
        image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
    },
    {
        name: 'Adeel Imran',
        number: '092333472645487',
        relationship: 'Friends',
        image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
    },
    {
        name: 'Shoaib Riaz',
        number: '092333472645487',
        relationship: 'Family',
        image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
    },
    {
        name: 'Adeel Imran',
        number: '092333472645487',
        relationship: 'Family',
        image: 'http://www.gravatar.com/avatar/647850cb29e23f70071cbb86c4002804?d=monsterid&s=50&r=G'
    },
    {
        name: 'Shoaib Riaz',
        number: '092333472645487',
        relationship: 'Family',
        image: 'https://2.gravatar.com/avatar/5c299a02c11ce797f20df385f560a16a?d=https%3A%2F%2Fidenticons.github.com%2Feedad495d6af63b2a3e13cfd104f252e.png&r=x&s=300'
    },
]

var DefineRelationship = React.createClass( 
{
    getInitialState() {     
        ds = new ListView.DataSource({ rowHasChanged: (oldRow, newRow) => { } });
        return {
            contactSource: ds,
            backed:  false,
            modalOpen: false,
            currentRender: "Recieved",
            activeButtonStyle: styles.topButtonSelectedActive,
            savedButtonStyle: styles.topButton,
            activeFont: styles.selectedFontStyle,
            savedFont: styles.unSelectedFontStyle,  
        }
    },

    componentDidMount() {
        AsyncStorage.getItem("UserToken")
        .then((value) => {
            this.setState({"token": value});
            console.log('DefineRelationship.js->componentDidMount() token is:' + value);
            return AsyncStorage.getItem("UserID")
        })
        .then((value) => {
            console.log('DefineRelationship.js->componentDidMount() UserID is:' + value);
            this.setState({ UserID: value });
            this.setState({ contactSource: ds.cloneWithRows(phoneContacts) });
            return getRelations(this.state.token)
             return AsyncStorage.getItem("serupContactBook")
            // return getUserSubscribedCards(this.state.token, this.state.UserID);
        })
        .then((resp) => {
            resp =phoneContacts;
            this.setState({ contactSource: ds.cloneWithRows(resp) });
             //console.log('DefineRelationship' , this.state.contactSource);
          //  return getRelations(this.state.token)
            // return getUserSubscribedCards(this.state.token, this.state.UserID);
        })
        // .then((cards) => {
        //     // console.log("MyServices.js->componentDidMount() User subscribed cards are:" + JSON.stringify(cards.cards));
            
        //     // this.setState({ cardsSource: ds.cloneWithRows(cards.cards) });
        //     // this.setState({ recievedSource: ds.cloneWithRows(phoneContacts) });
        //     // console.log(this.state.recievedSource)
        // })
        .catch((err) => {
            console.log(err);
        })
    },

    backFunction() {
        if (this.state.backed == false) {
            this.state.backed = true;
            setTimeout(()=>{this.state.backed = false;}, 1000);
            this.props.navigator.pop();
        }
    },

    render() {
        var navigator = this.props.navigator;
        return(
            <View style = {styles.scrollBox}>
                <TitleBar
                    leftButton = {require('../../res/common/back.png')}
                    title = "Define Relationship"
                    onLeftButtonPress={this.backFunction}
                />
                <TouchableOpacity style={styles.rows}>
                    <Image
                        style = {styles.contactImage}
                        source = {{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRUONXaNwMCUh9Wcv-VO55XzyjPIsgBD_iJPuXhhoeW1r_suyEAWw' }}
                        resizeMode = {'cover'}
                    />

                    <View style = {styles.rightNextToIt}>
                        <View>
                            <Text style = {styles.textStyleMini}>
                                Friends
                            </Text>
                        </View>
                    </View>

                    <View style = {styles.rightNextToIt}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => { } } style={styles.button}>
                                <Image source = {require('../../res/common/redHeart.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity> 
                <View style = {styles.categoryText}>
                    <View>
                        <Text style = {styles.textStyleMini}>
                            Family
                        </Text>
                    </View>
                </View>
                { this.renderRecievedRequest() }

                <NavBar
                    navigator = {this.props.navigator}
                    profileImage = {this.props.ProfilePicFull}
                /> 
        
            </View>
        );
    },

    renderFamilySection(rowData, sectionID, rowID) {
        return (
                <TouchableOpacity style={styles.rows}>
                    <Image
                        style = {styles.contactImage}
                        source = {{ uri: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRUONXaNwMCUh9Wcv-VO55XzyjPIsgBD_iJPuXhhoeW1r_suyEAWw' }}
                        resizeMode = {'cover'}
                    />

                    <View style = {styles.rightNextToIt}>
                        <View>
                            <Text style = {styles.textStyleMini}>
                                rowData.relationshipType
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity> 
        );
    },  
    
});

const styles = StyleSheet.create({
    scrollBox:
    {
        flex:1,
        backgroundColor: bgWhite,
    },

    cols:
    {
        flex: 1,
    },

    rightNextToIt:
    {
        alignSelf: 'center',
    },

    greyText: 
    {
        marginHorizontal:5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    categoryText: 
    {
        backgroundColor :'#f2f1ef',
        marginHorizontal:5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },

    buttonWhite:
    {
        marginHorizontal:5,
        // paddingVertical: 5,
        width: width*.20,
        // paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'darkslategrey',
    },

    button: 
    {
        marginHorizontal:5,
        alignSelf: 'center',
    },

    relationshipText: {
        paddingVertical: 5,
        alignSelf: 'center',
    },

    rowsTitle:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
    //  marginHorizontal: 15,
    },

    topButton:
    {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        borderWidth: 0,
        borderBottomWidth: 4,
        borderBottomColor: bgWhite,
        borderTopColor: 'transparent',
        borderLeftColor: '#ececec',
        borderRightColor: '#ececec',
        backgroundColor: bgWhite,
        marginHorizontal: 15,
        marginBottom: -1,
    },

    topButtonSelectedActive:
    {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        borderWidth: 0,
        borderBottomWidth: 3,
        borderBottomColor: themeColor.wind,
        borderTopColor: bgWhite,
        borderLeftColor: '#ececec',
        borderRightColor: '#ececec',
        backgroundColor: bgWhite,
        marginLeft: 15,
        marginBottom: -1,
    },

    topButtonSelectedSaved:
    {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        borderWidth: 0,
        borderBottomWidth: 3,
        borderBottomColor: themeColor.wind,
        borderTopColor: bgWhite,
        borderLeftColor: '#ececec',
        borderRightColor: '#ececec',
        backgroundColor: bgWhite,
        marginRight: 15,
        marginBottom: -1,
    },

    container: 
    {
        flex:1, 
        backgroundColor: bgWhite,
        borderWidth: 4,
        borderTopWidth: 6,
        borderBottomWidth: 0,
        borderColor: '#ececec',
        marginBottom: 50,
    },

    section: 
    {
        backgroundColor: bgWhite,
        borderLeftWidth: 4,
        borderRightWidth: 4,
        borderTopWidth: 4,
        borderBottomWidth: 0,
        borderColor: '#ececec', 
    },

    rowsTop:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        borderWidth: 4,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        // borderBottomWidth: 0,
        borderTopColor: '#ececec',
        borderLeftColor: '#ececec',
        borderRightColor: '#ececec',
        borderBottomColor: '#ececec',
        backgroundColor: bgWhite,
    },

    rows:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 6,
        borderWidth: 0,
        borderTopWidth: 1,
        borderBottomWidth: 4,
        borderBottomColor: '#ececec',
        borderTopColor: '#ececec',
        borderLeftColor: '#ececec',
        borderRightColor: '#ececec',
        backgroundColor: bgWhite,
    },

    textStyle:
    {
        width: width*.45,
        alignSelf: 'flex-start',
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
        fontFamily: fnt.regFont[Platform.OS],
        marginLeft: 10,
        marginBottom: 5,
    },

    textStyleMini:
    {
        width: width*.45,
        alignSelf: 'flex-start',
        fontSize: 20,
        color: '#666666',
        fontFamily: fnt.regFont[Platform.OS],
        marginLeft: 10,
    },

    selectedFontStyle:
    {
        alignSelf: 'center',
        fontSize: 11,
        color: themeColor.wind,
        fontFamily: fnt.regFont[Platform.OS],
        marginLeft: 10,
    },

    unSelectedFontStyle:
    {
        alignSelf: 'center',
        fontSize: 11,
        color: '#666666',
        fontFamily: fnt.regFont[Platform.OS],
        marginLeft: 10,
    },

    sentInvite: 
    {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    switchArea:
    {
        width: 80,
        height: 80,
        alignSelf: 'center',
    },

    contactImage:
    {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignSelf: 'center',
    },

    arrowArea:
    {
        marginRight: 15,
    },
     blueTextArea:
    {
        flex: 1,
        width: width,
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10,
    },

    blueText:
    {
        flex: 1,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        // fontWeight: 'bold',
        color: themeColor.wind,
        fontFamily: fnt.regFont[Platform.OS],
    },

    redText:
    {
        flex: 1,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'red',
        fontFamily: fnt.regFont[Platform.OS],
    },

    whiteArea:
    {
        flex: 1,
        backgroundColor: bgWhite,
    },
});

module.exports = DefineRelationship
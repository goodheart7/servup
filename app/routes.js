import React, {
	Component,
} from 'react';

import {
	Navigator,
	BackAndroid,
	Platform,
} from 'react-native';

import Splash from './login/Splash';

import LoginScreen from './login/LoginScreen';
import LoginCredentials from './login/LoginCredentials';
import TOS from './login/TOS';
import WelcomeBack from './login/WelcomeBack';
import SendByEmail from './login/SendByEmail';
import Forgotpassword from './login/Forgotpassword';
import Intro from './login/Intro';
import SpUser from './card/spUserProfile/SpUser';
import Home from './home/Home';
import TermsAndConditions from './settings/TermsAndConditions';
import SpDetailedCard from './card/CardDetails/SpDetailedCard';
import GroupOrderCard from './card/GroupOrderCardView/GroupOrderCard';
import SpCardSummary from './card/CardSummary/spCardSummary';
import ChooseMembers from './card/chooseMembers';
import SelectedUsers from './card/selectedUsersList';
import Reviews from './card/Reviews';
import PaymentHistory from './card/cardPurchase/PaymentHistory';
import SelectCard from './card/cardPurchase/SelectCard';
import Group from './card/Group';
import DefineRelationship from './contact/DefineRelationship';
import ScratchCard from './common/ScratchCard';
import GiftCard from './common/GiftCard';

import TelcoPlan from './common/TelcoPlan';
//import SideMenu from './common/SideMenu';

import SideMenu from './home/SideMenu';
import AppRating from './home/AppRating';
import Plans from './card/Plans';
import Choices from './card/Select';
import Inputs from './card/Inputs';
import PlanDetails from './card/CardSummary/PlanDetails';
import SelectedAttributes from './card/CardSummary/SelectedAttributes';
import SharedInfo from './card/CardSummary/SharedInfo';
import Order from './card/CardSummary/Order';
import WriteReview from './card/CardSummary/WriteReview';
import Details from './card/CardSummary/Details';
// settings module
import Settings from './settings/Settings';
import SpFollowers from './card/spUserProfile/spFollowers';
import EditProfile from './settings/profile/EditProfile';
import Interests from './settings/profile/Interests';
import Addresses from './settings/address/Addresses';
import HomeAddresses from './settings/address/HomeAddresses';
import BillingAddresses from './settings/address/BillingAddresses';
import ShippingAddresses from './settings/address/ShippingAddresses';
import AddAddress from './settings/address/AddAddress';
import UpdateAddresses from './settings/address/UpdateAddresses';
import MobileConnections from './settings/connection/MobileConnections';
import NetworkSettings from './settings/connection/NetworkSettings';
import OtherSettings from './settings/connection/OtherSettings';
import BillingSettings from './settings/billing/BillingSettings';
import CreditCard from './settings/billing/CreditCard';
import AddCreditCard from './settings/billing/AddCreditCard';
import ChangePassword from './settings/ChangePassword';
import NotificationSettings from './settings/notification/NotificationSettings';
// import Wallet from './settings/billing/Wallet';
// import AddWallet from './settings/billing/AddWallet';
import TermsOfServices from './termsOfServices/TermsOfServices';
// services
import MyServices from './services/MyServices';

import Notifications from './notifications/Notifications';

import PaymentOptions from './card/cardPurchase/PaymentOptions';
import PaymentOptionsWithAmount from './common/PaymentOptionsWithAmount';
import TelcoMainCard2 from './common/TelcoMainCard2';

import SPCardConfirmation from './common/SPCardConfirmation';
import CustomPinConfirmation from './common/CustomPinConfirmation';
import PrepaidPostpaidMobilewallet from './common/PrepaidPostpaidMobilewallet';
import TelcoAddons from './common/TelcoAddons';
import ChooseIOTType from './common/ChooseIOTType';
import EnterIOTNumber from './common/EnterIOTNumber';
import EnterIOTDevice from './common/EnterIOTDevice';
import IOTSuccess from './common/IOTSuccess';

import TopUpConfirmation from './common/TopUpConfirmation';

import SearchScreen from './search/SearchScreen';

import HelpScreen from './help/HelpScreen';
import HelpQA from './help/HelpQA';

import ContactsList from './contact/ContactsList';
import FriendsRequests from './contact/FriendsRequests';
import FriendsInvite from './contact/FriendsInvite';
import FriendsAdd from './contact/FriendsAdd';

import Chat from './chat/Chat';
import ChatRecentMessages from './chat/ChatRecentMessages';
import ChatFriendsList from './chat/ChatFriendsList';
import ShareACardInChat from './chat/ShareACardInChat';
import GetSupport from './chat/GetSupport';
import OtherUser from './user/OtherUser';


var logged = false;
var _navigator;

let routes = (route, navigator, data) => {

	let currentRoute = navigator.getCurrentRoutes();
  console.log ('routes.js -- Route History Is:', JSON.stringify(currentRoute));

  _navigator = navigator;
  _route = route;

  if (logged) { route.id = 5; }

	switch (route.id) {
    case 1: {
      return <Splash navigator = {navigator}/>;
		}
    case 2: {
      return <LoginScreen navigator = {navigator}/>;
		}
    case 3: {
      return <LoginCredentials navigator = {navigator}/>;
		}
    case 4: {
      return <TOS navigator = {navigator} {...route.props}/>;
		}
		case 5: {
      return <WelcomeBack navigator = {navigator}/>;
		}
    case 5.5: {
      return <Forgotpassword navigator = {navigator}/>;
    }
    case 6: {
      return <Home
								{...route}
								navigator = {navigator}
								unreadCount={data.unreadCount}
								contactsCount={data.contactsCount}
								disconnectSocket={data.disconnectSocket} />;
		}
		case 7: {
      return <MCWebView navigator = {navigator}/>;
		}
		case 8: {
      return <AddNewLine navigator = {navigator}/>;
		}
		case 9: {
		return <Details navigator = {navigator} {...route}/>;
		}

		case 10.1: {
		return <PlanDetails navigator = {navigator} {...route}/>;
		}
		case 10.2: {
			return <Order navigator = {navigator} {...route}/>;
		}
		case 10.3: {
			return <WriteReview navigator = {navigator} {...route}/>;
		}
		case 10.6: {
			return <PaymentHistory navigator = {navigator} {...route.props}/>;
		}

		case 10.4: {
			return <Group navigator = {navigator} {...route.props}/>;
		}
		case 10.7: {
			return <SelectCard navigator = {navigator} {...route.props}/>;
		}
		case 10.13: {
			return <ChooseMembers navigator = {navigator} {...route}/>;
		}

		case 11: {
			return <Reviews navigator = {navigator} {...route}/>;
		}
		case 12: {
			return <SpCardSummary navigator = {navigator} {...route}/>;
		}
		case 13: {
			return <TelcoPlan navigator = {navigator} {...route.props}/>;
		}
    case 14: {
      return <SendByEmail navigator = {navigator} {...route.props}/>;
    }
		case 15: {
      return <SpUser navigator = {navigator} {...route}/>;
		}
    case 16: {
      return <Plans navigator = {navigator} {...route}/>;
    }
    case 17: {
      return <Choices navigator = {navigator} {...route}/>;
    }
    case 18: {
      return <Inputs navigator = {navigator} {...route}/>;
    }
    case 19: {
      return <GroupOrderCard navigator = {navigator} {...route}/>;
    }
    case 20: {
      return <SelectedUsers navigator = {navigator} {...route}/>;
    }
    case 21: {
      return <TermsOfServices navigator = {navigator} {...route}/>;
    }
    case 22: {
      return <AppRating navigator = {navigator} {...route}/>;
    }
    case 23: {
       return <SpFollowers navigator = {navigator} {...route}/>;
     }
    case 40: {
      return <SpDetailedCard navigator = {navigator} {...route}/>;
    }
    //	case 41: {
    //	return <SpCardSummary navigator = {navigator} {...route.props}/>;
    //}
    case 47: {
      return <TopUpConfirmation navigator = {navigator} {...route.props}/>;
    }

    case 58: {
      return <SearchScreen navigator={navigator} {...route}/>;
    }
    case 66: {
      return <ChooseIOTType navigator={navigator} {...route}/>;
    }
    case 67: {
      return <EnterIOTNumber navigator = {navigator} {...route.props}/>;
    }
    case 68: {
      return <EnterIOTDevice navigator = {navigator} {...route.props}/>;
    }
    case 69: {
      return <IOTSuccess navigator = {navigator} {...route.props}/>;
    }
		case 70: {
			return <ScratchCard navigator = {navigator} {...route.props}/>;
		}
		case 80: {
			return <GiftCard navigator = {navigator} {...route.props}/>;
		}
		case 90: {
			return <NetworkSettings navigator = {navigator}/>;
		}
		case 91: {
			return <OtherSettings navigator = {navigator}/>;
		}
		case 100: {
			return <SideMenu navigator = {navigator} {...route}/>;
		}
		case 101: {
			return <Settings navigator = {navigator}/>;
		}
		case 102: {
			return <EditProfile navigator = {navigator} {...route} />;
		}
		case 103: {
			return <Addresses navigator = {navigator} {...route}/>;
		}
    case 104: {
      return <BillingSettings navigator = {navigator} {...route}/>;
    }
    case 105: {
      return <MobileConnections navigator = {navigator}/>;
    }
    case 106: {
      return <SelectedAttributes navigator = {navigator} {...route}/>;
    }
    case 107: {
      return <SharedInfo navigator = {navigator} {...route}/>;
    }
    case 110: {
      return <PaymentOptions navigator = {navigator} {...route}/>;
    }
    case 111: {
      return <PaymentOptionsWithAmount navigator = {navigator} {...route.props}/>;
    }
    // case 500: {
    // 	return <NavBar navigator = {navigator} {...route.props}/>;
    // }
    case 120: {
      return <Notifications navigator = {navigator} {...route.props}/>;
    }
    case 125: {
      return <MyServices navigator = {navigator} {...route}/>;
    }
		case 131: {
			return <AddAddress navigator={navigator} {...route} />;
		}
    case 138: {
      return <Interests navigator = {navigator} {...route} />;
    }
		case 140: {
			return <HomeAddresses navigator={navigator} {...route} />;
		}
		case 150: {
			return <BillingAddresses navigator={navigator} {...route} />;
		}
		case 160: {
			return <ShippingAddresses navigator={navigator} {...route} />;
		}
		case 170: {
			return <UpdateAddresses navigator={navigator} {...route} />;
		}
		case 180: {
			return <CreditCard navigator = {navigator} {...route}/>;
		}
		case 190: {
			return <AddCreditCard navigator = {navigator} {...route}/>;
		}
    case 200: {
      return <ContactsList navigator = {navigator} {...route.props}/>;
    }
    case 205: {
      return <DefineRelationship navigator = {navigator} {...route}/>;
    }
    case 210: {
      return <FriendsRequests navigator = {navigator} {...route.props}/>;
    }
    case 220: {
      return <FriendsInvite navigator = {navigator} {...route}/>;
    }
    case 230: {
      return <FriendsAdd navigator = {navigator} {...route.props}/>;
    }
    case 240: {
      return <ChatRecentMessages
				navigator = {navigator}
				chatSource={data.chatSource}
				unreadCount={data.unreadCount}
        {...route.props} />;
    }
    case 250: {
      return <ChatFriendsList
				navigator = {navigator}
				unreadCount={data.unreadCount}
        {...route.props} />;
    }
    case 260: {
      return <Chat
				navigator = {navigator}
				updateMessages={data.updateMessages}
				messages={data.messageSource}
        {...route} />;
    }
    case 270: {
      return <HelpScreen navigator={navigator} {...route} />;
    }
    case 280: {
      return <HelpQA navigator={navigator} {...route} />;
    }
    case 290: {
      return <ChangePassword navigator={navigator} {...route} />;
    }
    case 300: {
      return <NotificationSettings navigator={navigator} {...route} />;
    }
    case 310: {
      return <OtherUser navigator={navigator} {...route} />;
    }
    case 320: {
      return <ShareACardInChat
				navigator={navigator}
				unreadCount={data.unreadCount}
        {...route} />;
    }
    case 321: {
      return <GetSupport
        navigator = {navigator}
        updateMessages={data.updateMessages}
        messages={data.messageSource}
        {...route} />;
    }
    case 999: {
      return <CustomPinConfirmation navigator = {navigator} {...route.props}/>;
    }
    case 1000: {
      return <SPCardConfirmation navigator = {navigator} {...route.props}/>;
    }
    case 1002: {
      return <PrepaidPostpaidMobilewallet navigator = {navigator} {...route.props}/>;
    }
    case 1010: {
      return <TelcoAddons navigator = {navigator} {...route.props}/>;
    }
    case 1111: {
      return <Intro navigator = {navigator} {...route.props}/>;
    }
    case 1254: {
      return <TermsAndConditions navigator = {navigator} {...route.props}/>;
    }
		case 1300: {
			return <TelcoMainCard2 navigator = {navigator}/>;
		}
		// case 135: {
		// 	return <Wallet navigator = {navigator}/>;
		// }
		// case 136: {
		// 	return <AddWallet navigator = {navigator}/>;
		// }


	}
}

module.exports = routes;

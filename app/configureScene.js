import React, {
	Component,
} from 'react';

import {
	Navigator,
} from 'react-native';

let configureScene = (route) => {
  switch (route.id) {
    case 40: {
    return { ...Navigator.SceneConfigs.FloatFromBottom, gestures: false }
    }
    case 58: {
      return { ...Navigator.SceneConfigs.FloatFromLeft, gestures: false }
    }
    case 100: {
      return { ...Navigator.SceneConfigs.FloatFromRight, gestures: false }
    }
    case 101: {
      return { ...Navigator.SceneConfigs.FloatFromRight, gestures: false }
    }
    default: {
      // return { ...Navigator.SceneConfigs.HorizontalSwipeJump, gestures: false }
			return { ...Navigator.SceneConfigs.FloatFromBottomAndroid, gestures: false }
    }
  }
}

export default configureScene;

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Tabs from './navigations/TabNavigator';
import {
  Menu,
  Login,
  OTPScreen,
  PersonalDetail,
  EditProfile,
  SingleOrderHistory,
  PaymentStatus,
  Cart,
} from './screens';
import MainLoader from './loaders/MainLoader';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {startAsync, getCartLen, setCartInitial} from './helpers/appHelpers';

import messaging from '@react-native-firebase/messaging';
const AuthContext = React.createContext();
const CartContext = React.createContext();
const CartStateContext = React.createContext();
const Stack = createStackNavigator();

function App() {
  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    cart: [],
    cartLength: 0,
  };

  const reducer = (prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'RESET_TOKEN':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };
      case 'SET_CART':
        return {
          ...prevState,
          cart: action.cart,
        };
      case 'SET_CART_LENGTH':
        return {
          ...prevState,
          cartLength: action.lnth,
        };
      case 'EMPTY_CART':
        return {
          ...prevState,
          cart: [],
        };
    }
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({type: 'SIGN_IN', token: data.token});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      refreshToken: async data => {
        dispatch({type: 'RESTORE_TOKEN', token: 'newtoken'});
      },
      resetToken: async data => {
        dispatch({type: 'RESET_TOKEN'});
      },
    }),
    [],
  );
  const cartContext = React.useMemo(
    () => ({
      emptyCart: async data => {
        dispatch({type: 'EMPTY_CART'});
      },
      emptyCartLength: async data => {
        dispatch({type: 'SET_CART_LENGTH', lnth: data});
      },

      setCartLength: async data => {
        let userToken;
        userToken = await AsyncStorage.getItem('token');
        axios
          .get('http://143.110.244.110/tija/frontuser/viewcart', {
            headers: {Authorization: `Bearer ${userToken}`},
          })

          .then(res => {
            // dispatch({type: 'SET_CART', cart: res.data.data});
            dispatch({type: 'SET_CART_LENGTH', lnth: res.data.data.length});
          });
      },
      getCart: async data => {
        let userToken;
        userToken = await AsyncStorage.getItem('token');
        try {
          axios
            .get('http://143.110.244.110/tija/frontuser/viewcart', {
              headers: {Authorization: `Bearer ${userToken}`},
            })
            .then(res => {
              dispatch({type: 'SET_CART', cart: res.data});
            });
        } catch (err) {
          if (err.response.status == 401) {
            dispatch({type: 'RESET_TOKEN'});
          }
        }
      },
    }),
    [],
  );

  useEffect(() => {
    startAsync(dispatch);
  }, []);
  useEffect(() => {
    if (state.userToken) {
      getCartLen(dispatch);
    }
  }, [state.userToken]);
  useEffect(() => {
    if (state.userToken) {
      setCartInitial(dispatch);
    }
  }, [state.userToken]);
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      alert(remoteMessage.notification.body);
      console.log(remoteMessage.notification.body);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(async app_id => {
        let fcmtoken;
        fcmtoken = await AsyncStorage.setItem('app_id', app_id);
      })
      .catch(e => {
        alert(e);
      });

    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }

    // Listen to whether the token changes
    return messaging().onTokenRefresh(async app_id => {
      let fcmtoken;
      fcmtoken = await AsyncStorage.setItem('app_id', app_id);
    });
  }, []);

  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
      });
  }, []);

  if (state.isLoading == true) {
    return <MainLoader />;
  } else {
    return (
      <NavigationContainer>
        <AuthContext.Provider value={authContext}>
          <CartContext.Provider value={cartContext}>
            <CartStateContext.Provider value={{state}}>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                {state.userToken == null ? (
                  <>
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Otp" component={OTPScreen} />
                    <Stack.Screen
                      name="PersonalDetail"
                      component={PersonalDetail}
                    />
                  </>
                ) : (
                  <>
                    <Stack.Screen name="Home" component={Tabs} />
                    <Stack.Screen name="Menu" component={Menu} />

                    <Stack.Screen name="Cart" component={Cart} />
                    <Stack.Screen name="EditProfile" component={EditProfile} />
                    <Stack.Screen
                      name="SingleOrderHistory"
                      component={SingleOrderHistory}
                    />
                    <Stack.Screen
                      name="PaymentStatus"
                      component={PaymentStatus}
                    />
                  </>
                )}
              </Stack.Navigator>
            </CartStateContext.Provider>
          </CartContext.Provider>
        </AuthContext.Provider>
      </NavigationContainer>
    );
  }
}
export {App as default, AuthContext, CartContext, CartStateContext};

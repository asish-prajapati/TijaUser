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
} from './screens';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Cart from './screens/Cart';
import {startAsync, getCartLen, setCartInitial} from './helpers/appHelpers';
import MainLoader from './loaders/MainLoader';

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
      case 'EMPTY_CART':
        return {
          ...prevState,
          cart: [],
        };
      case 'UPDATE_CART':
        return {
          ...prevState,
          cart: action.cart,
        };
      case 'SET_CART_LENGTH':
        return {
          ...prevState,
          cartLength: action.lnth,
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
    }),
    [],
  );
  const cartContext = React.useMemo(
    () => ({
      addCart: async data => {
        dispatch({type: 'SET_CART', cart: data.cart});
      },

      emptyCart: async data => {
        dispatch({type: 'EMPTY_CART', cart: []});
      },
      updateCart: async data => {
        dispatch({type: 'UPDATE_CART', cart: data.cart});
      },
      setCartLength: data => {
        dispatch({type: 'SET_CART_LENGTH', lnth: data});
      },
      getCart: async data => {
        let userToken;
        userToken = await AsyncStorage.getItem('token');
        axios
          .get('http://143.110.244.110/tija/frontuser/viewcart', {
            headers: {Authorization: `Bearer ${userToken}`},
          })
          .then(res => {
            dispatch({type: 'SET_CART', cart: res.data});
          });
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
  }, [state.cart, state.userToken]);
  useEffect(() => {
    if (state.userToken) {
      setCartInitial(dispatch);
    }
  }, [state.userToken]);

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

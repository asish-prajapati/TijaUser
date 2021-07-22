import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const startAsync = async dispatch => {
  let userToken;

  try {
    userToken = await AsyncStorage.getItem('token');
  } catch (e) {
    alert('restoring token failed');
  }
  if (userToken !== null) {
    dispatch({type: 'RESTORE_TOKEN', token: userToken});
  } else {
    dispatch({type: 'RESTORE_TOKEN', token: null});
  }
};

const getCartLen = async dispatch => {
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
};

const setCartInitial = async dispatch => {
  let userToken;
  userToken = await AsyncStorage.getItem('token');
  axios
    .get('http://143.110.244.110/tija/frontuser/viewcart', {
      headers: {Authorization: `Bearer ${userToken}`},
    })

    .then(res => {
      dispatch({type: 'SET_CART', cart: res.data});
    });
};

export {startAsync, getCartLen, setCartInitial};

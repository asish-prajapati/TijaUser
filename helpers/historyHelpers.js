import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getOrders = async () => {
  let userToken;
  userToken = await AsyncStorage.getItem('token');
  try {
    let response = await axios.get(
      'http://143.110.244.110/tija/frontuser/orderhistory',
      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;

    return response;
  } catch {
    err => alert('orderhistoryerror-something went wrong', err);
  }
};

export {getOrders};

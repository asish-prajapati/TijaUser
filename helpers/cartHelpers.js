import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import RNPgReactNativeSDK from 'react-native-pg-react-native-sdk';

const env = 'TEST';
const QuantityUpdate = async (type, product_id) => {
  let userToken;
  userToken = await AsyncStorage.getItem('token');
  let res = await axios.post(
    'http://143.110.244.110/tija/frontuser/incrementdecrement',
    {type: type, product_id: product_id},
    {headers: {Authorization: `Bearer ${userToken}`}},
  );
  return res.data.success;
};

async function _startProcess(amount) {
  let orderId;
  let orderAmount = amount;
  const apiKey = '837926cca92f4991890af0d3e29738'; // put your apiKey here
  const apiSecret = '3335727db3e6d8bb263b7376e1bc947f462d1297'; // put your apiSecret here

  const env = 'TEST'; // use "TEST" or "PROD"
  var tokenUrl;
  if (env === 'TEST') {
    tokenUrl = 'https://test.cashfree.com/api/v2/cftoken/order'; //for TEST
  } else {
    tokenUrl = 'https://api.cashfree.com/api/v2/cftoken/order'; //for PROD
  }
  let userToken = await AsyncStorage.getItem('token');
  let response = await axios.post(
    'http://143.110.244.110/tija/frontuser/requestaddcash',
    {amount: orderAmount},
    {headers: {Authorization: `Bearer ${userToken}`}},
  );
  response = response.data;
  if (response.success == true) {
    orderId = response.orderId;
    let orderApiMap = {
      orderId: orderId,
      orderAmount: orderAmount.toString(),
      orderCurrency: 'INR',
    };

    const postParams = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': apiKey,
        'x-client-secret': apiSecret,
      },
      body: JSON.stringify(orderApiMap),
    };

    var cfToken;
    try {
      let response = await fetch(tokenUrl, postParams);
      response = await response.json();
      cfToken = response.cftoken;
      return {cfToken: cfToken, orderId: orderId, orderAmount: orderAmount};
    } catch (error) {
      console.log(error);
    }

    // var responseHandler = async result => {
    //   try {
    //     result = JSON.parse(result);
    //     // console.log(result);
    //     return result;
    //     // let userToken = await AsyncStorage.getItem('token');
    //     // axios
    //     //   .post('http://143.110.244.110/tija/frontuser/webhook_detail', result)
    //     //   .then(res => console.log(res));
    //     // if (result.txStatus == 'SUCCESS') {
    //     //   alert(result.txMsg);
    //     //   navigation.navigate('History');
    //     // } else {
    //     //   alert(result.txMsg);
    //     //   navigation.navigate('History');
    //     // }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
  } else {
    alert('Something went wrong - Amount Error');
  }
}
function startPayment(cfToken, orderId, orderAmount) {
  var map = {
    orderId: orderId,
    orderAmount: orderAmount.toString(),
    appId: apiKey,
    tokenData: cfToken,
    orderCurrency: 'INR',
    orderNote: 'Test Note',
    notifyUrl: 'http://143.110.244.110/tija/frontuser/webhook_detail',
    customerName: 'Cashfree User',
    verifyExpiry: '100',
    customerPhone: '9999999999',
    customerEmail: 'cashfree@cashfree.com',
  };

  // RNPgReactNativeSDK.startPaymentUPI(map, env, responseHandler);

  RNPgReactNativeSDK.startPaymentWEB(map, env, responseHandler);
}

const clearCartHandler = async (getCart, setSpinner) => {
  let userToken;
  setSpinner(true);
  userToken = await AsyncStorage.getItem('token');
  axios
    .get('http://143.110.244.110/tija/frontuser/clearcart', {
      headers: {Authorization: `Bearer ${userToken}`},
    })

    .then(res => {
      alert(res.data.message);
      getCart();
      setSpinner(false);
    });
};

export {QuantityUpdate, _startProcess, clearCartHandler};

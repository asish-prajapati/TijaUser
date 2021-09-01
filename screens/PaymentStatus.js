import React, {useContext} from 'react';
import {
  View,
  Text,
  Button,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {CartContext} from '../App';
import {CartStateContext} from '../App';
import confirmLogo from '../assets/images/confirmLogo.png';
export default function PaymentStatus({navigation, route}) {
  const {txStatus, paymentMode, orderAmount} = route.params;

  const {emptyCart, emptyCartLength} = useContext(CartContext);
  const {state} = useContext(CartStateContext);
  return (
    <>
      <StatusBar />
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{height: '40%', padding: '10%'}}>
          <Image
            source={confirmLogo}
            resizeMode="cover"
            style={{height: 160, width: 160}}
          />
        </View>
        <View style={{height: '40%'}}>
          <Text
            style={{
              color: txStatus === 'SUCCESS' ? 'green' : 'red',
              fontFamily: 'Montserrat-SemiBold',

              fontSize: 18,
            }}>
            {txStatus === 'SUCCESS'
              ? 'Order Placed'
              : 'Oopsss ! Please Try Again'}
          </Text>
          <Text
            style={{
              color: 'black',
            }}>
            Payment Status : {txStatus}
          </Text>
          <Text style={{color: 'black'}}>Payment Mode : {paymentMode}</Text>
          <Text style={{color: 'black'}}>Order Amount : {orderAmount}</Text>
        </View>
        <TouchableOpacity
          style={{
            paddingVertical: 15,
            backgroundColor: '#cb202d',
            width: '70%',
            marginBottom: 50,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={() => {
            if (txStatus == 'SUCCESS') {
              emptyCartLength(0);
              emptyCart();

              navigation.navigate('Home');
            } else {
              navigation.navigate('Home');
            }
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-Light',

              fontSize: 18,
            }}>
            Go to Home
          </Text>
        </TouchableOpacity>
        {/* <Button
          title="Go to Home"
          onPress={() => {
            if (txStatus == 'SUCCESS') {
              emptyCartLength(0);
              emptyCart();

              navigation.navigate('Home');
            } else {
              navigation.navigate('Home');
            }
          }}></Button> */}
      </View>
    </>
  );
}

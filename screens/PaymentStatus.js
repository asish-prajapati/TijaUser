import React, {useContext} from 'react';
import {View, Text, Button, StatusBar} from 'react-native';
import {CartContext} from '../App';
import {CartStateContext} from '../App';

export default function PaymentStatus({navigation, route}) {
  const {txStatus, paymentMode, orderAmount} = route.params;

  const {emptyCart, emptyCartLength} = useContext(CartContext);
  const {state} = useContext(CartStateContext);
  return (
    <>
      <StatusBar />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button
          title="Go to Home"
          onPress={() => {
            if (txStatus == 'SUCCESS') {
              emptyCartLength(0);
              emptyCart();

              navigation.navigate('Home');
            } else {
              navigation.navigate('Home');
            }
          }}></Button>
        <Text style={{color: 'green'}}>{txStatus}</Text>
        <Text style={{color: 'black'}}>Status : {txStatus}</Text>
        <Text style={{color: 'black'}}>Payment Mode : {paymentMode}</Text>
        <Text style={{color: 'black'}}>Order Amount : {orderAmount}</Text>
      </View>
    </>
  );
}

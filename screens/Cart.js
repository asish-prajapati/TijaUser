import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import axios from 'axios';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {CartStateContext, CartContext} from '../App';
import Icon from 'react-native-vector-icons/Entypo';
import IconArrow from 'react-native-vector-icons/MaterialIcons';
import IconCart from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import AwesomeAlert from 'react-native-awesome-alerts';
import RNPgReactNativeSDK from 'react-native-pg-react-native-sdk';
import {
  QuantityUpdate,
  _startProcess,
  clearCartHandler,
} from '../helpers/cartHelpers';

export default function Cart({navigation}) {
  const {state} = useContext(CartStateContext);
  const [spinner, setSpinner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setAlert] = useState(false);
  const {getCart, setCartLength} = useContext(CartContext);

  const handleQuantityUpdate = async (type, id) => {
    setSpinner(true);
    const res = await QuantityUpdate(type, id);
    if (res == true) {
      await getCart();
      await setCartLength();
      setSpinner(false);
    } else {
      setSpinner(false);
      alert('something went wrong');
    }
  };
  const handleProceed = async mode => {
    const env = 'TEST';
    let res = await _startProcess(state.cart.total_amount);

    var map = {
      orderId: res.orderId,
      orderAmount: res.orderAmount.toString(),
      appId: '837926cca92f4991890af0d3e29738',
      tokenData: res.cfToken,
      orderCurrency: 'INR',
      orderNote: 'Test Note',
      notifyUrl: 'http://143.110.244.110/tija/frontuser/webhook_detail',
      customerName: res.customerName,
      verifyExpiry: '100',
      customerPhone: res.customerPhone.toString(),
      customerEmail: res.customerEmail,
    };
    console.log(map);
    if (mode == 'UPI') {
      RNPgReactNativeSDK.startPaymentUPI(map, env, responseHandler);
    }
    if (mode == 'WEB') {
      RNPgReactNativeSDK.startPaymentWEB(map, env, responseHandler);
    }
  };
  var responseHandler = async result => {
    try {
      result = JSON.parse(result);
      console.log(result);
      navigation.navigate('PaymentStatus', result);
    } catch (error) {
      await console.log(error);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCart();
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.container}>
        <Spinner
          visible={spinner}
          textContent={'Updating Cart...'}
          textStyle={styles.spinnerTextStyle}
        />
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="AwesomeAlert"
          message="I have a message for you!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Payment Mode</Text>
              <View style={{flexDirection: 'row'}}>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    handleProceed('UPI');
                  }}>
                  <Text style={styles.textStyle}>UPI</Text>
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    handleProceed('WEB');
                  }}>
                  <Text style={styles.textStyle}>Other Options</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <IconArrow
                name="arrow-back"
                size={25}
                style={{paddingLeft: 10}}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Cart</Text>
          </View>

          {state.cartLength ? (
            <View style={styles.cartIcon}>
              <IconCart
                name="cart-remove"
                size={30}
                onPress={() => {
                  clearCartHandler(getCart, setSpinner);
                }}
              />
            </View>
          ) : null}
        </View>
        {state.cartLength ? (
          <ScrollView>
            {state.cart.data &&
              state.cart.data.map(item => {
                return (
                  <View style={cardStyle.card} key={item.product_id}>
                    <View style={cardStyle.cardWrapper}>
                      <Text style={cardStyle.title}>{item.name}</Text>
                      <Image
                        source={{uri: item.image}}
                        style={cardStyle.image}
                      />
                    </View>
                    <View style={cardStyle.cardRight}>
                      <View style={cardStyle.quantityWrapper}>
                        <TouchableOpacity style={cardStyle.minus}>
                          <Icon
                            name="minus"
                            size={20}
                            style={{color: 'coral'}}
                            onPress={() => {
                              handleQuantityUpdate('MINUS', item.product_id);
                            }}
                          />
                        </TouchableOpacity>
                        <View style={cardStyle.quantity}>
                          <Text style={cardStyle.quantityText}>
                            {item.order_quantity}
                          </Text>
                        </View>
                        <TouchableOpacity style={cardStyle.plus}>
                          <Icon
                            name="plus"
                            size={20}
                            style={{color: 'coral'}}
                            onPress={() => {
                              handleQuantityUpdate('ADD', item.product_id);
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={cardStyle.price}>
                        <IconFA
                          name="rupee"
                          size={20}
                          style={{paddingRight: 5}}
                        />
                        <Text style={cardStyle.priceText}>{item.price}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <IconCart name="cart-remove" size={100} color="grey" />
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 22,
                color: 'grey',
              }}>
              Add Something to Cart
            </Text>
          </View>
        )}
        {state.cartLength ? (
          <>
            <View style={styles.total}>
              <Text style={styles.totalText}>Order Total</Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconFA name="rupee" size={16} style={{paddingRight: 5}} />
                <Text style={styles.totalAmount}>
                  {state.cart.total_amount}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={styles.proceed}>
              <Text style={styles.proceedText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    paddingTop: 5,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    height: 60,
    elevation: 3,
    alignItems: 'center',
    paddingBottom: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 100,
    backgroundColor: '#FBF0EE',

    elevation: 4,
    marginBottom: 5,
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 22,
    paddingLeft: 22,
  },
  cartIcon: {
    justifyContent: 'center',
    paddingRight: 15,
    alignItems: 'center',
  },
  total: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#d3d3d3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  totalText: {fontFamily: 'Montserrat-Bold', fontSize: 16},
  totalAmount: {fontFamily: 'Montserrat-Bold', fontSize: 16},
  proceed: {
    width: '70%',
    alignSelf: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'coral',
    paddingVertical: 10,
    borderRadius: 6,
    elevation: 4,
  },
  proceedText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 20,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: 120,
    marginHorizontal: 5,
    backgroundColor: 'coral',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
  },
});

const cardStyle = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 100,
    backgroundColor: '#FBF0EE',

    elevation: 4,
    marginBottom: 5,
  },
  cardWrapper: {
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  title: {fontFamily: 'Montserrat-SemiBold', fontSize: 15},
  image: {
    width: 50,
    height: 50,
    borderRadius: 7,
    borderColor: '#BEBEBE',
    borderWidth: 1,
  },
  cardRight: {
    justifyContent: 'space-between',
    paddingVertical: 18,
    alignItems: 'center',
  },
  quantityWrapper: {
    width: 70,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0.5,
    borderColor: 'coral',
    alignItems: 'center',
  },
  minus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  quantityText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
  },
  plus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {flexDirection: 'row', alignItems: 'center'},
  priceText: {fontFamily: 'Montserrat-SemiBold', fontSize: 20},
});

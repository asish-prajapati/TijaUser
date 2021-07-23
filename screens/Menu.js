import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {BarIndicator} from 'react-native-indicators';
import IconCart from 'react-native-vector-icons/Feather';
import IconBadge from 'react-native-icon-badge';
import IconFA from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Entypo';
import {CartStateContext} from '../App';
import {CartContext} from '../App';
import {QuantityUpdate} from '../helpers/cartHelpers';
import IconBack from 'react-native-vector-icons/AntDesign';

import {icons, images, SIZES, COLORS, FONTS} from '../constants';
import {getMenu, addToCart} from '../helpers/menuHelpers';

export default function Menu({route, navigation}) {
  const [branchDetail, setBranchDetail] = React.useState(null);
  const [categories, setCategories] = React.useState(null);
  const [products, setProducts] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const {branch} = route.params;
  const {state} = useContext(CartStateContext);
  const [spinner, setSpinner] = useState(false);
  const {getCart, setCartLength} = useContext(CartContext);

  const onSelectCategory = id => {
    //filter restaurants
    let filteredDetail = branchDetail.filter(b => b.id == id);
    setProducts(filteredDetail[0].product);
    setSelectedCategory(id);
  };

  const addToCartHandler = async id => {
    setSpinner(true);
    let res = await addToCart(id);

    if (res.success == true) {
      await getCart();
      await setCartLength();
      setSpinner(false);
    } else {
      alert('Items of Another Branch already in Cart. Clear Cart First .');
      setSpinner(false);
    }
  };
  const handleQuantityUpdate = async (type, id) => {
    setSpinner(true);
    const res = await QuantityUpdate(type, id);
    await console.log(res);

    if (res == true) {
      await getCart();
      await setCartLength();
      setSpinner(false);
    } else {
      setSpinner(false);
      alert('something went wrong');
    }
  };
  // useEffect(() => {
  //   // const unsubscribe = navigation.addListener('focus', () => {
  //   getCart();
  //   // });
  //   // return unsubscribe;
  // }, []);

  useEffect(() => {
    getMenu(branch.id).then(res => {
      setBranchDetail(res);
    });
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getMenu(branch.id).then(res => {
      setBranchDetail(res);
    });
    setSelectedCategory(null);
    setRefreshing(false);
  }, []);
  useEffect(() => {
    let cats = branchDetail?.map(item => {
      return {id: item.id, image: item.image, name: item.name};
    });
    setCategories(cats);
    if (cats) {
      setSelectedCategory(cats[0].id);
    }
  }, [branchDetail]);
  useEffect(() => {
    let initialProducts = branchDetail?.map(item => {
      return item.product;
    });
    if (initialProducts) {
      setProducts(initialProducts[0]);
    }
  }, [branchDetail]);

  const productExist = id => {
    if (state.cart.data) {
      return state.cart.data.some(function (el) {
        return el.product_id === id;
      });
    }
  };
  const renderCategories = () => {
    return (
      <View style={catStyles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{backgroundColor: 'white'}}>
          {categories?.map(item => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onSelectCategory(item.id);
                }}
                style={{
                  padding: SIZES.padding,
                  paddingBottom: SIZES.padding * 2,
                  backgroundColor:
                    selectedCategory == item.id ? COLORS.primary : 'white',

                  borderRadius: SIZES.radius,
                  alignItems: 'center',
                  borderColor:
                    selectedCategory == item.id
                      ? COLORS.transparent
                      : '#C8C8C8',
                  borderWidth: 1,
                  marginRight: SIZES.padding,
                  ...catStyles.shadow,
                }}>
                <View style={catStyles.catImage}>
                  <Image
                    source={{uri: item.image}}
                    resizeMode="contain"
                    style={{width: 30, height: 30}}
                  />
                </View>
                <Text
                  style={{
                    marginTop: SIZES.padding,
                    color: selectedCategory == item.id ? COLORS.white : 'black',
                    ...FONTS.body5,
                  }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  const GetQuantity = ({id}) => {
    let currentProduct = state.cart.data.filter(item => item.product_id == id);
    return (
      <Text style={foodStyle.btnText}>{currentProduct[0].order_quantity}</Text>
    );
  };

  const renderFoodItems = () => {
    return (
      <ScrollView
        style={{marginBottom: state.cartLength ? 50 : 0}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {products?.map((val, index) => (
          <View style={foodStyle.container} key={index}>
            <View style={foodStyle.leftContainer}>
              <Image source={images.veg} style={foodStyle.vegicon} />
              <Text style={foodStyle.foodTitle}>{val.name}</Text>
              <Text
                style={{
                  color: '#A9A9A9',
                  fontSize: 10,
                  fontFamily: 'Montserrat-Regular',
                }}>
                {val.description}
              </Text>
              <View style={styles.priceTotal}>
                <IconFA name="rupee" size={12} style={styles.rupeeIcon} />
                <Text style={foodStyle.price}>{val.price}</Text>
              </View>

              <View style={foodStyle.bestSeller}>
                <Text style={foodStyle.bestSellerText}>BestSeller</Text>
              </View>
            </View>
            <View style={foodStyle.rightContainer}>
              <Image source={{uri: val.image}} style={foodStyle.image} />
              {productExist(val.id) ? (
                <View style={foodStyle.btn}>
                  <Icon
                    name="minus"
                    size={15}
                    style={{color: 'rgb(255, 241, 243)'}}
                    onPress={() => {
                      handleQuantityUpdate('MINUS', val.id);
                    }}
                  />
                  <GetQuantity id={val.id} />
                  <Icon
                    name="plus"
                    size={15}
                    style={{color: 'rgb(255, 241, 243)'}}
                    onPress={() => {
                      handleQuantityUpdate('ADD', val.id);
                    }}
                  />
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    addToCartHandler(val.id);
                  }}
                  style={foodStyle.btnAfter}>
                  <Text style={foodStyle.btnTextAfter}>ADD+</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  if (!categories) {
    return <BarIndicator color="coral" />;
  } else {
    return (
      <>
        <StatusBar backgroundColor="white" />

        <View style={styles.container}>
          {state.cartLength ? (
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                zIndex: 20,
                width: '100%',
                height: 50,
                backgroundColor: 'coral',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 17,
                  color: 'white',
                }}>
                {state.cartLength} Items in cart
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Cart');
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 15,
                    color: 'white',
                  }}>
                  View
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <Spinner
            visible={spinner}
            textContent={'Updating Cart...'}
            textStyle={styles.spinnerTextStyle}
          />
          {/* <SnackbarC length={cartlength} /> */}
          <View style={styles.header}>
            <IconBack
              name="left"
              size={25}
              onPress={() => navigation.goBack()}
            />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Cart');
              }}
              style={styles.cart}>
              {state.cartLength == 0 ? (
                <IconCart name="shopping-cart" size={30} />
              ) : (
                <IconBadge
                  MainElement={<IconCart name="shopping-cart" size={30} />}
                  BadgeElement={
                    <Text style={styles.badge}>{state.cartLength}</Text>
                  }
                  IconBadgeStyle={{
                    width: 10,
                    height: 15,
                    backgroundColor: 'red',
                  }}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.restroInfo}>
            <View style={styles.infoLeft}>
              <Text style={styles.branchName}>{branch.name}</Text>

              <Text style={styles.branchAddress}>{branch.address}</Text>
            </View>
            <View style={styles.infoRight}>
              <Image source={{uri: branch.image}} style={styles.branchImage} />
              <View style={styles.rating}>
                <Text style={styles.ratingText}>4.5*</Text>
              </View>
            </View>
          </View>
          {renderCategories()}
          {renderFoodItems()}
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingLeft: 10,
    backgroundColor: 'white',
  },
  infoRight: {
    // alignSelf: 'flex-end',
    height: 60,
    width: 80,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    backgroundColor: 'coral',
  },

  rating: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    position: 'absolute',
    backgroundColor: '#097969',
    borderBottomLeftRadius: 7,
    borderTopRightRadius: 7,
    bottom: 0,
  },
  cart: {
    width: 50,
    paddingRight: SIZES.padding * 2,
    justifyContent: 'center',
  },
  badge: {color: '#FFFFFF', fontSize: 10},
  branchName: {
    fontSize: 25,
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 5,
  },
  branchAddress: {
    fontSize: 13,
    fontFamily: 'Montserrat-Regular',
  },
  branchImage: {
    height: 60,
    width: 80,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
    // alignSelf: 'flex-end',
  },
  ratingText: {
    fontFamily: 'Montserrat-Bold',
    color: 'white',
  },
  priceTotal: {
    flexDirection: 'row',

    alignItems: 'center',
  },
  rupeeIcon: {paddingRight: 5, color: 'black'},
});

const catStyles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  catImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
  },
});

const foodStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',

    elevation: 1,
  },
  leftContainer: {
    paddingLeft: 10,
    paddingTop: 15,
  },
  rightContainer: {
    paddingRight: 10,
    marginTop: 15,
    width: 120,
    height: 120,
  },
  vegicon: {
    height: 20,
    width: 20,
    marginBottom: 5,
  },
  foodTitle: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 15,
  },
  price: {
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
  },
  bestSeller: {
    backgroundColor: '#ffdab9',
    borderRadius: 7,
    width: 55,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'coral',
    borderWidth: 0.5,
  },
  bestSellerText: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'coral',
    fontSize: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 7,
    borderColor: '#BEBEBE',
    borderWidth: 1,
  },
  btn: {
    backgroundColor: 'coral',
    width: 60,
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{translateX: -35}, {translateY: 10}],
    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  btnText: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    padding: 5,
    color: 'white',
    fontSize: 15,
  },
  btnAfter: {
    backgroundColor: 'rgb(255, 241, 243)',
    width: 60,
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{translateX: -35}, {translateY: 10}],
    borderRadius: 10,
    borderTopColor: 'coral',
    borderWidth: 1,
    borderBottomColor: 'coral',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  btnTextAfter: {
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    padding: 10,
    color: 'coral',
    fontSize: 10,
  },
});

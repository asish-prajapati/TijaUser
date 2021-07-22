import React, {useEffect, useState, useContext} from 'react';
import IconBadge from 'react-native-icon-badge';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  ScrollView,
  RefreshControl,
} from 'react-native';

import {CartStateContext} from '../App';
import {CartContext} from '../App';
import IconBell from 'react-native-vector-icons/Ionicons';
import IconCart from 'react-native-vector-icons/Feather';
import IconOffer from 'react-native-vector-icons/MaterialIcons';
import {BarIndicator} from 'react-native-indicators';
import {SIZES, COLORS} from '../constants';
import {getBranches} from '../helpers/getBranches';
import IconFA from 'react-native-vector-icons/FontAwesome';
export default function Home({navigation}) {
  const [branches, setBranches] = useState([]);
  const {state} = useContext(CartStateContext);
  const {getCart} = useContext(CartContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getBranches().then(res => setBranches(res));
    setRefreshing(false);
  }, []);
  useEffect(() => {
    getBranches().then(res => setBranches(res));
  }, []);
  useEffect(() => {
    getCart();
  }, []);

  const renderHeader = () => {
    return (
      <View style={headerStyles.container}>
        <TouchableOpacity style={headerStyles.notification}>
          <IconBadge
            MainElement={
              <IconBell name="notifications-sharp" size={30} color="black" />
            }
            BadgeElement={<Text style={headerStyles.badgeElement}>{5}</Text>}
            IconBadgeStyle={headerStyles.bedgeIcon}
          />
        </TouchableOpacity>
        {/* <View style={headerStyles.headerTitleC}>
          <View style={headerStyles.headerTitlec}>
            <Text style={{...FONTS.h3}}>Tija IceCreames</Text>
          </View>
        </View> */}
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Cart');
          }}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          {state.cartLength == 0 ? (
            <IconCart name="shopping-cart" size={30} />
          ) : (
            <IconBadge
              MainElement={<IconCart name="shopping-cart" size={30} />}
              BadgeElement={
                <Text style={headerStyles.badgeElement}>
                  {state.cartLength}
                </Text>
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
    );
  };

  const menuCards = () => {
    if (branches.length == 0) {
      return <BarIndicator color="coral" />;
    } else {
      return (
        <>
          {branches?.map(branch => (
            <TouchableOpacity
              activeOpacity={0.9}
              key={branch.id}
              onPress={() => navigation.navigate('Menu', {branch: branch})}>
              <View style={menuCardsStyle.cardContainer}>
                <View style={menuCardsStyle.cardImage}>
                  <Image
                    source={{
                      uri: branch.image,
                    }}
                    resizeMode="cover"
                    style={menuCardsStyle.branchImage}
                  />
                  <View style={menuCardsStyle.offerContainer}>
                    <View style={menuCardsStyle.offerIcon}>
                      <IconOffer color="#1690df" name="local-offer" size={10} />
                    </View>
                    <Text style={menuCardsStyle.offerText}>20% off</Text>
                  </View>
                </View>
                <View style={menuCardsStyle.cardDetails}>
                  <View style={menuCardsStyle.detailTopSection}>
                    <View>
                      <Text style={menuCardsStyle.branchName}>
                        {branch.name}
                      </Text>
                      <Text style={menuCardsStyle.branchAddress}>
                        {branch.address}
                      </Text>
                    </View>
                    <View>
                      <View style={menuCardsStyle.ratingContainer}>
                        <Text style={menuCardsStyle.ratingText}>4.5 *</Text>
                      </View>
                      <View style={menuCardsStyle.priceC}>
                        <IconFA
                          name="rupee"
                          size={12}
                          style={menuCardsStyle.rupeeIcon}
                        />
                        <Text style={menuCardsStyle.price}>200 for two</Text>
                      </View>
                    </View>
                  </View>
                  <View style={menuCardsStyle.separator}></View>
                  <View style={menuCardsStyle.detailBottomSection}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={menuCardsStyle.trending}>
                        <IconOffer
                          color="#1690df"
                          name="trending-up"
                          size={10}
                        />
                      </View>
                      <Text style={menuCardsStyle.orderPlaced}>
                        350+ orders placed from here recently
                      </Text>
                    </View>
                    <View></View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      );
    }
  };

  return (
    <>
      <StatusBar backgroundColor={COLORS.lightGray4} barStyle="dark-content" />
      <SafeAreaView style={mainStyles.container}>
        {renderHeader()}

        <Text style={mainStyles.restroCountText}>
          {branches?.length} restaurents around you
        </Text>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {menuCards()}
        </ScrollView>
        {/* {renderRestaurentList()} */}
      </SafeAreaView>
    </>
  );
}

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
    paddingHorizontal: 15,
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

  restroCountText: {
    fontFamily: 'ArgentumNovus-SemiBold',
    fontSize: 20,
    marginBottom: 15,
    marginTop: 10,
  },
});

const menuCardsStyle = StyleSheet.create({
  cardContainer: {
    width: '100%',
    marginVertical: 10,
    height: 275,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowOffset: {height: 1, width: 1},
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 0.2,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 175,
  },
  cardDetails: {
    padding: 10,
    height: 100,
    justifyContent: 'space-between',
  },
  detailTopSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailBottomSection: {
    flexDirection: 'row',
  },
  branchImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  offerContainer: {
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: '#1690df',
    position: 'absolute',
    left: 0,
    bottom: 15,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    flexDirection: 'row',
  },
  offerIcon: {
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerText: {
    color: 'white',
    textAlign: 'center',
    marginLeft: 4,
  },
  branchName: {
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 4,
    fontSize: 18,
  },
  branchAddress: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#787878',
    fontSize: 13,
  },
  ratingContainer: {
    padding: 5,
    width: 50,
    alignSelf: 'flex-end',
  },
  ratingText: {
    textAlign: 'center',
    backgroundColor: '#5ed150',
    borderRadius: 5,
    color: 'white',
    fontFamily: 'Roboto-Bold',
  },
  price: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#787878',
    fontSize: 14,
  },
  separator: {
    borderBottomColor: '#ededed',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  trending: {
    backgroundColor: 'white',
    width: 18,
    height: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderPlaced: {
    fontFamily: 'Montserrat-MediumItalic',
    color: '#787878',
    fontSize: 12,
    marginLeft: 8,
  },
  priceC: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeeIcon: {
    paddingRight: 5,
    color: '#787878',
  },
});

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
  },
  notification: {
    width: 50,
    paddingLeft: SIZES.padding * 2,
    justifyContent: 'center',
  },
  badgeElement: {
    color: '#FFFFFF',
    fontSize: 10,
  },
  bedgeIcon: {
    width: 10,
    height: 15,
    backgroundColor: 'red',
  },
  headerTitleC: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitlec: {
    width: '70%',
    height: '100%',
    backgroundColor: COLORS.lightGray3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
  },
});

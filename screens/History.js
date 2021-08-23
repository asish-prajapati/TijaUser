import React, {useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import MainLoader from '../loaders/MainLoader';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {getOrders} from '../helpers/historyHelpers';

export default function History({navigation}) {
  const [orders, setOrders] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    let response = await getOrders();
    setOrders(response.data);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let response = await getOrders();
      setOrders(response.data);
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <StatusBar />
      {loading ? (
        <MainLoader />
      ) : (
        <View style={styles.container}>
          <ScrollView
            style={{flex: 1, marginTop: 20}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            {orders?.length > 0 ? (
              orders.map((order, index) => (
                <TouchableOpacity
                  key={index}
                  style={cardStyle.card}
                  onPress={() => {
                    navigation.navigate('SingleOrderHistory', {
                      products: order,
                    });
                  }}>
                  <View style={cardStyle.cardUpper}>
                    <View style={cardStyle.cuLeft}>
                      <View style={cardStyle.imgWrapper}>
                        <Image
                          source={{uri: order.branchimage}}
                          style={cardStyle.image}
                        />
                      </View>
                      <View style={cardStyle.orderDetail}>
                        <View>
                          <Text style={cardStyle.title}>
                            {order.branchname}
                          </Text>
                          <Text style={cardStyle.subTitle}>
                            Order Id : {order.order_id}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',

                              alignItems: 'center',
                            }}>
                            <Text style={cardStyle.subTitle}>
                              Payment Status :
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                color:
                                  order.payment_status == 'success'
                                    ? 'green'
                                    : 'red',
                              }}>
                              {order.payment_status}
                            </Text>
                          </View>
                        </View>
                        <Text style={cardStyle.subTitle}>
                          Payment Id : {order.payment_id}
                        </Text>
                      </View>
                    </View>
                    <View style={cardStyle.cuRight}>
                      <View style={styles.priceTotal}>
                        <IconFA
                          name="rupee"
                          size={15}
                          style={styles.rupeeIcon}
                        />
                        <Text style={cardStyle.price}>
                          {order.productprice}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={cardStyle.cardBottom}>
                    <View>
                      <Text style={cardStyle.orderOn}>ORDERED ON</Text>
                      <Text style={cardStyle.orderDate}>
                        {order.orderdate} at {order.ordertime}
                      </Text>
                    </View>
                    <View style={cardStyle.delivered}>
                      <Text
                        style={[
                          cardStyle.deliveredText,
                          order.status == 'Cancled' || order.status == 'Pending'
                            ? cardStyle.deliveredTextRed
                            : cardStyle.deliveredTextGreen,
                        ]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',

                  height: 500,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 22,
                    color: 'grey',
                    marginBottom: 50,
                  }}>
                  Nothing in Order History
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Order')}
                  style={{
                    borderColor: 'coral',
                    borderWidth: 0.5,
                    padding: 10,
                    borderRadius: 5,
                    backgroundColor: 'pink',
                    elevation: 4,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: 15,
                      color: 'red',
                    }}>
                    Make Some Orders
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  header: {
    marginBottom: 50,
  },
  content: {
    flex: 1,
  },
  priceTotal: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  rupeeIcon: {paddingRight: 5, color: 'grey'},
});

const cardStyle = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    height: 130,
    borderRadius: 5,
    elevation: 2,
    marginBottom: 5,
  },
  cardUpper: {
    backgroundColor: 'white',
    height: 100,
    width: '100%',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBottom: {
    backgroundColor: '#F5F5F5',
    height: 30,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  cuLeft: {flexDirection: 'row', width: '80%'},

  cuRight: {justifyContent: 'space-evenly', marginRight: 10, width: '20%'},
  imgWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 5,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  orderDetail: {
    paddingLeft: 10,
    justifyContent: 'space-evenly',
    width: '80%',
  },
  title: {fontFamily: 'Montserrat-Bold', fontSize: 15},
  subTitle: {fontFamily: 'Montserrat-Regular', fontSize: 10},
  price: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    textAlign: 'right',
    paddingRight: 10,
  },
  orderOn: {
    fontFamily: 'Montserrat-Regular',
    color: '#A9A9A9',
    fontSize: 10,
  },
  orderDate: {
    fontFamily: 'Montserrat-Bold',
    color: 'black',
    fontSize: 10,
  },
  delivered: {
    borderRadius: 5,
    borderColor: 'black',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  deliveredText: {
    fontFamily: 'Montserrat-Bold',

    fontSize: 12,
    textAlignVertical: 'center',
  },
  deliveredTextCoral: {
    color: 'coral',
  },
  deliveredTextGreen: {
    color: 'green',
  },
  deliveredTextRed: {
    color: 'red',
  },
});

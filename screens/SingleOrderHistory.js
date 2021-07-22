import React from 'react';
import {View, Text, StatusBar, StyleSheet, ScrollView} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
export default function SingleOrderHistory({navigation, route}) {
  const {products} = route.params;

  const RenderProduct = props => {
    const {product} = props;
    return (
      <>
        <Divider style={{marginVertical: 10}} />
        <View>
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.titleDes}>{product.description}</Text>
        </View>
        <View style={styles.priceTab}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.quantityStyle}>
              <Text style={styles.priceText}>{product.order_quantity}</Text>
            </View>
            <IconAnt name="close" size={15} />
            <Text style={styles.priceText}>{product.price}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconFA name="rupee" size={15} style={{paddingRight: 5}} />
            <Text style={styles.priceText}>
              {product.order_quantity * product.price}
            </Text>
          </View>
        </View>
        <Divider style={{marginVertical: 5}} />
      </>
    );
  };
  return (
    <>
      <StatusBar backgroundColor="white" />
      <View style={styles.container}>
        <View style={styles.header}>
          <IconAnt name="left" size={25} onPress={() => navigation.goBack()} />
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.heading}>Order Summary</Text>
          <View style={{marginVertical: 10}}>
            <Text style={styles.title}>{products.branchname}</Text>
            <Text style={styles.titleDes}>
              B-101,Basement,Near National Handloom , Jaipur
            </Text>
          </View>

          <View style={{marginVertical: 10}}>
            <Text style={styles.title}>Your Orders</Text>
            {products.products.map(item => (
              <RenderProduct product={item} key={item.product_id} />
            ))}
          </View>
          <View style={styles.totalWrapper}>
            <Text style={styles.totalText}>Grand Total</Text>
            <View style={styles.priceTotal}>
              <IconFA name="rupee" size={15} style={styles.rupeeIcon} />
              <Text style={styles.priceTotalText}>{products.productprice}</Text>
            </View>
          </View>
          <Divider style={{marginVertical: 10}} />
        </ScrollView>
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  content: {
    marginHorizontal: 15,
  },
  heading: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 25,
    marginVertical: 10,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    marginVertical: 10,
    marginVertical: 5,
  },
  titleDes: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
  },
  productTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 15,
    marginBottom: 5,
  },
  priceTab: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
  },
  priceText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  quantityStyle: {
    padding: 5,
    borderColor: 'coral',
    borderWidth: 0.5,
    borderRadius: 5,
  },
  totalWrapper: {flexDirection: 'row', justifyContent: 'space-between'},
  totalText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: 'grey',
  },
  priceTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rupeeIcon: {paddingRight: 5, color: 'grey'},
  priceTotalText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 18,
    color: 'grey',
  },
});

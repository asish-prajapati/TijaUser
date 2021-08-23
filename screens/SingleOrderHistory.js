import React from 'react';

import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  WebView,
  Linking,
} from 'react-native';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {Divider} from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

export default function SingleOrderHistory({navigation, route}) {
  const {products} = route.params;

  const downloadInvoice = () => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = `http://143.110.244.110/tija/frontuser/downloadinvoice/${products.id}.pdf`;
    const getFileExtention = fileUrl => {
      // To get the file extension
      return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
    };
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, fs} = RNFetchBlob;
    let RootDir = fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: RootDir + '/invoice' + file_ext,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('File Downloaded Successfully.');
      });
  };

  function downloadHistory() {
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let date = new Date();
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        //Related to the Android only
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/Report_Download' +
          Math.floor(date.getTime() + date.getSeconds() / 2),
        description: 'Risk Report Download',
      },
    };
    //downloadinvoice
    config(options)
      .fetch('GET', 'http://143.110.244.110/tija/frontuser/downloadinvoice/18')
      .then(res => {
        //Showing alert after successful downloading
        console.log('res -> ', JSON.stringify(res));
        alert('Report Downloaded Successfully.');
      })
      .catch(e => {
        console.log(e);
      });
  }
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

          {/* <Button title="download invoice" onPress={downloadInvoice} /> */}

          <View style={{marginVertical: 10}}>
            <Text style={styles.title}>{products.branchname}</Text>
            <Text style={styles.titleDes}>
              B-101,Basement,Near National Handloom , Jaipur
            </Text>

            {products.status == 'Delivered' && (
              <TouchableOpacity
                style={{marginTop: 20}}
                onPress={downloadInvoice}
                // onPress={() => {
                //   Linking.openURL(
                //     'http://143.110.244.110/tija/frontuser/downloadinvoice/18',
                //   );
                // }}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{color: 'red'}}>Download Summary</Text>
                  <IconAnt
                    name="download"
                    color="red"
                    style={{marginLeft: 5}}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={{marginVertical: 10}}>
            <Text style={styles.title}>Your Orders</Text>
            {!(products == null) ? (
              products.products.map(item => (
                <RenderProduct product={item} key={item.product_id} />
              ))
            ) : (
              <Text>Error Happned Contact Admin</Text>
            )}
          </View>
          <View style={{marginVertical: 10}}>
            <Text style={styles.title}>Order Details</Text>
            <>
              <Divider style={{marginVertical: 10}} />
              <View>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    marginBottom: 5,
                    color: 'grey',
                  }}>
                  Order Number
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    marginBottom: 5,
                  }}>
                  {products.order_id}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    marginBottom: 5,
                    color: 'grey',
                  }}>
                  Date
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    marginBottom: 5,
                  }}>
                  {`${products.orderdate} at ${products.ordertime} `}
                </Text>
              </View>

              <Divider style={{marginVertical: 5}} />
            </>
          </View>
          <View style={styles.totalWrapper}>
            <Text style={styles.totalText}>Grand Total</Text>
            <View style={styles.priceTotal}>
              <IconFA name="rupee" size={15} style={styles.rupeeIcon} />
              {!(products == null) ? (
                <Text style={styles.priceTotalText}>
                  {products.productprice}
                </Text>
              ) : null}
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

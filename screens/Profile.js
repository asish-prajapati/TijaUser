import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../App';
import {COLORS} from '../constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MainLoader from '../loaders/MainLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProfile} from '../helpers/profileHelpers';

export default function Profile({navigation}) {
  const {signOut} = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [image, setImage] = useState('');
  const singOutHandler = async () => {
    try {
      await AsyncStorage.removeItem('token');
      signOut();
    } catch (e) {
      alert('removing token failed');
    }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      let response = await getProfile();
      setMobile(response.mobile);
      setImage(response.image);
      setName(response.name);
      setEmail(response.email);
      setLoading(false);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <StatusBar backgroundColor="white" />
      {loading ? (
        <MainLoader />
      ) : (
        <View style={styles.container}>
          <View style={styles.profileDetail}>
            <View
              style={{
                justifyContent: 'space-between',
                height: '80%',
              }}>
              <Text style={{fontFamily: 'Montserrat-Bold', fontSize: 20}}>
                {name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  color: 'grey',
                  fontSize: 11,
                }}>
                {mobile}
              </Text>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  color: 'coral',
                  fontSize: 12,
                }}>
                {email}
              </Text>
            </View>

            {image ? (
              <Image
                source={{uri: image}}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
            ) : null}
          </View>

          <View
            style={{
              borderBottomColor: '#ededed',
              borderBottomWidth: 1,
              marginHorizontal: 20,
            }}></View>

          <View style={{marginTop: 20}}>
            <Text
              style={{
                fontFamily: 'Montserrat-Regular',
                color: COLORS.darkgray,
                marginBottom: 10,
              }}>
              FOOD ORDERS
            </Text>
            <View style={{paddingLeft: 20}}>
              <TouchableOpacity
                style={styles.link1}
                onPress={() => {
                  navigation.navigate('History');
                }}>
                <Icon name="local-offer" style={{marginRight: 15}} size={20} />
                <Text style={{fontFamily: 'Montserrat-Regular'}}>
                  Your Orders
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link1}>
                <Icon name="local-offer" style={{marginRight: 15}} size={20} />
                <Text style={{fontFamily: 'Montserrat-Regular'}}>
                  Online Ordering Help
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.link1}>
                <Icon name="local-offer" style={{marginRight: 15}} size={20} />
                <Text style={{fontFamily: 'Montserrat-Regular'}}> About </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <TouchableOpacity
              style={styles.link2}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={{fontFamily: 'Montserrat-SemiBold'}}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link2}>
              <Text style={{fontFamily: 'Montserrat-SemiBold'}}>
                Send FeedBack
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link2}>
              <Text style={{fontFamily: 'Montserrat-SemiBold'}}>
                Report a Safety Emergency
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link2}>
              <Text style={{fontFamily: 'Montserrat-SemiBold'}}>
                Rate us on Play Store
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link2} onPress={singOutHandler}>
              <Text style={{fontFamily: 'Montserrat-SemiBold'}}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: 'white',
  },
  profileDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 70,
  },
  link1: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  link2: {
    marginVertical: 5,
  },
});

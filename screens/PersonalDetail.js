import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../App';
import {configureFonts, TextInput} from 'react-native-paper';
import {icons} from '../constants';
import axios from 'axios';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import IconFA from 'react-native-vector-icons/FontAwesome';

const theme = {
  colors: {primary: 'tomato'},
  fonts: configureFonts({
    default: {
      regular: {
        fontFamily: 'Montserrat-Regular',
        fontWeight: 'normal',
      },
    },
  }),
};

export default function PersonalDetail({navigation, route}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [imagefile, setImagefile] = useState(null);
  const {token} = route.params;
  const inputref = useRef(null);
  const {signIn} = React.useContext(AuthContext);

  const createFormData = (photo, body = {}) => {
    const data = new FormData();
    if (imagefile) {
      data.append('image', {
        name: photo.assets[0].fileName,
        type: photo.assets[0].type,
        uri: photo.assets[0].uri,
      });
    }

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  const updateProfile = () => {
    if (name.length < 3 || /\d/.test(name)) {
      alert('Enter Valid Name');
    } else {
      if (/\S+@\S+\.\S+/.test(email)) {
        axios({
          method: 'POST',
          url: 'http://143.110.244.110/tija/frontuser/updateuserprofile',
          data: createFormData(imagefile, {name: name, email: email}),

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(response => {
          const storeToken = async token => {
            try {
              await AsyncStorage.setItem('token', token);

              signIn({token});
            } catch (e) {
              alert('storing token failed');
            }
          };
          if (response.data.success == true) {
            storeToken(token);
          }
        });
      } else {
        alert('enter valid email');
      }
    }
  };
  const handleImagePicker = () => {
    launchImageLibrary({quality: 0.5}, fileObj => {
      if (fileObj.assets) {
        setImage(fileObj.assets[0].uri);
        setImagefile(fileObj);
      }
    });
  };

  return (
    <>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.container}>
        <View style={styles.info}>
          <Text style={{fontFamily: 'Montserrat-Regular', marginBottom: 20}}>
            Personal Details
          </Text>
          <Text style={{fontFamily: 'Montserrat-Light'}}>
            Tell us a bit more about yourself
          </Text>
        </View>
        <View style={styles.inputBox}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 150,
              width: 150,
              alignSelf: 'center',
            }}>
            {image ? (
              <Image
                source={{uri: image}}
                style={{
                  height: 150,
                  width: 150,
                  marginBottom: 5,
                  borderRadius: 75,
                }}
              />
            ) : (
              <Image
                source={icons.user}
                style={{
                  height: 150,
                  width: 150,
                  marginBottom: 5,
                  borderRadius: 75,
                }}
              />
            )}
            <IconFA
              name="edit"
              size={30}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                color: 'tomato',
              }}
              onPress={handleImagePicker}
            />
          </View>
          <TextInput
            label="Name"
            value={name}
            style={{backgroundColor: 'white'}}
            onChangeText={name => setName(name)}
            theme={theme}
          />
          <TextInput
            label="Email"
            value={email}
            style={{backgroundColor: 'white'}}
            onChangeText={email => setEmail(email)}
            theme={theme}
          />
        </View>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.7}
          onPress={updateProfile}>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              color: 'white',
              fontSize: 17,
              textAlign: 'center',
            }}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  info: {
    marginTop: 25,
    alignItems: 'center',
  },
  inputBox: {
    marginTop: 15,
  },
  btn: {
    marginTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: 'tomato',
    borderRadius: 8,
  },
});

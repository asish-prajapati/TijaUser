import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import {sendOTP} from '../helpers/authentication';

export default function Login({navigation}) {
  const [mobile, setMobile] = useState('');

  const sendOtpHandler = () => {
    sendOTP(mobile, navigation);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#F0ABD2" />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <LinearGradient
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1.0}}
          colors={['#F0ABD2', '#E7B3F2', '#5FFBF1']}
          style={styles.linearGradient}>
          <View style={styles.container}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>Tija</Text>
              <Text style={styles.logoSubText}>IceCreames and Fastfood</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputBox}>
                <View style={styles.inputBoxLeft}>
                  <Text style={styles.countryCode}>+91</Text>
                </View>
                <View style={styles.inputBoxRight}>
                  <TextInput
                    placeholder="Phone Number"
                    style={styles.input}
                    keyboardType="numeric"
                    maxLength={10}
                    value={mobile}
                    onChangeText={text => setMobile(text)}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.btn} onPress={sendOtpHandler}>
                <Text style={styles.btnText}>Send OTP</Text>
              </TouchableOpacity>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                {/* <View style={styles.separator}>
                  <View style={styles.separatorLine}></View>

                  <View style={styles.separatorLine}></View>
                </View> */}
                <View style={{marginVertical: 20}}>
                  <Text style={[styles.agreeText, {marginHorizontal: 60}]}>
                    By continuing , you agree to our
                  </Text>
                  <Text style={[styles.agreeText, {marginHorizontal: 20}]}>
                    Term and Service, Privacy Policy, Content Policy
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    height: '100%',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {height: '70%', alignItems: 'center', justifyContent: 'center'},
  inputContainer: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  inputBox: {
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#353839',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowRadius: 0.2,
    shadowOffset: {width: -1, height: -1},
    elevation: 5,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat-Light',
  },
  inputBoxLeft: {
    backgroundColor: 'white',
    height: 50,
    marginBottom: 30,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    width: '20%',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#999999',
  },
  inputBoxRight: {width: '80%'},
  countryCode: {
    fontSize: 18,
    textAlignVertical: 'center',
    textAlign: 'center',
    fontFamily: 'Montserrat-Light',
  },
  input: {
    backgroundColor: 'white',
    height: 50,
    letterSpacing: 3,
    color: '#151515',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
  },
  logoText: {
    fontFamily: 'MajorMonoDisplay-Regular',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    fontSize: 100,
    color: 'white',
  },
  logoSubText: {
    fontFamily: 'AmaticSC-Regular',
    textAlign: 'center',
    fontSize: 12,
    color: 'white',
    letterSpacing: 8,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  separatorLine: {
    backgroundColor: '#b2b2b2',
    width: '30%',
    height: 1,
  },
  agreeText: {
    color: 'white',
    fontFamily: 'Montserrat-Light',
    fontSize: 10,
    marginBottom: 5,
  },
});

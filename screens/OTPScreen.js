import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {AuthContext} from '../App';
import IconArrow from 'react-native-vector-icons/MaterialIcons';
import {validateOTP} from '../helpers/authentication';

export default function OTPScreen({route, navigation}) {
  const {signIn} = React.useContext(AuthContext);
  const {mobile, tempuser, newuser, name} = route.params;
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [pin3, setPin3] = useState('');
  const [pin4, setPin4] = useState('');
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const validateOtpHandler = () => {
    const otp = `${pin1}${pin2}${pin3}${pin4}`;
    validateOTP(otp, tempuser, newuser, navigation, name, signIn);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <IconArrow name="arrow-back" size={25} style={{paddingLeft: 10}} />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 18,
              paddingLeft: 22,
            }}>
            Enter Verification Code
          </Text>
        </View>
        <View style={styles.main}>
          <View style={styles.mainUpper}>
            <Text
              style={{
                textAlign: 'center',
                marginBottom: 10,
                fontFamily: 'Montserrat-Light',
              }}>
              We have Sent a Verification code to
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {mobile}
            </Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                maxLength={1}
                autoFocus={true}
                keyboardType="number-pad"
                value={pin1}
                ref={ref1}
                onChangeText={pin1 => {
                  setPin1(pin1);
                  if (pin1 !== '') {
                    ref2.current.focus();
                  }
                }}
              />
              <TextInput
                style={styles.input}
                maxLength={1}
                keyboardType="number-pad"
                value={pin2}
                ref={ref2}
                onKeyPress={({nativeEvent: {key: keyValue}}) => {
                  if (keyValue === 'Backspace') {
                    ref1.current.focus();
                  }
                }}
                onChangeText={pin2 => {
                  setPin2(pin2);
                  if (!(pin2 == '')) {
                    ref3.current.focus();
                  }
                }}
              />
              <TextInput
                style={styles.input}
                maxLength={1}
                keyboardType="number-pad"
                value={pin3}
                ref={ref3}
                onKeyPress={({nativeEvent: {key: keyValue}}) => {
                  if (keyValue === 'Backspace') {
                    ref2.current.focus();
                  }
                }}
                onChangeText={pin3 => {
                  setPin3(pin3);
                  if (!(pin3 == '')) {
                    ref4.current.focus();
                  }
                }}
              />
              <TextInput
                style={styles.input}
                maxLength={1}
                keyboardType="number-pad"
                value={pin4}
                ref={ref4}
                onKeyPress={({nativeEvent: {key: keyValue}}) => {
                  if (keyValue === 'Backspace') {
                    ref3.current.focus();
                  }
                }}
                onChangeText={pin4 => {
                  setPin4(pin4);
                  if (!(pin4 == '')) {
                    ref4.current.blur();
                  }
                }}
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={validateOtpHandler}>
              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                Submit OTP
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mainBottom}>
            <Text
              style={{
                marginRight: 10,
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 12,
              }}>
              Didn't recieve the code?
            </Text>
            <TouchableOpacity>
              <Text
                style={{
                  marginRight: 10,
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 12,
                  color: 'grey',
                }}>
                Resend now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  main: {
    paddingHorizontal: 15,
    paddingTop: 30,
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  mainBottom: {
    flexDirection: 'row',
    marginBottom: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputBox: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  input: {
    width: 50,
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 20,
    textAlign: 'center',
  },
  btn: {
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    marginTop: 100,
    width: 200,
    padding: 15,
    alignSelf: 'center',
    marginBottom: 30,
  },
});

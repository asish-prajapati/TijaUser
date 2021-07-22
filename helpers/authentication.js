import axios from 'axios';
import {setToken} from './asyncStorage';

const sendOTP = (mobile, navigation) => {
  var pattern = /^[6789]\d{9}$/;

  if (pattern.test(mobile)) {
    axios
      .post('http://143.110.244.110/tija/frontuser/loginuser', {
        mobile: mobile,
      })
      .then(response => {
        response = response.data[0];
        if (response.success == true) {
          navigation.navigate('Otp', {
            mobile: mobile,
            tempuser: response.tempuser,
            newuser: response.newuser,
          });
        }
        if (response.success == false) {
          alert(response.message);
        }

        return response;
      })
      .catch(function (error) {
        // handle error
        alert('sendotpError', error);
        return error;
      });
  } else {
    alert('Enter Valid Mobile Number');
  }
};

const validateOTP = (otp, tempuser, newuser, navigation, signIn) => {
  axios
    .post('http://143.110.244.110/tija/frontuser/registeruser', {
      otp: otp,
      tempuser: tempuser,
      newuser: newuser,
    })
    .then(response => {
      response = response.data[0];

      if (response.success == true) {
        if (response.newuser == 1) {
          navigation.navigate('PersonalDetail', {
            token: response.auth_key,
          });
        } else {
          let token = response.auth_key;
          setToken(token);
          signIn({token});
        }
      } else {
        alert('registrapi call error', response.message);
      }

      return response;
    })
    .catch(function (error) {
      // handle error
      alert('loginuserAPiError', error);
      return error;
    });
};

export {sendOTP, validateOTP};

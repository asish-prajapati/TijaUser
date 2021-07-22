import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  let userToken;

  try {
    userToken = await AsyncStorage.getItem('token');
  } catch (e) {
    alert('geting token failed');
  }
};

const setToken = async token => {
  let userToken;

  try {
    userToken = await AsyncStorage.setItem('token', token);
  } catch (e) {
    alert('seting token failed');
  }
};

export {getToken, setToken};

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getProfile = async () => {
  try {
    let userToken;
    userToken = await AsyncStorage.getItem('token');
    let response = await axios.get(
      'http://143.110.244.110/tija/frontuser/updateuserprofile',
      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    response = await response.data;
    return response;
  } catch (error) {
    alert(error);
  }
};

export {getProfile};

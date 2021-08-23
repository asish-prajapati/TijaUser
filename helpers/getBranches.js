import {getToken} from './asyncStorage';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBranches = async resetToken => {
  //   const userToken = await getToken();
  try {
    let userToken;
    userToken = await AsyncStorage.getItem('token');

    const response = await axios.get(
      'http://143.110.244.110/tija/frontuser/getallbranch',
      {
        headers: {Authorization: `Bearer ${userToken}`},
      },
    );
    return response.data;
  } catch (err) {
    if (err.response.status == 401) {
      const clearAll = async () => {
        try {
          await AsyncStorage.clear();

          resetToken();
        } catch (e) {
          resetToken();
          alert(e);
        }
      };

      clearAll();
    }
  }
};

export {getBranches};

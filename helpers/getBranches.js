import {getToken} from './asyncStorage';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBranches = async () => {
  //   const userToken = await getToken();
  let userToken;
  userToken = await AsyncStorage.getItem('token');

  const response = await axios.get(
    'http://143.110.244.110/tija/frontuser/getallbranch',
    {
      headers: {Authorization: `Bearer ${userToken}`},
    },
  );
  return response.data;
};

export {getBranches};

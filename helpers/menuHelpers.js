import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const getMenu = async branch => {
  let userToken;
  userToken = await AsyncStorage.getItem('token');

  const response = await axios.get(
    'http://143.110.244.110/tija/frontuser/getallprdouct',
    {
      params: {branch_id: branch},
      headers: {Authorization: `Bearer ${userToken}`},
    },
  );
  return response.data;
};

const addToCart = async productID => {
  let userToken;
  userToken = await AsyncStorage.getItem('token');
  let res = await axios.get('http://143.110.244.110/tija/frontuser/addtocart', {
    headers: {Authorization: `Bearer ${userToken}`},
    params: {product_id: productID},
  });

  return res.data;
};

export {getMenu, addToCart};

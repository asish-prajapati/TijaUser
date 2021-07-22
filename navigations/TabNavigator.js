import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import IconOrder from 'react-native-vector-icons/Feather';
import IconReciept from 'react-native-vector-icons/Ionicons';
import IconUser from 'react-native-vector-icons/AntDesign';

import {Home, Menu, History, Profile} from '../screens';
import {COLORS} from '../constants';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: styles.tabNavigator,
        activeTintColor: 'tomato',
      }}>
      <Tab.Screen
        name="Order"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <IconOrder
              name="shopping-bag"
              size={25}
              color={focused ? 'tomato' : COLORS.secondary}
            />
          ),
          tabStyle: styles.tabStylee,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({focused}) => (
            <IconReciept
              name="receipt-outline"
              size={25}
              color={focused ? 'tomato' : COLORS.secondary}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <IconUser
              name="user"
              size={25}
              color={focused ? 'tomato' : COLORS.secondary}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({
  tabNavigator: {
    backgroundColor: 'white',

    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: -1},
    shadowRadius: 0.8,

    height: 55,
  },
  tabStylee: {
    borderTopColor: 'blue',
    borderTopWidth: 5,
  },
});

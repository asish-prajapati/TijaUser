import React from 'react';
import {View} from 'react-native';

import {BarIndicator} from 'react-native-indicators';

export default function MainLoader() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <BarIndicator color="coral" />
    </View>
  );
}

import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { AppRoutes } from './app.routes';

export function Routes() {
  return (
    // I'm style this view 'cause prevent white glitch
    <View className='flex-1 bg-background'>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  )
}
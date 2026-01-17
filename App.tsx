import { View, Text, StatusBar, Platform } from 'react-native'
import React from 'react'
import RootNavigator from './src/navigation/RootNavigator'
import { SafeAreaView } from 'react-native-safe-area-context'
import 'react-native-reanimated';

const App = () => {
  return (
    <>
         {Platform.OS === 'android' && (
          <View style={{ height: StatusBar.currentHeight, backgroundColor: '#1181B2' }} />
        )}
    <SafeAreaView style={{ flex: 1 }}>
      <RootNavigator/>
    </SafeAreaView>
    </>   
  )
}

export default App
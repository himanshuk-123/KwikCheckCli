import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../features/auth/store/auth.store';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { View, ActivityIndicator } from 'react-native';

const RootNavigator = () => {
  const { user, checkLogin, isLoading } = useAuthStore();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    const init = async () => {
      await checkLogin();
      setIsInitializing(false);
    };
    init();
  }, [checkLogin]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1181B2" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;

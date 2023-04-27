// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/Home'
import { ProfileScreen } from './screens/Profile'
import { MapScreen } from './screens/Map'
import { SignUpLogInComponent } from './screens/Login'

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#B6E13D',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Login" component={SignUpLogInComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
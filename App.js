// In App.js in a new project

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './screens/Home'
import { ProfileScreen } from './screens/Profile'
import { BizDetail } from './screens/BizDetail';
import { CheckIn } from './screens/CheckIn';
import { MapScreen } from './screens/Map'
import { SignUpLogInComponent } from './screens/Login'
import { NativeBaseProvider } from 'native-base';
import { FriendsListView } from './screens/FriendsListView';


const Stack = createNativeStackNavigator();


function App() {
  return (
    <NativeBaseProvider>
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
          <Stack.Screen name="CheckIn" component={CheckIn} />
          <Stack.Screen name="Login" component={SignUpLogInComponent} />
          <Stack.Screen name="Detail" component={BizDetail} />
          <Stack.Screen name="FriendsListView" component={FriendsListView} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

export default App;

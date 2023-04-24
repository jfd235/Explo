import React from 'react';
import HomeComponent from './components/Home.component';
import RestaurantDetailsComponent from './components/RestaurantDetail.component';
import RestaurantComponent from './components/Restaurant.component';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaProvider>
      {Platform.OS === 'android' ? null : (
        <StatusBar backgroundColor="rgb(47, 47, 47)" barStyle={1} />
      )}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeComponent}
            options={{
              title: '🍴Resto - Restaurants near you',
              headerStyle: { backgroundColor: 'rgb(47, 47, 47)' },
              headerTintColor: 'rgb(240, 240, 240)',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="Restaurants"
            component={RestaurantComponent}
            options={{
              title: 'Restaurants List',
              headerStyle: { backgroundColor: 'rgb(47, 47, 47)' },
              headerBackTitleVisible: false,
              headerTintColor: 'rgb(240, 240, 240)',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
          <Stack.Screen
            name="RestaurantDetails"
            component={RestaurantDetailsComponent}
            options={{
              title: 'Restaurant Details',
              headerStyle: { backgroundColor: 'rgb(47, 47, 47)' },
              headerBackTitleVisible: false,
              headerTintColor: 'rgb(240, 240, 240)',
              headerTitleStyle: { fontWeight: 'bold' },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

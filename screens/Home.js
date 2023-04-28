import * as React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export function HomeScreen({ navigation }) {
  return (
    <View style={[styles.container,{flexDirection: 'column',},]}>
      {/* <Text>Home Screen</Text> */}
      <View style={[buttonStyles.container]}>
        <Button color="#FFFFFF"
          title="Go to Map"
          onPress={() => navigation.navigate('Map')}
        />
      </View>
      <View style={[buttonStyles.container]}>
        <Button color="#FFFFFF"
          title="Go to Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
      <View style={[buttonStyles.container]}>
        <Button color="#FFFFFF"
          title="Sign Up/Log In"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
      <View style={[buttonStyles.container]}>
        <Button color="#FFFFFF"
          title="Go to Biz Detail"
          onPress={() => navigation.navigate('Detail')}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
const buttonStyles = StyleSheet.create({
  container: {
    width: 150,
    height: 50,
    backgroundColor: '#B6E13D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});
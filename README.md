# Explo
| ![Expo Logo](assets/explo.png?raw=true "Expo Logo") | ![Avocado](assets/avocado.png?raw=true "Avocado") |
| --------------------------------------------------- | ------------------------------------------------- |   
### Reimagining the way people explore their local communities.
Explo is a social network where users can see where their connections have been and the experiences they had, providing them with personal and trustworthy sources of information to take the guesswork out of finding amazing new places.  
***Where to next?***
## Dependencies
Expo:  
```
yarn add expo
```
Firebase:  
```
npx expo install firebase
npm install expo-image-picker
```
Google Maps:  
```
npm install react-native-maps --save  
cd ios  
pod install  
```
Screen Navigation:
```
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-location
cd ios
pod install
```
Others:
```
npm install react-native-star-rating-widget
```
  
## Running on Expo App
In Explo main directory, run:  
```
npx expo start
```
You may need to install some dependencies, just follow any on-screen instructions.
  
## Running on iOS Simulator (Only if above method with Expo doesn't work)
In Explo main directory, run:  
```
npx react-native run-ios
```

See https://reactnative.dev/docs/environment-setup?guide=quickstart  
under "Expo Go Quickstart" for help

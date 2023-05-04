import * as React from "react";
import { Button, StyleSheet, View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export function HomeScreen({ navigation }) {
  return (
    <View style={[styles.container, { flexDirection: "column" }]}>
      {/* <Text>Home Screen</Text> */}
      {/* <View>
        
      </View> */}
      <View
        style={[
          buttonStyles.container,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Button
          color="#FFFFFF"
          title="Go to Map"
          onPress={() => navigation.navigate("Map")}
        />
        <Image
          source={require("../assets/icons/map.png")}
          style={{ height: 50, width: 50 }}
        />
      </View>
      <View
        style={[
          buttonStyles.container,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Button
          color="#FFFFFF"
          title="Go to Profile"
          onPress={() => navigation.navigate("Profile")}
        />
        <Image
          source={require("../assets/icons/profile.png")}
          style={{ height: 50, width: 50 }}
        />
      </View>
      <View
        style={[
          buttonStyles.container,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Button
          color="#FFFFFF"
          title="Sign Up/Log In"
          onPress={() => navigation.navigate("Login")}
        />
        <Image
          source={require("../assets/icons/login.png")}
          style={{ height: 50, width: 50 }}
        />
      </View>
      <View
        style={[
          buttonStyles.container,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Button
          color="#FFFFFF"
          title="Go to Biz Detail"
          onPress={() => navigation.navigate("Detail")}
        />
        <Image
          source={require("../assets/icons/detail.png")}
          style={{ height: 50, width: 50 }}
        />
      </View>
      <View
        style={[
          buttonStyles.container,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Button
          color="#FFFFFF"
          title="Go to Check in"
          onPress={() => navigation.navigate("CheckIn")}
        />
        <Image
          source={require("../assets/icons/detail.png")}
          style={{ height: 50, width: 50 }}
        />
      </View>
      <View
        style={[
          buttonStyles.container,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Button
          color="#FFFFFF"
          title="Go to Friends"
          onPress={() => navigation.navigate("FriendsListView")}
        />
        <Image
          source={require("../assets/icons/detail.png")}
          style={{ height: 50, width: 50 }}
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
    alignItems: "center",
    justifyContent: "center",
  },
});
const buttonStyles = StyleSheet.create({
  container: {
    width: 200,
    height: 50,
    paddingLeft: 10,
    backgroundColor: "#B6E13D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Text, Animated, Easing } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const RADIUS = 80; // distance from Home button
const ANGLE_STEP = 55; // angle between each circle

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const [expanded, setExpanded] = useState(false);
  const animations = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  const toggleMenu = () => {
    const toValue = expanded ? 0 : 1;

    const animationsList = animations.map((anim) =>
      Animated.timing(anim, {
        toValue,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    );

    Animated.stagger(80, expanded ? animationsList.reverse() : animationsList).start();
    setExpanded(!expanded);
  };

  // Get the current active route
  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute.name;

  // Function to get icon name based on route
  const getIconName = (routeName: string) => {
    switch (routeName) {
      case "index":
        return "home";
      case "search":
        return "search";
      case "saved":
        return "bookmark";
      case "profile":
        return "person";
      default:
        return "home";
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        bottom: 60,
        left: 40,
        alignItems: "flex-start",
      }}
    >
      {/* Expandable curved menu */}
      {state.routes
        .filter((r: any) => r.name !== "index")
        .map((route: any, idx: number) => {
          const { options } = descriptors[route.key];
          const angle = idx * ANGLE_STEP; // curve
          const translateX = animations[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [0, RADIUS * Math.cos((angle * Math.PI) / 180)],
          });
          const translateY = animations[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -RADIUS * Math.sin((angle * Math.PI) / 180)],
          });

          return (
            <Animated.View
              key={route.key}
              style={{
                position: "absolute",
                transform: [{ translateX }, { translateY }],
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  toggleMenu();
                  navigation.navigate(route.name);
                }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#1E3A8A",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons 
                  name={getIconName(route.name)} 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </Animated.View>
          );
        })}

      {/* Main Center button */}
      <TouchableOpacity
        onPress={() => {
          if (state.index !== 0) {
            navigation.navigate("index");
          } else {
            toggleMenu();
          }
        }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#2563EB",
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
      >
        {/* Show icon based on active screen */}
        <Ionicons 
          name={getIconName(activeRouteName)} 
          size={30} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
};

const Layout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="saved" options={{ title: "Saved" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default Layout;
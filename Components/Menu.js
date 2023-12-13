import React, { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";

export default function Menu({ userRole}) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();

  // useEffect to handle re-rendering when the Menu becomes visible
  useEffect(() => {
    console.log("Menu component re-rendered with user role:", userRole);
  }, [userRole]);

  // Function to handle navigation
  const handlePress = (label) => {
    // Convert label to screen component name
    const screens = {
      "REPORT HOURS": "ReportHours",
      "MY SHIFTS": "MyShifts",
      "HISTORY": "History",
      "SETTINGS": "Settings",
      "OTHERS SHIFTS": "OthersShifts",
      "MANAGE SHIFTS": "ManageShifts",
      "OTHERS HISTORY": "OthersHistory",
      "EDIT EMAILS": "EditEmails",
      "APPEARANCE": "UploadImgScreen"
    };
    const screenName = screens[label];
    if (screenName) {
      navigation.navigate(screenName, { userRole });
      //close menu component before navigating to next screen
      setIsMenuOpen(false);
    } else {
      console.warn(`No screen found for label: ${label}`);
    }
  };
  

  // Define menu items based on user roles
  let menuItems = [];
  if (userRole === "WORKER") {
    menuItems = [
      { label: "REPORT HOURS", icon: "time" },
      { label: "MY SHIFTS", icon: "calendar" },
      { label: "HISTORY", icon: "refresh" },
      { label: "SETTINGS", icon: "settings" },
    ];
  } else if (userRole === "SUPERVISOR") {
    menuItems = [
      { label: "REPORT HOURS", icon: "time" },
      { label: "MY SHIFTS", icon: "calendar" },
      { label: "HISTORY", icon: "refresh" },
      { label: "OTHERS SHIFTS", icon: "clipboard" },
      { label: "OTHERS HISTORY", icon: "folder" },
      { label: "MANAGE SHIFTS", icon: "build" },
      { label: "SETTINGS", icon: "settings" },
    ];
  } else if (userRole === "MASTER") {
    menuItems = [
      { label: "REPORT HOURS", icon: "time" },
      { label: "MY SHIFTS", icon: "calendar" },
      { label: "HISTORY", icon: "refresh" },
      { label: "OTHERS SHIFTS", icon: "clipboard" },
      { label: "MANAGE SHIFTS", icon: "build" },
      { label: "OTHERS HISTORY", icon: "folder" },
      { label: "EDIT EMAILS", icon: "mail" },
      { label: "APPEARANCE", icon: "image" },
      { label: "SETTINGS", icon: "settings" },
     
    ];
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.labelsContainer}>
        {menuItems.map((menuItem, index) => (
          <TouchableOpacity
            style={styles.menuItem}
            key={index}
            onPress={() => handlePress(menuItem.label)}
          >
            <Ionicons
              name={menuItem.icon}
              color="white"
              style={[
                styles.icon,
                menuItem.icon === "refresh" ? styles.flipIcon : null,
              ]}
            />
            <Text style={styles.label}>{menuItem.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </KeyboardAvoidingView>
  );
}

const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#002233",
  },
  labelsContainer: {
    paddingTop: 90,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight * 0.03,
  },
  icon: {
    fontSize: screenWidth * 0.09,
    color: "white",
    marginRight: 2,
    position: "relative",
    top: "2.3%",
  },
  flipIcon: {
    transform: [{ rotateY: "180deg" }],
  },
  label: {
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginVertical: 0,
    paddingTop: 12,
  },
});
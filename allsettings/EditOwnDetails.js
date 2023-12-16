import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, TouchableWithoutFeedback, Image,
    TextInput, Alert, ScrollView,
    KeyboardAvoidingView, FlatList,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Menu from '../Components/Menu';
import Logout from '../Components/Logout';
import Home from '../Components/Home';
import { WORKERS, SERVER_BASE_URL, EDIT_OWN } from '@env'
import BackgroundImage from '../utility/BackGroundImage';

const EditOwnDetails = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isNewEmailVisible, setIsNewEmailVisible] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const route = useRoute();
    const userRole = route.params?.userRole;
    const [userData, setUserData] = useState([]);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isNewFirstNameVisible, setIsNewFirstNameVisible] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    const handleRoleSelection = (role) => {
        setSelectedRole(role);
        setPickerVisible(false);
    };
    //Muuttaa add email-napin TextInsertiksi
    const handleNewEmailButton = () => {
        setIsNewEmailVisible(true);
    };

    const validateEmailFormat = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email); //palauttaa false jos ei täsmää
    }

    const CustomPicker = ({ visible, data, selectedItem, onSelect, onClose }) => {
        return (
            <Modal visible={visible} transparent animationType="fade">
                <TouchableOpacity
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onPress={onClose}
                >
                    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 20, maxHeight: 200 }}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => onSelect(item)} style={{ paddingVertical: 10 }}>
                                    <Text style={{ fontFamily: "Saira-Regular", fontSize: 18 }}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.value.toString()}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        );
    };

    const roles = [
        { label: 'WORKER', value: 'WORKER' },
        { label: 'SUPERVISOR', value: 'SUPERVISOR' },
        { label: 'MASTER', value: 'MASTER' },
    ];

    

    //Edit email
    const EditEmail = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            const emailData = {
                email: newEmail.toLowerCase(),
                role: selectedRole.value.toUpperCase()
            };
            if (!validateEmailFormat(emailData.email)) {
                Alert.alert("Error", "Invalid email format");
                return;
            }
            
            try {
                const response = await fetch(`${SERVER_BASE_URL}${EDIT_OWN}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify(emailData),
                });
                console.log(emailData)
                if (response.ok) {
                    Alert.alert("Email edited succesfully")
                } else {
                    const errorText = await response.text();
                    Alert.alert("Error", errorText || "Failed to edit email");
                }
            } catch (error) {
                Alert.alert("Error adding email", error.message || "Unknown error");
            }
            setIsNewEmailVisible(false);
            setNewEmail('') //nollaa tekstikentät napin painalluksen jälkeen
        } catch (error) {
            console.error('Async function error:', error.message || "Unknown error");
        }
    };

    const EditFirstName = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            const firstNameData = {
                firstName: newName.toLowerCase(),
                role: selectedRole.value.toUpperCase()
            };
            if (!validateEmailFormat(firstNameData
                .firstName)) {
                Alert.alert("Error", "Invalid name format");
                return;
            }
            
            try {
                const response = await fetch(`${SERVER_BASE_URL}${EDIT_OWN}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify(firstNameData),
                });
                console.log(firstNameData)
                if (response.ok) {
                    Alert.alert("Name edited succesfully")
                } else {
                    const errorText = await response.text();
                    Alert.alert("Error", errorText || "Failed to edit name");
                }
            } catch (error) {
                Alert.alert("Error adding name", error.message || "Unknown error");
            }
            setIsNewFirstNameVisible(false);
            setNewFirstName('') //nollaa tekstikentät napin painalluksen jälkeen
        } catch (error) {
            console.error('Async function error:', error.message || "Unknown error");
        }
    };


    //Esimies voi katsoa mitkä sähköpostit on hyväksytty, ja onko käyttäjä luotu. Näkyy rullattavana listana.
    const handleSeeUsersInfo = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }

            try {
                const response = await fetch(`${SERVER_BASE_URL}${WORKERS}/email`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Set fetched data to state
                } else {
                    throw new Error('Failed to get users data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } catch (error) {
            console.error('Async function error:', error);
        }
    };

    useEffect(() => {
        handleSeeUsersInfo();
    }, []);

    //Aktivoituu kun screen tulee näkyviin. Muuten tekstikentät jää auki, ja data näkyviin yms.
    useFocusEffect(
        React.useCallback(() => {
            setMenuVisible(false)
            setIsNewEmailVisible(false)
            setNewEmail('')
            setUserData([])
        }, [])
    );

    return (
        <View style={styles.container}>
              <BackgroundImage style={styles.backgroundImage}/>
              <ScrollView style={styles.scrollView}>
                    {userData.map((user, index) => (
                        <View style={styles.userDataContainer} key={index}>
                            {/* <Text style={styles.userDataText}>ID: {user.id}</Text> */}
                            <Text style={styles.userDataText}>Email: {user.email}</Text>
                            <Text style={styles.userDataText}>Role: {user.role}</Text>
                            <Text style={styles.userDataText}>Registered: {user.registered ? 'Yes' : 'No'}</Text>
                        </View>
                    ))}
                </ScrollView>
                <View style={styles.centeredContainer}>
                            {/* Button to open the picker */}
                            <TouchableOpacity onPress={() => setPickerVisible(true)}>
                                <Text style={styles.pickerButton}>
                                <Ionicons name="chevron-down-circle-outline" size={24} color="black" />
                                    {selectedRole ? selectedRole.label : 'EDIT ROLE'}</Text>
                                    
                            </TouchableOpacity>

                        </View>

                        {/* Custom picker */}
                        <CustomPicker
                            visible={isPickerVisible}
                            data={roles}
                            selectedItem={selectedRole}
                            onSelect={handleRoleSelection}
                            onClose={() => setPickerVisible(false)}
                        />
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>EDIT EMAIL</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Modify email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />

                        <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green' }} onPress={EditEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </>
                )}  
            </View>
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>EDIT FIRST NAME</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Modify first name"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />

                        <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green' }} onPress={EditFirstName}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </>
                )}  
            </View> 
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>EDIT LAST NAME</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Modify email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />

                        <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green' }} onPress={EditEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </>
                )}  
            </View> 
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>EDIT NUMBER</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Modify email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />

                        <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green' }} onPress={EditEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </>
                )}  
            </View>
             
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '75%',
        height: '100%',
        backgroundColor: 'white',
    },
    actionButton: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        marginVertical: 6,
        alignItems: "center",
        width: screenWidth * 0.9,
        borderColor: "white",
        borderWidth: 2,
    },
    buttonText: {
        fontSize: screenWidth * 0.07,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    emailInput: {
        height: screenHeight * 0.07,
        width: screenWidth * 0.9,
        borderRadius: 5,
        borderColor: "black",
        textAlign: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 2,
        marginBottom: "1%",
        paddingHorizontal: 10,
        fontSize: screenWidth * 0.06,
        fontFamily: "Saira-Regular",

    },
    pickerButton: { //tässä samat asetukset kuin yllä, mutta tekstin keskittämiseen viimeinen rivi
        height: screenHeight * 0.07,
        width: screenWidth * 0.9,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 5,
        borderColor: "black",
        borderWidth: 2,
        marginBottom: "1%",
        paddingHorizontal: 10,
        fontSize: screenWidth * 0.06,
        fontFamily: "Saira-Regular",
        textAlign: 'center',
        paddingVertical: (screenHeight * 0.05 - screenWidth * 0.06) / 2,
    },
    scrollView: { //User Data
        maxHeight: 300, // Set a maximum height for the scrollable box
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    userDataContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingBottom: 10,
        marginBottom: 10,
    },
    userDataText: {
        color: 'white',
        fontFamily: "Saira-Regular",
        fontSize: screenWidth * 0.05,
    },
    pickerStyle: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 5,
        width: screenWidth * 0.9,
        height: screenHeight * 0.07,
        marginBottom: "1%",
        fontSize: screenWidth * 0.06,
        fontFamily: "Saira-Regular",
        color: "black",
    },
});

export default EditOwnDetails;
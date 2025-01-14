import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NearMeScreen from '../screens/NearMeScreen';
import LoginScreen from '../screens/LoginScreen';
import Registro from '../screens/Registro';
import MenuScreen from '../screens/ProductScreen'; 
import ChatbotScreen from '../screens/ChatbotScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CarritoScreen from '../screens/carrito';
import OrderProcessScreen from '../screens/OrderScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  
  return (
    <Stack.Navigator
  screenOptions={{
    headerShown: false, 
  }}
>
  <Stack.Screen name="login" component={LoginScreen} />
  <Stack.Screen name="Registro" component={Registro} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="menu" component={MenuScreen} />    
  <Stack.Screen name="ChatbotScreen" component={ChatbotScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />  
  <Stack.Screen name="Carrito" component={CarritoScreen} />   
  <Stack.Screen name="near" component={NearMeScreen} />
  <Stack.Screen name="OrderProcess" component={OrderProcessScreen} />

      
</Stack.Navigator>

  );
};

export default StackNavigator;

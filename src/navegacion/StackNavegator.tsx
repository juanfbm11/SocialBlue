import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from '../Screens/Home'
import Login from '../Screens/Login'
import Registro from '../Screens/Registro'
import MyPosts from '../Screens/MyPosts'
import SuperAdmin from '../Screens/SuperAdmin.tsx'
 
const Stack = createNativeStackNavigator();
 
export default function StackNavegator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>        
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="MyPosts" component={MyPosts} />
        <Stack.Screen name="SuperAdmin" component={SuperAdmin} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

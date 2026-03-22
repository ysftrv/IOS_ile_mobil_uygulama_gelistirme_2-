import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import { colors } from '../utils/theme';

import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import MyPlantsScreen from '../screens/MyPlantsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Ana Sayfa') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Tara') {
              iconName = focused ? 'scan-circle' : 'scan-circle-outline';
            } else if (route.name === 'Kayıtlarım') {
              iconName = focused ? 'leaf' : 'leaf-outline';
            }

            return <Ionicons name={iconName} size={size + 4} color={color} />;
          },
          tabBarActiveTintColor: colors.primary, 
          tabBarInactiveTintColor: colors.tabInactive, 
          headerShown: false, 
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          }
        })}
      >
        <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
        <Tab.Screen name="Tara" component={ScanScreen} />
        <Tab.Screen name="Kayıtlarım" component={MyPlantsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
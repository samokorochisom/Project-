
import { Tabs } from 'expo-router';

import React from 'react';

import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';

import { IconSymbol } from '@/components/ui/IconSymbol';

import TabBarBackground from '@/components/ui/TabBarBackground';

import { useTheme } from '@/contexts/ThemeContext';

 

export default function TabLayout() {

 const { currentTheme } = useTheme();

 

 return (

   <Tabs

     screenOptions={{

       tabBarActiveTintColor: currentTheme.primary,

       tabBarInactiveTintColor: currentTheme.textSecondary,

       headerShown: false,

       tabBarButton: HapticTab,

       tabBarBackground: TabBarBackground,

       tabBarStyle: Platform.select({

         ios: {

           position: 'absolute',

           backgroundColor: currentTheme.cardBackground + 'E6',

         },

         default: {

           backgroundColor: currentTheme.cardBackground,

           borderTopColor: currentTheme.border,

           borderTopWidth: 1,

         },

       }),

     }}>

     {/* Visible Tabs */}

     <Tabs.Screen

       name="index"

       options={{

         title: 'Home',

         tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,

       }}

     />

     <Tabs.Screen

       name="notes"

       options={{

         title: 'Notes',

         tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,

       }}

     />

     <Tabs.Screen

       name="progress"

       options={{

         title: 'Progress',

         tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,

       }}

     />

     <Tabs.Screen

       name="profile"

       options={{

         title: 'Profile',

         tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.circle.fill" color={color} />,

       }}

     />

     

     {/* Hidden Screens - Not shown in tab bar */}

     <Tabs.Screen

       name="courses"

       options={{

         href: null,

       }}

     />

     <Tabs.Screen

       name="mood-selection"

       options={{

         href: null,

       }}

     />

     <Tabs.Screen

       name="study"

       options={{

         href: null,

       }}

     />

     <Tabs.Screen

       name="break"

       options={{

         href: null,

       }}

     />

   </Tabs>

 );

}

 

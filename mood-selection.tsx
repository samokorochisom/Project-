import React, { useState, useEffect } from 'react';

import {

 StyleSheet,

 View,

 Text,

 TouchableOpacity,

 SafeAreaView,

} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';

import * as Haptics from 'expo-haptics';

import { MoodType } from '@/types/mood';

import { MOODS } from '@/constants/Moods';

import { loadProfile } from '@/utils/profileStorage';

 

import { useTheme } from '@/contexts/ThemeContext';

import { FONTS } from '@/constants/Themes';

export default function MoodSelectionScreen() {

 const router = useRouter();

 const params = useLocalSearchParams();

 const courseId = params.courseId as string;

 const courseName = params.courseName as string;

 

 const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

 const [userName, setUserName] = useState('');

 

 useEffect(() => {

   loadUserName();

 }, []);

 

 const loadUserName = async () => {

   const profile = await loadProfile();

   if (profile) {

     setUserName(profile.name);

   }

 };

 

 const handleMoodSelect = (moodId: MoodType) => {

   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

   setSelectedMood(moodId);

   

   // Navigate to study screen after a short delay

   setTimeout(() => {

     router.push({

       pathname: '/study',

       params: {

         mood: moodId,

         courseId: courseId,

         courseName: courseName,

       }

     });

   }, 300);

 };

 

 return (

   <SafeAreaView style={styles.container}>

     <View style={styles.content}>

       <View style={styles.card}>

         <View style={styles.header}>

           <TouchableOpacity

             style={styles.backButton}

             onPress={() => router.back()}

             activeOpacity={0.7}

           >

             <Text style={styles.backButtonText}>← Back</Text>

           </TouchableOpacity>

           <View style={styles.courseInfo}>

             <Text style={styles.courseLabel}>Studying</Text>

             <Text style={styles.courseName}>{courseName}</Text>

           </View>

         </View>

 

         <Text style={styles.greeting}>

           Hello, {userName}! 👋

         </Text>

         

         <Text style={styles.title}>How are you{'\n'}feeling today?</Text>

         

         <View style={styles.moodsContainer}>

           {MOODS.map((mood) => (

             <TouchableOpacity

               key={mood.id}

               style={[

                 styles.moodButton,

                 { backgroundColor: mood.color },

                 selectedMood === mood.id && styles.selectedMood,

               ]}

               onPress={() => handleMoodSelect(mood.id)}

               activeOpacity={0.7}

             >

               <Text style={styles.emoji}>{mood.emoji}</Text>

               <Text style={styles.moodLabel}>{mood.label}</Text>

               <Text style={styles.moodDuration}>{mood.studyDuration} min</Text>

             </TouchableOpacity>

           ))}

         </View>

 

         <Text style={styles.subtitle}>Tap a mood to begin your session.</Text>

       </View>

     </View>

   </SafeAreaView>

 );

}

const styles = StyleSheet.create({

 container: {

   flex: 1,

   backgroundColor: '#F5F3ED',

 },

 content: {

   flex: 1,

   justifyContent: 'center',

   alignItems: 'center',

   padding: 20,

 },

 card: {

   backgroundColor: '#FDFBF7',

   borderRadius: 24,

   padding: 32,

   width: '100%',

   maxWidth: 400,

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 2,

   },

   shadowOpacity: 0.1,

   shadowRadius: 8,

   elevation: 4,

 },

 header: {

   marginBottom: 24,

 },

 backButton: {

   alignSelf: 'flex-start',

   marginBottom: 16,

 },

 backButtonText: {

   fontSize: 16,

   color: '#8B9D83',

   fontWeight: '600',

 },

 courseInfo: {

   backgroundColor: '#F5F3ED',

   borderRadius: 12,

   padding: 12,

 },

 courseLabel: {

   fontSize: 12,

   color: '#6B7064',

   marginBottom: 4,

   textTransform: 'uppercase',

   letterSpacing: 1,

 },

 courseName: {

   fontSize: 18,

   fontWeight: '600',

   color: '#3D4037',

 },

 greeting: {

   fontSize: 20,

   color: '#6B7064',

   marginBottom: 8,

 },

 title: {

   fontSize: 28,

   fontWeight: 'bold',

   color: '#3D4037',

   marginBottom: 24,

   lineHeight: 36,

 },

 moodsContainer: {

   flexDirection: 'row',

   flexWrap: 'wrap',

   justifyContent: 'space-between',

   marginBottom: 24,

 },

 moodButton: {

   width: '47%',

   aspectRatio: 1,

   borderRadius: 20,

   justifyContent: 'center',

   alignItems: 'center',

   marginBottom: 16,

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 1,

   },

   shadowOpacity: 0.08,

   shadowRadius: 4,

   elevation: 2,

 },

 selectedMood: {

   transform: [{ scale: 0.95 }],

   opacity: 0.8,

 },

 emoji: {

   fontSize: 56,

   marginBottom: 8,

 },

 moodLabel: {

   fontSize: 18,

   fontWeight: '600',

   color: '#3D4037',

   marginBottom: 4,

 },

 moodDuration: {

   fontSize: 14,

   color: '#6B7064',

   fontWeight: '500',

 },

 subtitle: {

   fontSize: 16,

   color: '#6B7064',

   textAlign: 'center',

   marginTop: 8,

 },

});

 

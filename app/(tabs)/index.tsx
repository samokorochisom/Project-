import React, { useState, useEffect } from 'react';

import {

 StyleSheet,

 View,

 Text,

 TouchableOpacity,

 SafeAreaView,

 ScrollView,

 TextInput,

 Alert,

 Modal,

} from 'react-native';

import { useRouter } from 'expo-router';

import * as Haptics from 'expo-haptics';

import { Course } from '@/types/profile';

import { loadCourses, addCourse, deleteCourse, loadProfile } from '@/utils/profileStorage';

import { useTheme } from '@/contexts/ThemeContext';

import { FONTS } from '@/constants/Themes';

import { useFocusEffect } from '@react-navigation/native';

import { useCallback } from 'react';

import { loadActiveSession, ActiveSession } from '@/utils/activeSessionStorage';

import { loadActiveBreak, ActiveBreak } from '@/utils/activeBreakStorage'; // Add this import

 

const COURSE_COLORS = [

 '#A8C69F',

 '#C9DCBB',

 '#E8DCC4',

 '#B8C5A0',

 '#D4C5A0',

 '#C19A7A',

];

 

export default function HomeScreen() {

 const router = useRouter();

 const { currentTheme, settings } = useTheme();

 const [courses, setCourses] = useState<Course[]>([]);

 const [modalVisible, setModalVisible] = useState(false);

 const [newCourseName, setNewCourseName] = useState('');

 const [selectedColor, setSelectedColor] = useState(COURSE_COLORS[0]);

 const [userName, setUserName] = useState('');

 const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

 const [activeBreak, setActiveBreak] = useState<ActiveBreak | null>(null); // Add this

 const [recentSessions, setRecentSessions] = useState<StudySession[]>([]);

 

 useFocusEffect(

   useCallback(() => {

     loadCoursesData();

     checkActiveSession();

     checkActiveBreak(); // Add this

   }, [])

 );

 

 useEffect(() => {

   loadCoursesData();

   loadUserName();

   checkActiveSession();

   checkActiveBreak(); // Add this

 }, []);

 

 const checkActiveSession = async () => {

   const session = await loadActiveSession();

   setActiveSession(session);

 };

 

 const checkActiveBreak = async () => {

   const breakSession = await loadActiveBreak();

   setActiveBreak(breakSession);

 };

 

 const loadCoursesData = async () => {

   const data = await loadCourses();

   setCourses(data);

 };

 

 const loadUserName = async () => {

   const profile = await loadProfile();

   if (profile) {

     setUserName(profile.name);

   }

 };

 

 const handleAddCourse = async () => {

   if (newCourseName.trim().length === 0) {

     Alert.alert('Course Name Required', 'Please enter a course name.');

     return;

   }

 

   try {

     const newCourse: Course = {

       id: Date.now().toString(),

       name: newCourseName.trim(),

       color: selectedColor,

       createdAt: Date.now(),

     };

 

     await addCourse(newCourse);

     await loadCoursesData();

     setNewCourseName('');

     setSelectedColor(COURSE_COLORS[0]);

     setModalVisible(false);

     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

   } catch (error) {

     Alert.alert('Error', 'Failed to add course. Please try again.');

   }

 };

 

 const handleDeleteCourse = (courseId: string, courseName: string) => {

   Alert.alert(

     'Delete Course',

     `Are you sure you want to delete "${courseName}"?`,

     [

       { text: 'Cancel', style: 'cancel' },

       {

         text: 'Delete',

         style: 'destructive',

         onPress: async () => {

           try {

             await deleteCourse(courseId);

             await loadCoursesData();

             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

           } catch (error) {

             Alert.alert('Error', 'Failed to delete course.');

           }

         },

       },

     ]

   );

 };

 

 const handleCoursePress = (course: Course) => {

   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

   router.push({

     pathname: '/mood-selection',

     params: {

       courseId: course.id,

       courseName: course.name,

     }

   });

 };

 

 const handleActiveSessionPress = () => {

   if (activeSession) {

     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

     router.push({

       pathname: '/study',

       params: {

         courseId: activeSession.courseId,

         courseName: activeSession.courseName,

         mood: activeSession.mood,

       }

     });

   }

 };

 

 const handleActiveBreakPress = () => {

   if (activeBreak) {

     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

     router.push({

       pathname: '/break',

       params: {

         courseId: activeBreak.courseId,

         courseName: activeBreak.courseName,

         mood: activeBreak.mood,

       }

     });

   }

 };

 

 const formatDuration = (minutes: number) => {

   if (minutes < 60) return `${minutes}m`;

   const hours = Math.floor(minutes / 60);

   const mins = minutes % 60;

   return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;

 };

 

 const formatDate = (timestamp: number) => {

   const date = new Date(timestamp);

   const now = new Date();

   const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

   

   if (diffDays === 0) return 'Today';

   if (diffDays === 1) return 'Yesterday';

   if (diffDays < 7) return `${diffDays} days ago`;

   

   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

   return `${months[date.getMonth()]} ${date.getDate()}`;

 };

 

 return (

   <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>

     <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

       <Text style={[

         styles.greeting,

         {

           color: currentTheme.textSecondary,

           fontFamily: FONTS[settings.fontStyle].regular

         }

       ]}>

         Welcome back, {userName}! 👋

       </Text>

 

       {activeSession && activeSession.isActive && (

         <TouchableOpacity

           style={[styles.activeSessionBanner, { backgroundColor: currentTheme.primary }]}

           onPress={handleActiveSessionPress}

           activeOpacity={0.8}

         >

           <View style={styles.activeSessionContent}>

             <Text style={styles.activeSessionEmoji}>⏱️</Text>

             <View style={styles.activeSessionText}>

               <Text style={[

                 styles.activeSessionTitle,

                 {

                   color: currentTheme.cardBackground,

                   fontFamily: FONTS[settings.fontStyle].bold

                 }

               ]}>

                 Active Study Session

               </Text>

               <Text style={[

                 styles.activeSessionCourse,

                 {

                   color: currentTheme.cardBackground,

                   fontFamily: FONTS[settings.fontStyle].regular

                 }

               ]}>

                 {activeSession.courseName}

               </Text>

             </View>

             <Text style={styles.activeSessionArrow}>→</Text>

           </View>

         </TouchableOpacity>

       )}

 

       {activeBreak && activeBreak.isActive && (

         <TouchableOpacity

           style={[styles.activeSessionBanner, { backgroundColor: currentTheme.warning }]}

           onPress={handleActiveBreakPress}

           activeOpacity={0.8}

         >

           <View style={styles.activeSessionContent}>

             <Text style={styles.activeSessionEmoji}>☕</Text>

             <View style={styles.activeSessionText}>

               <Text style={[

                 styles.activeSessionTitle,

                 {

                   color: currentTheme.cardBackground,

                   fontFamily: FONTS[settings.fontStyle].bold

                 }

               ]}>

                 Active Break

               </Text>

               <Text style={[

                 styles.activeSessionCourse,

                 {

                   color: currentTheme.cardBackground,

                   fontFamily: FONTS[settings.fontStyle].regular

                 }

               ]}>

                 {activeBreak.courseName}

               </Text>

             </View>

             <Text style={styles.activeSessionArrow}>→</Text>

           </View>

         </TouchableOpacity>

       )}

 

       {recentSessions.length > 0 && (

         <View style={styles.recentSessionsSection}>

           <Text style={[

             styles.sectionTitle,

             {

               color: currentTheme.textPrimary,

               fontFamily: FONTS[settings.fontStyle].bold

             }

           ]}>

             Recent Sessions

           </Text>

           {recentSessions.map((session) => (

             <View

               key={session.id}

               style={[styles.sessionCard, { backgroundColor: currentTheme.cardBackground }]}

             >

               <View style={styles.sessionHeader}>

                 <Text style={[

                   styles.sessionCourse,

                   {

                     color: currentTheme.textPrimary,

                     fontFamily: FONTS[settings.fontStyle].bold

                   }

                 ]}>

                   {session.courseName}

                 </Text>

                 <Text style={[

                   styles.sessionDate,

                   {

                     color: currentTheme.textTertiary,

                     fontFamily: FONTS[settings.fontStyle].regular

                   }

                 ]}>

                   {formatDate(session.startTime)}

                 </Text>

               </View>

               <View style={styles.sessionDetails}>

                 <View style={styles.sessionStat}>

                   <Text style={styles.sessionEmoji}>⏱️</Text>

                   <Text style={[

                     styles.sessionStatText,

                     {

                       color: currentTheme.textSecondary,

                       fontFamily: FONTS[settings.fontStyle].regular

                     }

                   ]}>

                     {formatDuration(session.duration)}

                   </Text>

                 </View>

                 <View style={styles.sessionStat}>

                   <Text style={styles.sessionEmoji}>

                     {session.mood === 'focused' ? '🎯' :

                      session.mood === 'creative' ? '🎨' : '🧘'}

                   </Text>

                   <Text style={[

                     styles.sessionStatText,

                     {

                       color: currentTheme.textSecondary,

                       fontFamily: FONTS[settings.fontStyle].regular

                     }

                   ]}>

                     {session.mood.charAt(0).toUpperCase() + session.mood.slice(1)}

                   </Text>

                 </View>

               </View>

             </View>

           ))}

         </View>

       )}

 

       <Text style={[

         styles.title,

         {

           color: currentTheme.textPrimary,

           fontFamily: FONTS[settings.fontStyle].bold

         }

       ]}>

         My Courses

       </Text>

       <Text style={[

         styles.subtitle,

         {

           color: currentTheme.textSecondary,

           fontFamily: FONTS[settings.fontStyle].regular

         }

       ]}>

         Select a course to start studying

       </Text>

 

       {courses.length === 0 ? (

         <View style={[styles.emptyState, { backgroundColor: currentTheme.cardBackground }]}>

           <Text style={styles.emptyEmoji}>📚</Text>

           <Text style={[

             styles.emptyText,

             {

               color: currentTheme.textPrimary,

               fontFamily: FONTS[settings.fontStyle].bold

             }

           ]}>

             No courses yet

           </Text>

           <Text style={[

             styles.emptySubtext,

             {

               color: currentTheme.textSecondary,

               fontFamily: FONTS[settings.fontStyle].regular

             }

           ]}>

             Add your first course to get started!

           </Text>

         </View>

       ) : (

         <View style={styles.coursesGrid}>

           {courses.map((course) => (

             <TouchableOpacity

               key={course.id}

               style={[styles.courseCard, { backgroundColor: course.color }]}

               onPress={() => handleCoursePress(course)}

               onLongPress={() => handleDeleteCourse(course.id, course.name)}

               activeOpacity={0.7}

             >

               <Text style={[

                 styles.courseName,

                 {

                   color: currentTheme.textPrimary,

                   fontFamily: FONTS[settings.fontStyle].bold

                 }

               ]}>

                 {course.name}

               </Text>

               <Text style={styles.courseEmoji}>📖</Text>

             </TouchableOpacity>

           ))}

         </View>

       )}

 

       <TouchableOpacity

         style={[styles.addButton, { backgroundColor: currentTheme.primary }]}

         onPress={() => setModalVisible(true)}

         activeOpacity={0.8}

       >

         <Text style={[

           styles.addButtonText,

           {

             color: currentTheme.cardBackground,

             fontFamily: FONTS[settings.fontStyle].bold

           }

         ]}>

           + Add Course

         </Text>

       </TouchableOpacity>

     </ScrollView>

 

     <Modal

       visible={modalVisible}

       animationType="slide"

       transparent

       onRequestClose={() => setModalVisible(false)}

     >

       <View style={styles.modalOverlay}>

         <View style={[styles.modalContent, { backgroundColor: currentTheme.cardBackground }]}>

           <Text style={[

             styles.modalTitle,

             {

               color: currentTheme.textPrimary,

               fontFamily: FONTS[settings.fontStyle].bold

             }

           ]}>

             Add New Course

           </Text>

 

           <TextInput

             style={[

               styles.modalInput,

               {

                 backgroundColor: currentTheme.background,

                 borderColor: currentTheme.border,

                 color: currentTheme.textPrimary,

                 fontFamily: FONTS[settings.fontStyle].regular

               }

             ]}

             placeholder="Course name"

             placeholderTextColor={currentTheme.textTertiary}

             value={newCourseName}

             onChangeText={setNewCourseName}

             autoFocus

           />

 

           <Text style={[

             styles.colorLabel,

             {

               color: currentTheme.textPrimary,

               fontFamily: FONTS[settings.fontStyle].bold

             }

           ]}>

             Choose a color:

           </Text>

           <View style={styles.colorGrid}>

             {COURSE_COLORS.map((color) => (

               <TouchableOpacity

                 key={color}

                 style={[

                   styles.colorOption,

                   { backgroundColor: color },

                   selectedColor === color && {

                     borderColor: currentTheme.primary,

                     borderWidth: 3

                   },

                 ]}

                 onPress={() => setSelectedColor(color)}

               />

             ))}

           </View>

 

           <View style={styles.modalButtons}>

             <TouchableOpacity

               style={[styles.modalButton, styles.cancelButton, { backgroundColor: currentTheme.border }]}

               onPress={() => {

                 setModalVisible(false);

                 setNewCourseName('');

                 setSelectedColor(COURSE_COLORS[0]);

               }}

             >

               <Text

                 style={[

                   styles.cancelButtonText,

                   {

                     color: currentTheme.textPrimary,

                     fontFamily: FONTS[settings.fontStyle].bold

                   }

                 ]}

               >

                 Cancel

               </Text>

             </TouchableOpacity>

 

             <TouchableOpacity

               style={[styles.modalButton, styles.saveButton, { backgroundColor: currentTheme.primary }]}

               onPress={handleAddCourse}

             >

               <Text

                 style={[

                   styles.saveButtonText,

                   {

                     color: currentTheme.cardBackground,

                     fontFamily: FONTS[settings.fontStyle].bold

                   }

                 ]}

               >

                 Add

               </Text>

             </TouchableOpacity>

           </View>

         </View>

       </View>

     </Modal>

   </SafeAreaView>

 );

}const styles = StyleSheet.create({

 container: {

   flex: 1,

 },

 scrollView: {

   flex: 1,

 },

 scrollContent: {

   padding: 20,

 },

 greeting: {

   fontSize: 20,

   marginBottom: 8,

 },

 activeSessionBanner: {

   borderRadius: 16,

   padding: 16,

   marginBottom: 20,

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 4,

   },

   shadowOpacity: 0.3,

   shadowRadius: 8,

   elevation: 4,

 },

 activeSessionContent: {

   flexDirection: 'row',

   alignItems: 'center',

   gap: 12,

 },

 activeSessionEmoji: {

   fontSize: 32,

 },

 activeSessionText: {

   flex: 1,

 },

 activeSessionTitle: {

   fontSize: 16,

   fontWeight: 'bold',

   marginBottom: 4,

 },

 activeSessionCourse: {

   fontSize: 14,

 },

 activeSessionArrow: {

   fontSize: 24,

   color: '#FFFFFF',

 },

 recentSessionsSection: {

   marginBottom: 24,

 },

 sectionTitle: {

   fontSize: 20,

   fontWeight: 'bold',

   marginBottom: 12,

 },

 sessionCard: {

   borderRadius: 12,

   padding: 16,

   marginBottom: 12,

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 2,

   },

   shadowOpacity: 0.1,

   shadowRadius: 4,

   elevation: 2,

 },

 sessionHeader: {

   flexDirection: 'row',

   justifyContent: 'space-between',

   alignItems: 'center',

   marginBottom: 12,

 },

 sessionCourse: {

   fontSize: 16,

   fontWeight: 'bold',

 },

 sessionDate: {

   fontSize: 12,

 },

 sessionDetails: {

   flexDirection: 'row',

   gap: 16,

 },

 sessionStat: {

   flexDirection: 'row',

   alignItems: 'center',

   gap: 6,

 },

 sessionEmoji: {

   fontSize: 16,

 },

 sessionStatText: {

   fontSize: 14,

 },

 title: {

   fontSize: 32,

   fontWeight: 'bold',

   marginBottom: 8,

 },

 subtitle: {

   fontSize: 16,

   marginBottom: 24,

 },

 emptyState: {

   borderRadius: 16,

   padding: 40,

   alignItems: 'center',

   marginBottom: 24,

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 2,

   },

   shadowOpacity: 0.1,

   shadowRadius: 4,

   elevation: 3,

 },

 emptyEmoji: {

   fontSize: 64,

   marginBottom: 16,

 },

 emptyText: {

   fontSize: 20,

   fontWeight: '600',

   marginBottom: 8,

 },

 emptySubtext: {

   fontSize: 16,

   textAlign: 'center',

 },

 coursesGrid: {

   flexDirection: 'row',

   flexWrap: 'wrap',

   justifyContent: 'space-between',

   marginBottom: 24,

 },

 courseCard: {

   width: '48%',

   aspectRatio: 1,

   borderRadius: 16,

   padding: 20,

   justifyContent: 'space-between',

   marginBottom: 16,

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 2,

   },

   shadowOpacity: 0.1,

   shadowRadius: 4,

   elevation: 3,

 },

 courseName: {

   fontSize: 18,

   fontWeight: '600',

 },

 courseEmoji: {

   fontSize: 32,

   textAlign: 'right',

 },

 addButton: {

   borderRadius: 12,

   padding: 18,

   alignItems: 'center',

   shadowColor: '#6B7064',

   shadowOffset: {

     width: 0,

     height: 4,

   },

   shadowOpacity: 0.3,

   shadowRadius: 8,

   elevation: 4,

 },

 addButtonText: {

   fontSize: 18,

   fontWeight: '600',

 },

 modalOverlay: {

   flex: 1,

   backgroundColor: 'rgba(61, 64, 55, 0.5)',

   justifyContent: 'center',

   alignItems: 'center',

   padding: 20,

 },

 modalContent: {

   borderRadius: 20,

   padding: 24,

   width: '100%',

   maxWidth: 400,

 },

 modalTitle: {

   fontSize: 24,

   fontWeight: 'bold',

   marginBottom: 20,

 },

 modalInput: {

   borderRadius: 12,

   padding: 16,

   fontSize: 16,

   marginBottom: 20,

   borderWidth: 1,

 },

 colorLabel: {

   fontSize: 16,

   fontWeight: '600',

   marginBottom: 12,

 },

 colorGrid: {

   flexDirection: 'row',

   flexWrap: 'wrap',

   gap: 12,

   marginBottom: 24,

 },

 colorOption: {

   width: 50,

   height: 50,

   borderRadius: 25,

   borderWidth: 0,

 },

 modalButtons: {

   flexDirection: 'row',

   gap: 12,

 },

 modalButton: {

   flex: 1,

   borderRadius: 12,

   padding: 16,

   alignItems: 'center',

 },

 cancelButton: {},

 saveButton: {},

 cancelButtonText: {

   fontSize: 16,

   fontWeight: '600',

 },

 saveButtonText: {

   fontSize: 16,

   fontWeight: '600',

 },

});

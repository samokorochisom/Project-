import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();

  // Pomodoro Timer (25 minutes)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    loadNotes();
  }, [isFocused]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            Alert.alert('Time is up!', 'Take a break or start again.');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) setNotes(JSON.parse(storedNotes));
    } catch (e) {
      console.log(e);
    }
  };

  const deleteNote = (id) => {
    Alert.alert(
      'Delete Note',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const newNotes = notes.filter(n => n.id !== id);
            setNotes(newNotes);
            await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
          }
        }
      ]
    );
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <View style={styles.container}>
      {/* Timer */}
      <View style={styles.timerBox}>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <TouchableOpacity
          style={[styles.timerButton, { backgroundColor: isRunning ? '#e53935' : '#43a047' }]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <Text style={styles.timerButtonText}>
            {isRunning ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notes */}
      {notes.length === 0 && (
        <Text style={styles.empty}>No notes yet. Add one.</Text>
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.note}
            onLongPress={() => deleteNote(item.id)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.content}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNote')}
      >
        <Text style={styles.addText}>+ Add Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  timerBox: { alignItems: 'center', marginBottom: 20 },
  timer: { fontSize: 48, fontWeight: 'bold' },
  timerButton: { padding: 10, borderRadius: 5, marginTop: 10 },
  timerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  note: { padding: 15, borderBottomWidth: 1, borderColor: '#ccc' },
  title: { fontWeight: 'bold', fontSize: 16 },
  addButton: { backgroundColor: '#1e88e5', padding: 15, borderRadius: 5, marginTop: 10, alignItems: 'center' },
  addText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' }
});

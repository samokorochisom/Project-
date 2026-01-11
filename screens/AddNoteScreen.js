import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddNoteScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const saveNote = async () => {
    if (!title || !content) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newNote = { id: Date.now(), title, content };

    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      const notes = storedNotes ? JSON.parse(storedNotes) : [];
      notes.push(newNote);
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Content"
        style={[styles.input, { height: 100 }]}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15 },
  saveButton: { backgroundColor: '#43a047', padding: 15, borderRadius: 5, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

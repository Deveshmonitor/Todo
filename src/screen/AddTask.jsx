import firestore from '@react-native-firebase/firestore';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

const CATEGORIES = [
  'Work',
  'Personal',
  'Fitness',
  'Shopping',
  'Miscellaneous',
  'Study',
  'Other',
];

const AddTask = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(''); // Storing as string
  const [category, setCategory] = useState('Work'); // Default category
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to Validate Date (YYYY-MM-DD)
  const isValidDate = dateString => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
    if (!regex.test(dateString)) return false;

    const [year, month, day] = dateString.split('-').map(Number);
    const dateObject = new Date(year, month - 1, day);

    return (
      dateObject.getFullYear() === year &&
      dateObject.getMonth() === month - 1 &&
      dateObject.getDate() === day
    );
  };

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if (!isValidDate(dueDate)) {
      Alert.alert('Error', 'Please enter a valid Due Date (YYYY-MM-DD)');
      return;
    }
    setIsLoading(true);
    try {
      await firestore().collection('tasks').add({
        title,
        dueDate,
        category,
        notes,
        completedDate: null,
        status: 'Pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      setIsLoading(false);
      setTitle('');
      setDueDate('');
      setCategory('Work'); // Reset to default category
      setNotes('');

      Alert.alert('Success', 'Task added successfully!');
    } catch (error) {
      console.error('Firestore error:', error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to add task: ' + error.message);
    }
  };

  return (
    <ScrollView>
      <View className="flex-1 p-6 bg-gray-100">
        <Text className="text-xl font-semibold mb-2">Task Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter task title"
          className="border p-3 rounded-lg bg-white"
        />

        <Text className="text-xl font-semibold mt-4 mb-2">
          Due Date (YYYY-MM-DD)
        </Text>
        <TextInput
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="Enter due date"
          className="border p-3 rounded-lg bg-white"
          keyboardType="numeric"
        />

        <Text className="text-xl font-semibold mt-4 mb-2">Category</Text>
        <View className="flex-row flex-wrap">
          {CATEGORIES.map(item => (
            <TouchableOpacity
              key={item}
              className={`px-3 py-2 m-1 rounded-lg ${
                category === item ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              onPress={() => setCategory(item)}>
              <Text
                className={`font-semibold ${
                  category === item ? 'text-white' : 'text-black'
                }`}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-xl font-semibold mt-4 mb-2">Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          className="border p-3 rounded-lg bg-white h-32 text-base"
          multiline
          textAlignVertical="top" // Ensures text starts from the top
        />

        <View className="flex-1 justify-between mt-6">
          <TouchableOpacity
            onPress={handleSaveTask}
            className="bg-blue-500 py-3 my-3 w-full rounded-md flex-row justify-center items-center"
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-semibold">Save Task</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-500 py-3 my-3 w-full rounded-md">
            <Text className="text-white text-center font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddTask;

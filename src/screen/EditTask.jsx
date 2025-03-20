import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const EditTask = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {task} = route.params;

  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState(
    task.completed ? 'Completed' : 'Pending',
  );
  const [notes, setNotes] = useState(task.notes || '');

  // ✅ Handle Task Update
  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title cannot be empty.');
      return;
    }

    try {
      await firestore()
        .collection('tasks')
        .doc(task.id)
        .update({
          title,
          category,
          dueDate,
          completed: status === 'Completed',
          notes,
        });
      Alert.alert('Success', 'Task updated successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-8">
      <Text className="text-3xl font-semibold text-gray-900 mb-6">
        Edit Task
      </Text>

      {/* Task Title */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Title</Text>
      <TextInput
        className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 text-base mb-4"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      {/* Category */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Category</Text>
      <TextInput
        className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 text-base mb-4"
        value={category}
        onChangeText={setCategory}
        placeholder="Enter category"
      />

      {/* Due Date */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Due Date</Text>
      <TextInput
        className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 text-base mb-4"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="YYYY-MM-DD"
      />

      {/* Status Selection */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Status</Text>
      <View className="flex-row justify-between gap-2 space-x-4 mb-4">
        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-lg text-center ${
            status === 'Pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onPress={() => setStatus('Pending')}>
          <Text className="text-center font-medium">Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-lg text-center ${
            status === 'Completed'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onPress={() => setStatus('Completed')}>
          <Text className="text-center font-medium">Completed</Text>
        </TouchableOpacity>
      </View>

      {/* Notes */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Notes</Text>
      <TextInput
        className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 text-base mb-6"
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any additional notes..."
        multiline
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="flex-1 bg-blue-600 py-3 rounded-lg mr-2"
          onPress={handleUpdate}>
          <Text className="text-center text-white text-lg font-medium">
            Save Changes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-gray-400 py-3 rounded-lg ml-2"
          onPress={() => navigation.goBack()}>
          <Text className="text-center text-white text-lg font-medium">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTask;

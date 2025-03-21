import React from 'react';
import {View, Text, Alert, ScrollView} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Button from '../components/core/Button';

const TaskDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {task} = route.params;

  const handleDelete = async () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await firestore().collection('tasks').doc(task.id).delete();
            Alert.alert(
              'Task Deleted',
              'The task has been removed successfully.',
            );
            navigation.goBack();
          } catch (error) {
            console.error('Error deleting task:', error);
            Alert.alert(
              'Error',
              'Failed to delete the task. Please try again.',
            );
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    navigation.navigate('EditTask', {task});
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 py-8">
      <Text className="text-3xl font-extrabold text-black mb-6">
        {task.title}
      </Text>

      <View className="bg-[#F5F5F5] p-6 rounded-xl shadow-lg border border-gray-300">
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-500">Category</Text>
          <Text className="text-xl font-semibold text-black">
            {task.category}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-500">Due Date</Text>
          <Text className="text-xl font-semibold text-black">
            {task.dueDate}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-500">Status</Text>
          <Text
            className={`text-xl font-bold ${
              task.status === 'Completed' ? 'text-green-600' : 'text-red-600'
            }`}>
            {task.status === 'Completed' ? '✅ Completed' : '⏳ Pending'}
          </Text>
        </View>

        <View className="mt-4">
          <Text className="text-lg font-semibold text-gray-500">Notes</Text>
          <Text className="text-gray-900 text-lg">
            {task.notes || 'No additional notes available.'}
          </Text>
        </View>
      </View>

      <View className="mt-8 space-y-4">
        <Button name="Edit Task" onPress={handleEdit} />
        <Button
          name="Delete Task"
          buttonStyle={{
            backgroundColor: '#f74242', // Custom red background
          }}
          onPress={handleDelete}
        />
      </View>
    </ScrollView>
  );
};

export default TaskDetails;

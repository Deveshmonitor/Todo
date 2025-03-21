import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import Button from './../components/core/Button';

const CATEGORIES = ["Work", "Personal", "Fitness", "Shopping", "Miscellaneous", "Study", "Other"]; // Fixed categories

const EditTask = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [status, setStatus] = useState(task.status || "Pending"); // Use task.status for consistency
  const [notes, setNotes] = useState(task.notes || "");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // ✅ Handle Task Update
  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Task title cannot be empty.");
      return;
    }

    if (!dueDate || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
      Alert.alert("Error", "Please enter a valid due date (YYYY-MM-DD).");
      return;
    }
 setIsLoading(true)
    try {
      // Update task in Firestore
      await firestore()
        .collection("tasks")
        .doc(task.id)
        .update({
          title,
          category,
          dueDate,
          status,
          notes,
          completedDate: status === "Completed" ? new Date().toISOString() : null, // Set completedDate if status is "Completed"
        });

      Alert.alert("Success", "Task updated successfully.");
      navigation.goBack();
      setIsLoading(false)
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task.");
      setIsLoading(false)
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 py-8">
      <Text className="text-3xl font-semibold text-gray-900 mb-6">Edit Task</Text>

      {/* Task Title */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Title</Text>
      <TextInput
        className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 text-base mb-4"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />

      {/* Category Selection */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Category</Text>
      <View className="flex-row flex-wrap mb-4">
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            className={`px-4 py-2 m-1 rounded-lg ${
              category === cat ? "bg-blue-500" : "bg-gray-200"
            }`}
            onPress={() => setCategory(cat)}
          >
            <Text className={`font-medium ${category === cat ? "text-white" : "text-gray-700"}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Due Date */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Due Date (YYYY-MM-DD)</Text>
      <TextInput
        className="bg-gray-100 px-4 py-3 rounded-lg text-gray-800 text-base mb-4"
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="YYYY-MM-DD"
        keyboardType="numeric"
      />

      {/* Status Selection */}
      <Text className="text-lg font-medium text-gray-700 mb-2">Status</Text>
      <View className="flex-row justify-between gap-2 space-x-4 mb-4">
        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-lg text-center ${
            status === "Pending" ? "bg-yellow-500" : "bg-gray-200"
          }`}
          onPress={() => setStatus("Pending")}
        >
          <Text className={`text-center font-medium ${status === "Pending" ? "text-white" : "text-gray-700"}`}>
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 px-4 py-3 rounded-lg text-center ${
            status === "Completed" ? "bg-green-500" : "bg-gray-200"
          }`}
          onPress={() => setStatus("Completed")}
        >
          <Text className={`text-center font-medium ${status === "Completed" ? "text-white" : "text-gray-700"}`}>
            Completed
          </Text>
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
        className="flex-1 bg-blue-600 py-3 rounded-lg mr-2 flex-row justify-center items-center"
        onPress={handleUpdate}
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#ffffff" /> // Show loading indicator
        ) : (
          <Text className="text-center text-white text-lg font-medium">Save Changes</Text> // Show text
        )}
      </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-gray-400 py-3 rounded-lg ml-2"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-center text-white text-lg font-medium">Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditTask;
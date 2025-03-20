import firestore from "@react-native-firebase/firestore";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

const CATEGORIES = ["Work", "Personal", "Fitness", "Shopping", "Miscellaneous", "Study", "Other"];

const AddTask = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(""); // Storing as string
  const [category, setCategory] = useState("Work"); // Default category
  const [notes, setNotes] = useState("");

  // Function to Validate Date (YYYY-MM-DD)
  const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // Regex for YYYY-MM-DD format
    if (!regex.test(dateString)) return false;

    const [year, month, day] = dateString.split("-").map(Number);
    const dateObject = new Date(year, month - 1, day);
    
    return (
      dateObject.getFullYear() === year &&
      dateObject.getMonth() === month - 1 &&
      dateObject.getDate() === day
    );
  };

  const handleSaveTask = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }
    if (!isValidDate(dueDate)) {
      Alert.alert("Error", "Please enter a valid Due Date (YYYY-MM-DD)");
      return;
    }

    try {
      await firestore().collection("tasks").add({
        title,
        dueDate,
        category,
        notes,
        completedDate: null,
        status: "Pending",
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert("Success", "Task added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Firestore error:", error);
      Alert.alert("Error", "Failed to add task: " + error.message);
    }
  };

  return (
    <View className="flex-1 p-6 bg-gray-100">
      {/* Title Input */}
      <Text className="text-xl font-semibold mb-2">Task Title</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
        className="border p-3 rounded-lg bg-white"
      />

      {/* Due Date Input */}
      <Text className="text-xl font-semibold mt-4 mb-2">Due Date (YYYY-MM-DD)</Text>
      <TextInput
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Enter due date"
        className="border p-3 rounded-lg bg-white"
        keyboardType="numeric"
      />

      {/* Category Selection */}
      <Text className="text-xl font-semibold mt-4 mb-2">Category</Text>
      <View className="flex-row flex-wrap">
        {CATEGORIES.map((item) => (
          <TouchableOpacity
            key={item}
            className={`px-3 py-2 m-1 rounded-lg ${
              category === item ? "bg-blue-500" : "bg-gray-300"
            }`}
            onPress={() => setCategory(item)}
          >
            <Text className={`font-semibold ${category === item ? "text-white" : "text-black"}`}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes Input */}
      <Text className="text-xl font-semibold mt-4 mb-2">Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional notes"
        className="border p-3 rounded-lg bg-white"
        multiline
      />

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-6">
        <TouchableOpacity onPress={handleSaveTask} className="bg-green-500 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold">Save Task</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-red-500 px-4 py-2 rounded-lg">
          <Text className="text-white font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddTask;

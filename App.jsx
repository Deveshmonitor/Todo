import React from "react";
import "./global.css";
import Home from "./src/pages/Home";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const HomeScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* App Title */}
      <Text className="text-2xl font-bold text-center mb-4">Smart To-Do List</Text>

      {/* Quick Task View */}
      <ScrollView className="mb-4">
        {/* Pending Tasks Section */}
        <View className="bg-white p-4 rounded-xl shadow mb-4">
          <Text className="text-lg font-bold mb-2">Pending Tasks</Text>
          <View className="border-l-4 border-yellow-500 pl-2 mb-2">
            <Text className="text-base text-gray-800">🛒 Buy Vegetables (Due Today)</Text>
          </View>
          <View className="border-l-4 border-yellow-500 pl-2 mb-2">
            <Text className="text-base text-gray-800">📑 Submit Report (Due Tomorrow)</Text>
          </View>
        </View>

        {/* Completed Tasks Section */}
        <View className="bg-white p-4 rounded-xl shadow mb-4">
          <Text className="text-lg font-bold mb-2">Completed Tasks ✅</Text>
          <View className="border-l-4 border-green-500 pl-2 mb-2">
            <Text className="text-base text-gray-500 line-through">✍️ Finish Homework</Text>
          </View>
          <View className="border-l-4 border-green-500 pl-2 mb-2">
            <Text className="text-base text-gray-500 line-through">🏋️ Gym Workout</Text>
          </View>
        </View>
      </ScrollView>

      {/* Quick Actions */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-xl flex-1 mr-2"
          onPress={() => navigation.navigate("AddTask")}
        >
          <Text className="text-white text-center font-bold">➕ Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-gray-800 p-3 rounded-xl flex-1 ml-2"
          onPress={() => navigation.navigate("TaskList")}
        >
          <Text className="text-white text-center font-bold">📋 View Tasks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
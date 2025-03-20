import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

const TaskList = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await firestore().collection("tasks").get();
        const taskList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
        setFilteredTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  // 🔍 **Search Function**
  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  // 📌 **Filter by Category (including Pending)**
  const filterByCategory = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredTasks(tasks);
    } else if (category === "Pending") {
      const filtered = tasks.filter((task) => task.status === "Pending");
      setFilteredTasks(filtered);
    } else {
      const filtered = tasks.filter((task) => task.category === category);
      setFilteredTasks(filtered);
    }
  };

  // 📌 **Sort Tasks**
  const sortTasks = (option) => {
    setSortOption(option);
    let sortedTasks = [...filteredTasks];

    if (option === "Newest") {
      sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    } else if (option === "Oldest") {
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else if (option === "Completed") {
      sortedTasks = sortedTasks.filter((task) => task.status === "Completed");
    }

    setFilteredTasks(sortedTasks);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-center text-gray-900 mb-4">
        📌 Task List
      </Text>

      {/* 🔍 Search Bar */}
      <TextInput
        className="bg-white p-3 rounded-lg shadow-md mb-3"
        placeholder="🔍 Search tasks..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* 📌 Filter & Sort Options */}
      <View className="flex-row justify-between mb-3">
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => filterByCategory("All")}>
          <Text className="text-white">All</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => filterByCategory("Work")}>
          <Text className="text-white">Work</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => filterByCategory("Personal")}>
          <Text className="text-white">Personal</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg" onPress={() => filterByCategory("Pending")}>
          <Text className="text-white">Pending</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-3">
        <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg" onPress={() => sortTasks("Newest")}>
          <Text className="text-white">🆕 Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg" onPress={() => sortTasks("Oldest")}>
          <Text className="text-white">📅 Oldest</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-700 px-4 py-2 rounded-lg" onPress={() => sortTasks("Completed")}>
          <Text className="text-white">✅ Completed</Text>
        </TouchableOpacity>
      </View>

      {/* 📜 Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white p-4 my-2 rounded-lg shadow-md"
            onPress={() => navigation.navigate("TaskDetail", { task: item })}
          >
            <Text className="text-lg font-medium">{item.title}</Text>
            <Text className="text-gray-600">Category: {item.category}</Text>
            <Text className="text-gray-600">Due: {item.dueDate}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TaskList;

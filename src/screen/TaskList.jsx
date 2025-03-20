import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  RefreshControl,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

// Fixed categories (same as in AddTask)
const CATEGORIES = [
  'Work',
  'Personal',
  'Fitness',
  'Shopping',
  'Miscellaneous',
  'Study',
  'Other',
];
const STATUS_OPTIONS = ['All', 'Pending', 'Completed']; // Status options

const TaskList = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]); // All tasks fetched from Firestore
  const [filteredTasks, setFilteredTasks] = useState([]); // Tasks after filtering and sorting
  const [searchText, setSearchText] = useState(''); // Search input text
  const [loading, setLoading] = useState(true); // Loading state for Firestore fetch
  const [error, setError] = useState(null); // Error state
  const [isFilterModalVisible, setFilterModalVisible] = useState(false); // Filter modal visibility
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category filter
  const [selectedStatus, setSelectedStatus] = useState('All'); // Selected status filter
  const [selectedDate, setSelectedDate] = useState(''); // Selected due date filter
  const [refreshing, setRefreshing] = useState(false);

  // Fetch tasks from Firestore

  const fetchTasks = async () => {
    try {
      const querySnapshot = await firestore().collection('tasks').get();
      const taskList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
      setFilteredTasks(taskList); // Initialize filteredTasks with all tasks
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle search input
  const handleSearch = text => {
    setSearchText(text);
    applyFilters(text, selectedCategory, selectedStatus, selectedDate);
  };

  // Apply filters and sorting
  const applyFilters = (searchText, category, status, date) => {
    let filtered = tasks;

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter(task => task.category === category);
    }

    // Filter by status
    if (status !== 'All') {
      filtered = filtered.filter(task => task.status === status);
    }

    // Filter by due date
    if (date) {
      filtered = filtered.filter(task => task.dueDate === date);
    }

    setFilteredTasks(filtered);
  };

  // Open filter modal
  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  // Close filter modal and apply filters
  const closeFilterModal = () => {
    setFilterModalVisible(false);
    applyFilters(searchText, selectedCategory, selectedStatus, selectedDate);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedDate('');
    applyFilters(searchText, 'All', 'All', '');
  };

  // Render task item
  const renderTaskItem = ({item}) => (
    <TouchableOpacity
      className="bg-white p-4 my-2 rounded-lg shadow-md"
      onPress={() => navigation.navigate('TaskDetail', {task: item})}>
      <Text className="text-lg font-medium">{item.title}</Text>
      <Text className="text-gray-600">Category: {item.category}</Text>
      <Text className="text-gray-600">Due: {item.dueDate}</Text>
      <Text
        className={`text-sm ${
          item.status === 'Completed' ? 'text-green-600' : 'text-red-600'
        }`}>
        Status: {item.status}
      </Text>
    </TouchableOpacity>
  );

  // Show loading indicator
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Show error message
  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-center text-gray-900 mb-4">
        Task List
      </Text>

      {/* Search Input */}
      <TextInput
        className="bg-white p-3 rounded-lg shadow-md mb-3"
        placeholder="🔍 Search tasks..."
        value={searchText}
        onChangeText={handleSearch}
      />

      {/* Filter Button */}
      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded-lg mb-3"
        onPress={openFilterModal}>
        <Text className="text-white font-semibold text-center">
          Filter Tasks
        </Text>
      </TouchableOpacity>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item.id}
          renderItem={renderTaskItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchTasks} />}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 text-lg">No tasks found.</Text>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeFilterModal}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">Filter Tasks</Text>

            {/* Category Filter */}
            <Text className="text-lg font-semibold mb-2">Category</Text>
            <View className="flex-row flex-wrap mb-4">
              {['All', ...CATEGORIES].map(category => (
                <TouchableOpacity
                  key={category}
                  className={`px-4 py-2 m-1 rounded-lg ${
                    selectedCategory === category
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                  onPress={() => setSelectedCategory(category)}>
                  <Text
                    className={`font-semibold ${
                      selectedCategory === category
                        ? 'text-white'
                        : 'text-black'
                    }`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Status Filter */}
            <Text className="text-lg font-semibold mb-2">Status</Text>
            <View className="flex-row flex-wrap mb-4">
              {STATUS_OPTIONS.map(status => (
                <TouchableOpacity
                  key={status}
                  className={`px-4 py-2 m-1 rounded-lg ${
                    selectedStatus === status ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onPress={() => setSelectedStatus(status)}>
                  <Text
                    className={`font-semibold ${
                      selectedStatus === status ? 'text-white' : 'text-black'
                    }`}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Due Date Filter */}
            <Text className="text-lg font-semibold mb-2">Due Date</Text>
            <TextInput
              className="bg-white p-3 rounded-lg border border-gray-300 mb-4"
              placeholder="YYYY-MM-DD"
              value={selectedDate}
              onChangeText={setSelectedDate}
            />

            {/* Action Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded-lg"
                onPress={resetFilters}>
                <Text className="text-white font-semibold">Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-green-500 px-4 py-2 rounded-lg"
                onPress={closeFilterModal}>
                <Text className="text-white font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskList;

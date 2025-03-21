import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
const HomeScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = async () => {
    setRefreshing(true);
    try {
      const querySnapshot = await firestore().collection('tasks').get();
      const taskList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  const completedTasks = tasks.filter(task => task.status === 'Completed');
  const pendingTasks = tasks.filter(task => task.status !== 'Completed');

  // Format the completed date
  const formatCompletedDate = date => {
    if (!date) return 'N/A'; // Handle missing date

    // Convert Firestore timestamp to JavaScript Date object
    const jsDate = date.toDate ? date.toDate() : new Date(date);

    // Format the date as DD/MM/YYYY, HH:MM AM/PM
    const day = String(jsDate.getDate()).padStart(2, '0');
    const month = String(jsDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = jsDate.getFullYear();
    const hours = String(jsDate.getHours() % 12 || 12).padStart(2, '0'); // Convert to 12-hour format
    const minutes = String(jsDate.getMinutes()).padStart(2, '0');
    const ampm = jsDate.getHours() >= 12 ? 'PM' : 'AM';

    return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-4xl font-semibold text-center text-gray-900 drop-shadow-md mb-6">
        Smart Todo App
      </Text>
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}>
        {!loading && tasks.length === 0 ? (
          <View className="flex-1 justify-center items-center border border-dashed border-gray-400 p-6 rounded-lg">
            <Text className="text-gray-500 text-lg font-semibold">
              No tasks available.
            </Text>
            <TouchableOpacity
              className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
              onPress={() => navigation.navigate('AddTask')}>
              <Text className="text-white font-semibold">➕ Add New Task</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text className="text-xl font-semibold text-gray-800 mb-2">
              Pending Tasks
            </Text>
            {pendingTasks.length > 0 ? (
              <FlatList
                data={pendingTasks}
                scrollEnabled={false}
                keyExtractor={item => item.id}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={fetchTasks}
                  />
                }
                renderItem={({item}) => (
                  <View className="p-4 my-2 rounded-lg shadow-md bg-white border border-gray-300">
                    <Text className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-gray-600">
                      Due: {item.dueDate || 'N/A'}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <View className="p-4 my-2 rounded-lg shadow-md bg-gray-200 border border-gray-400 flex justify-center items-center">
                <Text className="text-lg font-semibold text-gray-600">
                  No completed tasks available.
                </Text>
              </View>
            )}

            <Text className="text-xl font-semibold text-green-800 mt-6 mb-2">
              Completed Tasks
            </Text>

            {completedTasks.length > 0 ? (
              <FlatList
                data={completedTasks}
                scrollEnabled={false}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <View className="p-4 my-2 rounded-lg shadow-md bg-green-100 border border-green-300">
                    <Text className="text-lg font-semibold text-green-800">
                      {item.title}
                    </Text>
                    <Text className="text-gray-600">
                      Completed On: {formatCompletedDate(item.completedDate)}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <View className="p-4 my-2 rounded-lg shadow-md bg-gray-200 border border-gray-400 flex justify-center items-center">
                <Text className="text-lg font-semibold text-gray-600">
                  No completed tasks available.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
      {/* 🔹 Action Buttons */}
      <View className="flex flex-row justify-between mb-4">
        <TouchableOpacity
          className="bg-blue-600 px-4 py-3 rounded-lg flex-1 mr-2"
          onPress={() => navigation.navigate('AddTask')}>
          <Text className="text-white font-semibold text-center">Add Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-700 px-4 py-3 rounded-lg flex-1"
          onPress={() => navigation.navigate('TaskList')}>
          <Text className="text-white font-semibold text-center">
            View All Tasks
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 View Reports Button */}
      <TouchableOpacity
        className="bg-purple-600 my-2 px-4 py-3 rounded-lg mt-4"
        onPress={() => navigation.navigate('TaskReports')}>
        <Text className="text-white font-semibold text-center">
          View Task Reports
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

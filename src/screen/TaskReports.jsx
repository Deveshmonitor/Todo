import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import firestore from '@react-native-firebase/firestore';

const TaskReports = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('monthly'); // Default filter: monthly
  const [error, setError] = useState(null);

  // Fetch tasks from Firestore
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await firestore().collection('tasks').get();
        const taskList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to fetch tasks. Please try again later.');
      }
    };

    fetchTasks();
  }, []);

  // Calculate task statistics
  const calculateTaskStats = () => {
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const completedTasks = tasks.filter(
      task => task.status === 'Completed',
    ).length;

    return {
      totalTasks,
      pendingTasks,
      completedTasks,
    };
  };

  const {totalTasks, pendingTasks, completedTasks} = calculateTaskStats();

  // Chart data
  const chartData = {
    labels: ['Total Tasks', 'Pending Tasks', 'Completed Tasks'],
    datasets: [
      {
        data: [totalTasks, pendingTasks, completedTasks],
        colors: [
          (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, // Teal for Total Tasks
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for Pending Tasks
          (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, // Blue for Completed Tasks
        ],
      },
    ],
  };

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#f8f8f8',
    backgroundGradientTo: '#f8f8f8',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 0.5,
    propsForLabels: {
      fontSize: 12,
      fontWeight: 'bold',
    },
  };

  // Date filter options
  const filters = [
    {label: 'Weekly', value: 'weekly'},
    {label: 'Monthly', value: 'monthly'},
  ];

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
        Task Summary & Reports
      </Text>

      {/* Date Filter */}
      <View className="flex-row justify-around bg-white p-2 rounded-lg shadow-md mb-4">
        {filters.map(item => (
          <TouchableOpacity
            key={item.value}
            className={`px-4 py-2 rounded-lg ${
              filter === item.value ? 'bg-blue-500' : 'bg-gray-200'
            }`}
            onPress={() => setFilter(item.value)}>
            <Text
              className={`font-semibold ${
                filter === item.value ? 'text-white' : 'text-gray-700'
              }`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bar Chart */}
      <View className="items-center">
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 32} // Adjust width for padding
          height={220}
          chartConfig={chartConfig}
          fromZero
          yAxisLabel=""
          yAxisSuffix=""
          verticalLabelRotation={0}
          showBarTops={false}
          style={{borderRadius: 8}}
          withCustomBarColorFromData // Enable custom bar colors
          flatColor // Use flat colors instead of gradients
        />
      </View>

      {/* Task Statistics */}
      <View className="mt-6">
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          Task Statistics
        </Text>
        <View className="bg-white p-4 rounded-lg shadow-md">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-700">Total Tasks</Text>
            <Text className="text-gray-900 font-bold">{totalTasks}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-700">Pending Tasks</Text>
            <Text className="text-gray-900 font-bold">{pendingTasks}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Completed Tasks</Text>
            <Text className="text-gray-900 font-bold">{completedTasks}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default TaskReports;

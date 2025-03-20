import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { BarChart } from "react-native-chart-kit";
import Loading from "../components/Loading";
// import DropDownPicker from "react-native-dropdown-picker";

const TaskReports = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Monthly Report", value: "monthly" },
    { label: "Weekly Report", value: "weekly" },
  ]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const querySnapshot = await firestore().collection("tasks").get();
        const taskList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Loading isLoading={loading} />

      <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
        Task Summary & Reports
      </Text>

      {/* 🔽 Dropdown Picker */}
      {/* <DropDownPicker
        open={open}
        value={filter}
        items={items}
        setOpen={setOpen}
        setValue={setFilter}
        setItems={setItems}
        containerStyle={{ height: 40, marginBottom: 10 }}
        style={{ backgroundColor: "#fafafa" }}
        dropDownStyle={{ backgroundColor: "#fff" }}
      /> */}

      {/* 📊 Bar Chart */}
      <BarChart
        data={{
          labels: ["Total", "Pending", "Completed"],
          datasets: [{ data: [tasks.length, 5, 7] }],
        }}
        width={350}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f8f8f8",
          backgroundGradientTo: "#f8f8f8",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </View>
  );
};

export default TaskReports;

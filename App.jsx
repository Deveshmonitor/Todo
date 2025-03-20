import React from "react";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screen/Home";
import AddTask from "./src/screen/AddTask";
import TaskDetail from "./src/screen/TaskDetails";
import TaskList from "./src/screen/TaskList";
import EditTask from "./src/screen/EditTask";
import TaskReports from "./src/screen/TaskReports";
import Splash from "./src/screen/Splash";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff",
          headerShown: false,
          headerTitleStyle: { fontWeight: "bold" },
        }}

      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="TaskDetail" component={TaskDetail} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="EditTask" component={EditTask} />
        <Stack.Screen name="TaskReports" component={TaskReports} />
        <Stack.Screen name="Splash" component={Splash} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

"use client"

import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "./lib/supabase"
import type { Session } from "@supabase/supabase-js"
import AuthScreen from "./screens/AuthScreen"
import TaskListScreen from "./screens/TaskListScreen"
import AddTaskScreen from "./screens/AddTaskScreen"
import EditTaskScreen from "./screens/EditTaskScreen"
import ProfileScreen from "./screens/ProfileScreen"
import { setupNotifications } from "./lib/notifications"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === "Tasks") {
            iconName = focused ? "list" : "list-outline"
          } else if (route.name === "Add Task") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          }
          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Tasks" component={TaskListScreen} />
      <Tab.Screen name="Add Task" component={AddTaskScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    setupNotifications()

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return null
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {session ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: "Edit Task" }} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

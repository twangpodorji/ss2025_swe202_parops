import * as Notifications from "expo-notifications"
import * as Device from "expo-device"
import { Platform } from "react-native"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export async function setupNotifications() {
  // Check if we're in Expo Go
  const isExpoGo = __DEV__ && !Device.isDevice

  if (isExpoGo) {
    console.log("Running in Expo Go - notifications will be limited")
    return false
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!")
      return false
    }
  } else {
    console.log("Must use physical device for Push Notifications")
    return false
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  return true
}

export async function scheduleTaskNotification(taskTitle: string, dueDate: Date) {
  try {
    const notificationTime = new Date(dueDate.getTime() - 60 * 60 * 1000) // 1 hour before

    if (notificationTime > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: `Don't forget: ${taskTitle}`,
          sound: "default",
        },
        trigger: {
          date: notificationTime,
        },
      })
      console.log(`Notification scheduled for: ${taskTitle}`)
    }
  } catch (error) {
    console.log("Error scheduling notification:", error)
  }
}

export async function sendTaskNotification(title: string, body: string) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: "default",
      },
      trigger: null,
    })
    console.log(`Notification sent: ${title}`)
  } catch (error) {
    console.log("Error sending notification:", error)
  }
}

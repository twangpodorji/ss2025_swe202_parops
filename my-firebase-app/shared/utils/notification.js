import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

/**
 * Notification Utility
 * Handles all notification-related business logic
 */

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationManager {
  static async requestPermissions() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return {
          success: false,
          error: "Permission not granted for notifications",
        };
      }

      return { success: true };
    } else {
      return {
        success: false,
        error: "Must use physical device for Push Notifications",
      };
    }
  }

  static async scheduleTaskNotification(task) {
    try {
      const scheduledDate = new Date(task.scheduledDate);
      const now = new Date();

      if (scheduledDate <= now) {
        return {
          success: false,
          error: "Cannot schedule notification for past date",
        };
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: `Don't forget: ${task.title}`,
          data: { taskId: task.id },
        },
        trigger: {
          date: scheduledDate,
        },
      });

      return { success: true, notificationId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async cancelTaskNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async showTaskActionNotification(action, taskTitle) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Task ${action}`,
          body: `${taskTitle} has been ${action.toLowerCase()}`,
        },
        trigger: null, // Show immediately
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

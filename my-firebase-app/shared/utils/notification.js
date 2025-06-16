import * as Notifications from "expo-notifications";

export const scheduleNotification = async (title, body, date) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { date },
  });
};

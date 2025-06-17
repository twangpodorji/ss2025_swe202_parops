/**
 * Date Utilities
 * Business logic for date operations
 */
export class DateUtils {
  static formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  static formatTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static formatDateTime(date) {
    return `${this.formatDate(date)} at ${this.formatTime(date)}`;
  }

  static isToday(date) {
    const today = new Date();
    const checkDate = new Date(date);
    return checkDate.toDateString() === today.toDateString();
  }

  static isPast(date) {
    return new Date(date) < new Date();
  }

  static getCalendarMarkedDates(tasks) {
    const markedDates = {};

    tasks.forEach((task) => {
      const dateKey = task.scheduledDate.split("T")[0];
      if (!markedDates[dateKey]) {
        markedDates[dateKey] = { marked: true, dots: [] };
      }

      markedDates[dateKey].dots.push({
        color:
          task.priority === "high"
            ? "#ff4444"
            : task.priority === "medium"
            ? "#ffaa00"
            : "#00aa00",
      });
    });

    return markedDates;
  }
}

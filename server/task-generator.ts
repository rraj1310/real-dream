type DurationUnit = "days" | "weeks" | "months" | "years";
type Recurrence = "daily" | "weekly" | "semi-weekly" | "monthly" | "semi-monthly";

interface TaskDate {
  date: Date;
  order: number;
}

function normalizeToLocalMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  const originalDay = result.getDate();
  
  result.setMonth(result.getMonth() + months);
  
  if (result.getDate() !== originalDay) {
    result.setDate(0);
  }
  
  return normalizeToLocalMidnight(result);
}

function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  const originalDay = result.getDate();
  const originalMonth = result.getMonth();
  
  result.setFullYear(result.getFullYear() + years);
  
  if (originalMonth === 1 && originalDay === 29) {
    if (result.getMonth() !== 1) {
      result.setDate(0);
    }
  }
  
  return normalizeToLocalMidnight(result);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return normalizeToLocalMidnight(result);
}

function calculateEndDate(
  startDate: Date,
  duration: number,
  durationUnit: DurationUnit
): Date {
  const start = normalizeToLocalMidnight(startDate);
  
  switch (durationUnit) {
    case "days":
      return addDays(start, duration - 1);
    case "weeks":
      return addDays(start, duration * 7 - 1);
    case "months":
      return addDays(addMonths(start, duration), -1);
    case "years":
      return addDays(addYears(start, duration), -1);
    default:
      return addDays(start, duration - 1);
  }
}

function generateDailyTasks(start: Date, endDate: Date): TaskDate[] {
  const tasks: TaskDate[] = [];
  // First task is on COMPLETION of first occurrence (start + 1 day)
  let currentDate = addDays(normalizeToLocalMidnight(start), 1);
  let order = 0;
  
  while (currentDate.getTime() <= endDate.getTime() && order < 1000) {
    tasks.push({ date: new Date(currentDate), order: order++ });
    currentDate = addDays(currentDate, 1);
  }
  
  return tasks;
}

function generateWeeklyTasks(start: Date, endDate: Date): TaskDate[] {
  const tasks: TaskDate[] = [];
  // First task is on COMPLETION of first occurrence (start + 7 days)
  let currentDate = addDays(normalizeToLocalMidnight(start), 7);
  let order = 0;
  
  while (currentDate.getTime() <= endDate.getTime() && order < 1000) {
    tasks.push({ date: new Date(currentDate), order: order++ });
    currentDate = addDays(currentDate, 7);
  }
  
  return tasks;
}

function generateSemiWeeklyTasks(start: Date, endDate: Date): TaskDate[] {
  const tasks: TaskDate[] = [];
  // First task is on COMPLETION of first occurrence (start + 3 days, then alternate 4/3)
  let currentDate = addDays(normalizeToLocalMidnight(start), 3);
  let order = 0;
  let useFourDays = true; // After first 3-day gap, alternate with 4 days
  
  while (currentDate.getTime() <= endDate.getTime() && order < 1000) {
    tasks.push({ date: new Date(currentDate), order: order++ });
    currentDate = addDays(currentDate, useFourDays ? 4 : 3);
    useFourDays = !useFourDays;
  }
  
  return tasks;
}

function generateMonthlyTasks(start: Date, endDate: Date): TaskDate[] {
  const tasks: TaskDate[] = [];
  // First task is on COMPLETION of first occurrence (start + 1 month)
  let currentDate = addMonths(normalizeToLocalMidnight(start), 1);
  let order = 0;
  
  while (currentDate.getTime() <= endDate.getTime() && order < 1000) {
    tasks.push({ date: new Date(currentDate), order: order++ });
    currentDate = addMonths(currentDate, 1);
  }
  
  return tasks;
}

function generateSemiMonthlyTasks(start: Date, endDate: Date): TaskDate[] {
  const tasks: TaskDate[] = [];
  let order = 0;
  
  // Semi-monthly: 1st & 16th of each month
  // First task is the NEXT 1st or 16th AFTER start date (completion of first occurrence)
  const startNorm = normalizeToLocalMidnight(start);
  let year = startNorm.getFullYear();
  let month = startNorm.getMonth();
  const startDay = startNorm.getDate();
  
  // Find the first task date (next 1st or 16th strictly after start)
  let firstTaskDate: Date;
  if (startDay < 16) {
    // Next occurrence is the 16th of this month
    firstTaskDate = new Date(year, month, 16);
  } else {
    // Next occurrence is the 1st of next month
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    firstTaskDate = new Date(year, month, 1);
  }
  
  // Generate tasks starting from first task date
  let currentYear = firstTaskDate.getFullYear();
  let currentMonth = firstTaskDate.getMonth();
  let currentDay = firstTaskDate.getDate(); // Either 1 or 16
  
  while (order < 1000) {
    const taskDate = new Date(currentYear, currentMonth, currentDay);
    if (taskDate.getTime() > endDate.getTime()) break;
    
    tasks.push({ date: normalizeToLocalMidnight(taskDate), order: order++ });
    
    // Alternate between 1st and 16th
    if (currentDay === 1) {
      currentDay = 16;
    } else {
      currentDay = 1;
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }
  }
  
  return tasks;
}

export function generateTaskDates(
  startDate: Date,
  duration: number,
  durationUnit: DurationUnit,
  recurrence: Recurrence
): TaskDate[] {
  if (duration <= 0) {
    return [];
  }
  
  const start = normalizeToLocalMidnight(startDate);
  const endDate = calculateEndDate(start, duration, durationUnit);
  
  switch (recurrence) {
    case "daily":
      return generateDailyTasks(start, endDate);
    case "weekly":
      return generateWeeklyTasks(start, endDate);
    case "semi-weekly":
      return generateSemiWeeklyTasks(start, endDate);
    case "monthly":
      return generateMonthlyTasks(start, endDate);
    case "semi-monthly":
      return generateSemiMonthlyTasks(start, endDate);
    default:
      return generateDailyTasks(start, endDate);
  }
}

export function validateDreamFields(data: {
  title?: string;
  description?: string;
  duration?: number;
  durationUnit?: string;
  recurrence?: string;
  startDate?: string | Date;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.title || typeof data.title !== "string") {
    errors.push("Dream name is required");
  } else if (data.title.length > 24) {
    errors.push("Dream name must be 24 characters or less");
  }
  
  if (data.description && typeof data.description === "string" && data.description.length > 60) {
    errors.push("Description must be 60 characters or less");
  }
  
  if (data.duration !== undefined) {
    if (typeof data.duration !== "number" || data.duration <= 0 || !Number.isInteger(data.duration)) {
      errors.push("Duration must be a positive integer");
    }
  }
  
  const validUnits = ["days", "weeks", "months", "years"];
  if (data.durationUnit && !validUnits.includes(data.durationUnit)) {
    errors.push("Duration unit must be days, weeks, months, or years");
  }
  
  const validRecurrences = ["daily", "weekly", "semi-weekly", "monthly", "semi-monthly"];
  if (data.recurrence && !validRecurrences.includes(data.recurrence)) {
    errors.push("Recurrence must be daily, weekly, semi-weekly, monthly, or semi-monthly");
  }
  
  if (data.startDate) {
    const startDate = typeof data.startDate === "string" ? new Date(data.startDate) : data.startDate;
    const today = normalizeToLocalMidnight(new Date());
    const startNormalized = normalizeToLocalMidnight(startDate);
    
    if (startNormalized.getTime() < today.getTime()) {
      errors.push("Start date cannot be in the past");
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

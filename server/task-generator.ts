type DurationUnit = "days" | "weeks" | "months" | "years";
type Recurrence = "daily" | "weekly" | "bi-weekly" | "monthly" | "bi-monthly";

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
      return addDays(start, duration);
    case "weeks":
      return addDays(start, duration * 7);
    case "months":
      return addMonths(start, duration);
    case "years":
      return addYears(start, duration);
    default:
      return addDays(start, duration);
  }
}

function getNextTaskDate(
  currentDate: Date,
  recurrence: Recurrence
): Date {
  const current = normalizeToLocalMidnight(currentDate);
  
  switch (recurrence) {
    case "daily":
      return addDays(current, 1);
    case "weekly":
      return addDays(current, 7);
    case "bi-weekly":
      return addDays(current, 14);
    case "monthly":
      return addMonths(current, 1);
    case "bi-monthly":
      return addMonths(current, 2);
    default:
      return addDays(current, 1);
  }
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
  
  const tasks: TaskDate[] = [];
  let currentDate = start;
  let order = 0;
  
  while (currentDate.getTime() <= endDate.getTime()) {
    tasks.push({
      date: new Date(currentDate),
      order: order++,
    });
    
    currentDate = getNextTaskDate(currentDate, recurrence);
    
    if (order > 1000) {
      break;
    }
  }
  
  return tasks;
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
  
  const validRecurrences = ["daily", "weekly", "bi-weekly", "monthly", "bi-monthly"];
  if (data.recurrence && !validRecurrences.includes(data.recurrence)) {
    errors.push("Recurrence must be daily, weekly, bi-weekly, monthly, or bi-monthly");
  }
  
  if (data.startDate) {
    const startDate = typeof data.startDate === "string" ? new Date(data.startDate) : data.startDate;
    const today = normalizeToLocalMidnight(new Date());
    const startNormalized = normalizeToLocalMidnight(startDate);
    
    if (startNormalized.getTime() < today.getTime()) {
      errors.push("Start date cannot be in the past");
    }
  }
  
  if (data.duration && data.durationUnit && data.recurrence) {
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

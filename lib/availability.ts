import {
  addMinutes,
  format,
  isAfter,
  isBefore,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface BlockedSlot {
  start: Date;
  end: Date;
  reason?: string;
}

export interface Appointment {
  id: string;
  startTime: Date;
  endTime: Date;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

/**
 * Generate available time slots for a given date based on working hours,
 * existing appointments, and blocked times
 */
export function generateTimeSlots(
  date: Date,
  workingHours: WorkingHours[],
  appointments: Appointment[],
  blockedSlots: BlockedSlot[],
  slotDurationMinutes: number = 60,
  bufferMinutes: number = 15
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const todayWorkingHours = workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

  if (!todayWorkingHours) {
    return []; // Not a working day
  }

  const slots: TimeSlot[] = [];
  const [startHour, startMin] = todayWorkingHours.startTime.split(":").map(Number);
  const [endHour, endMin] = todayWorkingHours.endTime.split(":").map(Number);

  let currentSlotStart = setMinutes(setHours(startOfDay(date), startHour), startMin);
  const dayEnd = setMinutes(setHours(startOfDay(date), endHour), endMin);

  while (isBefore(addMinutes(currentSlotStart, slotDurationMinutes), dayEnd) || 
         currentSlotStart.getTime() + slotDurationMinutes * 60000 === dayEnd.getTime()) {
    const slotEnd = addMinutes(currentSlotStart, slotDurationMinutes);
    
    // Check if slot conflicts with existing appointments
    const hasAppointmentConflict = appointments.some((apt) => {
      if (apt.status === "cancelled") return false;
      const aptStart = new Date(apt.startTime);
      const aptEnd = addMinutes(new Date(apt.endTime), bufferMinutes);
      return (
        (isAfter(currentSlotStart, aptStart) && isBefore(currentSlotStart, aptEnd)) ||
        (isAfter(slotEnd, aptStart) && isBefore(slotEnd, aptEnd)) ||
        (isBefore(currentSlotStart, aptStart) && isAfter(slotEnd, aptEnd)) ||
        currentSlotStart.getTime() === aptStart.getTime()
      );
    });

    // Check if slot conflicts with blocked times
    const isBlocked = blockedSlots.some((blocked) => {
      const blockedStart = new Date(blocked.start);
      const blockedEnd = new Date(blocked.end);
      return (
        (isAfter(currentSlotStart, blockedStart) && isBefore(currentSlotStart, blockedEnd)) ||
        (isAfter(slotEnd, blockedStart) && isBefore(slotEnd, blockedEnd)) ||
        (isBefore(currentSlotStart, blockedStart) && isAfter(slotEnd, blockedEnd)) ||
        currentSlotStart.getTime() === blockedStart.getTime()
      );
    });

    // Check if slot is in the past
    const isPast = isBefore(currentSlotStart, new Date());

    slots.push({
      start: currentSlotStart,
      end: slotEnd,
      available: !hasAppointmentConflict && !isBlocked && !isPast,
    });

    currentSlotStart = slotEnd;
  }

  return slots;
}

/**
 * Format time slot for display
 */
export function formatTimeSlot(slot: TimeSlot): string {
  return `${format(slot.start, "h:mm a")} - ${format(slot.end, "h:mm a")}`;
}

/**
 * Get next available slot for an expert
 */
export function getNextAvailableSlot(
  slots: TimeSlot[],
  fromDate: Date = new Date()
): TimeSlot | null {
  return (
    slots.find(
      (slot) => slot.available && isAfter(slot.start, fromDate)
    ) || null
  );
}

/**
 * Calculate wellness score from daily check-in answers
 */
export function calculateWellnessScore(
  answers: { category: string; value: number }[]
): number {
  if (answers.length === 0) return 0;

  const categoryWeights: Record<string, number> = {
    physical: 0.25,
    mental: 0.25,
    sleep: 0.2,
    diet: 0.15,
    social: 0.15,
  };

  let totalScore = 0;
  let totalWeight = 0;

  answers.forEach((answer) => {
    const weight = categoryWeights[answer.category] || 0.2;
    totalScore += answer.value * weight;
    totalWeight += weight;
  });

  return Math.round((totalScore / totalWeight) * 20); // Scale to 0-100
}

/**
 * Parse time string to Date object for a given date
 */
export function parseTimeString(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(":").map(Number);
  return setMinutes(setHours(startOfDay(date), hours), minutes);
}

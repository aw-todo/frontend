import { format, addDays, parseISO, differenceInDays } from "date-fns";

export const generateDateRange = (
  startDate: string,
  endDate: string,
): string[] => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const days = differenceInDays(end, start);
  const dates: string[] = [];

  for (let i = 0; i <= days; i++) {
    const currentDate = addDays(start, i);
    dates.push(format(currentDate, "yyyy-MM-dd"));
  }

  return dates;
};

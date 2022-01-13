import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

// extend dayjs functionality to use ordinal suffix and relative time
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

type DayJSDate = string | number | dayjs.Dayjs | Date | null | undefined;

const advancedDayjs = dayjs;
export { advancedDayjs };

export const checkIsToday = (date: DayJSDate) => {
  return advancedDayjs().isSame(advancedDayjs(date), "day");
};

export const checkIsYesterday = (date: DayJSDate) => {
  return advancedDayjs().add(-1, "day").isSame(advancedDayjs(date), "day");
};

export const checkIsOverdue = (date: DayJSDate) => {
  return advancedDayjs().isAfter(advancedDayjs(date), "day");
};

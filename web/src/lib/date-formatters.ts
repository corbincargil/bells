function relativeTime(date: Date | string): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();

  const rtf = new Intl.RelativeTimeFormat("en", { style: "short" });

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) return rtf.format(-diffInYears, "year");
  if (diffInMonths > 0) return rtf.format(-diffInMonths, "month");
  if (diffInWeeks > 0) return rtf.format(-diffInWeeks, "week");
  if (diffInDays > 0) return rtf.format(-diffInDays, "day");
  if (diffInHours > 0) return rtf.format(-diffInHours, "hour");
  if (diffInMinutes > 0) return rtf.format(-diffInMinutes, "minute");
  if (diffInSeconds > 0) return rtf.format(-diffInSeconds, "second");

  return "just now";
}

const fullDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default {
  relativeTime,
  fullDateTime,
};

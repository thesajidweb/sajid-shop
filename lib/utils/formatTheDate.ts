type DateFormatType = "date" | "date-time";

export const formatTheDate = (
  date?: Date | string,
  type: DateFormatType = "date",
  locale: string = "en-US",
): string => {
  if (!date) return "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  const options: Intl.DateTimeFormatOptions =
    type === "date"
      ? {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }
      : {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };

  return parsedDate.toLocaleString(locale, options);
};

// formatDate("2026-01-29T10:15:30.000Z");
// return.. Jan 29, 2026
//.........................................

// formatDate("2026-01-29T10:15:30.000Z", "date-time");
// return.. Jan 29, 2026, 10:15 AM
//.......................................

// formatDate("2026-01-29T10:15:30.000Z", "date");
// return.. Jan 29, 2026
//....................................

// formatDate("2026-01-29T10:15:30.000Z", "date-time", "en-GB");
// return.. 29 Jan 2026, 10:15 AM

// formatDate("2026-01-29T10:15:30.000Z", "date", "ur-PK");
// return..۲۹ جنوری ۲۰۲۶

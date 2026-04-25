"use client";

interface CustomSelectorsProps {
  activeTab: string;
  customYear: number;
  customMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onFetchCustom: (type: "month" | "year") => void;
}

export function CustomSelectors({
  activeTab,
  customYear,
  customMonth,
  onYearChange,
  onMonthChange,
  onFetchCustom,
}: CustomSelectorsProps) {
  if (activeTab !== "month" && activeTab !== "year") return null;

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 p-2 md:p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <div className="flex-1">
        <label className="block p-text font-medium text-slate-700 dark:text-slate-300 mb-2">
          Custom Month:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={customYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className=" p-text flex w-25 md:w-25 lg:auto border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            placeholder="Year"
          />
          <input
            type="number"
            value={customMonth}
            min={1}
            max={12}
            onChange={(e) => onMonthChange(parseInt(e.target.value))}
            className=" p-text flex-1 w-15 md:w-18 lg:auto border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            placeholder="Month"
          />
          <button
            onClick={() => onFetchCustom("month")}
            className="p-text px-3 py-1 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            Go
          </button>
        </div>
      </div>
      <div className="flex-1">
        <label className="block p-text font-medium text-slate-700 dark:text-slate-300 mb-2">
          Custom Year:
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={customYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className=" p-text flex-1 w-25 md:w-25 lg:auto border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            placeholder="Year"
          />
          <button
            onClick={() => onFetchCustom("year")}
            className="p-text px-3 py-1 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

function StatCard({
  title,
  value,
  icon,
  gradientFrom,
  gradientTo,
  borderColor,
}: StatCardProps) {
  return (
    <div
      className={`bg-linear-to-br from-${gradientFrom}-50 to-${gradientTo}-100 dark:from-${gradientFrom}-950/30 dark:to-${gradientTo}-900/30 rounded-xl p-2 sm:p-4 md:p-5 border border-${borderColor}-200 dark:border-${borderColor}-800`}
    >
      <p
        className={`text-sm text-${gradientFrom}-700 dark:text-${gradientFrom}-300 mb-1`}
      >
        {icon} {title}
      </p>
      <p
        className={`h2-text font-bold text-${gradientFrom}-900 dark:text-${gradientFrom}-100`}
      >
        {value}
      </p>
    </div>
  );
}

interface StatsGridProps {
  stats: Array<{
    title: string;
    value: string;
    icon: string;
    gradient: string;
  }>;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 ">
      {stats.map((stat, index) => {
        const gradients = [
          "emerald",
          "blue",
          "violet",
          "amber",
          "purple",
          "pink",
        ];
        const gradient = gradients[index % gradients.length];
        return (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradientFrom={gradient}
            gradientTo={gradient}
            borderColor={gradient}
          />
        );
      })}
    </div>
  );
}

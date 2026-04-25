import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  const colorClass = colors[color as keyof typeof colors] || colors.blue;

  return (
    <Card className="hover:shadow-md transition-shadow px-1 md:px-4 py-1">
      <CardContent className="p-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">
              {(value ?? 0).toLocaleString()}
            </p>
          </div>
          <div
            className={`h-10 w-10 rounded-full ${colorClass} flex items-center justify-center`}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import LowStockTableSkeleton from "./loading";
import { getLowStockProducts } from "@/lib/actions/analytics/lowstock";
import ErrorBox from "@/components/shared/ErrorBox";

const LOW_STOCK_COLUMNS = ["Product", "Color", "Size", "Stock", "Price"];

type LowStockItem = {
  name: string;
  color?: string;
  size?: string;
  stock: number;
  finalPrice: number;
};

const LowStockTable = async () => {
  // const res = await getLowStockProducts();
  // if (!res.success)
  //   return (
  //     <ErrorBox
  //       title="Failed to fetch low stock products"
  //       message={res.error}
  //     />
  //   );
  // const data: LowStockItem[] = res.data;
  // if (!res) return <LowStockTableSkeleton />;
  // return (
  //   <ScrollArea className="h-[60vh] rounded-md border border-border mb-4 lg:mb-8">
  //     <table className="min-w-full divide-y divide-border p-text">
  //       <thead className="bg-muted sticky top-0">
  //         <tr>
  //           {LOW_STOCK_COLUMNS.map((header) => (
  //             <th
  //               key={header}
  //               className="px-2 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
  //             >
  //               {header}
  //             </th>
  //           ))}
  //         </tr>
  //       </thead>
  //       <tbody className="bg-background divide-y divide-border">
  //         {data.map((item, idx) => (
  //           <tr
  //             key={idx}
  //             className={`${
  //               item.stock === 0 ? "bg-destructive/10" : ""
  //             } hover:bg-muted/50 transition-colors`}
  //           >
  //             <td className="px-2 py-1 font-medium text-foreground">
  //               {item.name}
  //             </td>
  //             <td className="px-2 py-1 text-muted-foreground">
  //               {item.color || "N/A"}
  //             </td>
  //             <td className="px-2 py-1 text-muted-foreground">
  //               {item.size || "N/A"}
  //             </td>
  //             <td className="px-6 py-4 font-medium">{item.stock}</td>
  //             <td className="px-6 py-4 text-foreground">
  //               {formatCurrency(item.finalPrice || 0)}
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </ScrollArea>
  // );
};

export default LowStockTable;

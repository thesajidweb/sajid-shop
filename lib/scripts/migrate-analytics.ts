// scripts/migrate-analytics.ts
// Run once to populate initial analytics
import { connectToDB } from "@/lib/db/connect";
import { DailyAnalytics, ProductStats } from "@/lib/models/Analytics";
import { Order } from "@/lib/models/Order";
import Product from "@/lib/models/Product";

async function migrate() {
  await connectToDB();

  console.log("Starting migration...");

  // Calculate totalStock for all products
  const products = await Product.find({});
  for (const product of products) {
    let totalStock = 0;
    if (product.variants) {
      for (const variant of product.variants) {
        for (const size of variant.sizes) {
          totalStock += size.stock;
        }
      }
    }
    await Product.updateOne({ _id: product._id }, { $set: { totalStock } });
  }
  console.log(`Updated ${products.length} products with totalStock`);

  // Build daily analytics from existing orders
  const orders = await Order.find({ orderStatus: "delivered" });
  const dailyMap = new Map();
  const productMap = new Map();

  for (const order of orders) {
    const date = order.createdAt.toISOString().split("T")[0];

    if (!dailyMap.has(date)) {
      dailyMap.set(date, { revenue: 0, orders: 0, profit: 0, productsSold: 0 });
    }

    const daily = dailyMap.get(date);
    daily.revenue += order.total;
    daily.orders += 1;
    daily.productsSold += order.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    );

    // Calculate profit
    let orderProfit = 0;
    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      const cost = product?.cost || 0;
      orderProfit += (item.price - cost) * item.quantity;

      // Product stats
      if (!productMap.has(item.productId)) {
        productMap.set(item.productId, { totalSold: 0, totalRevenue: 0 });
      }
      const prodStats = productMap.get(item.productId);
      prodStats.totalSold += item.quantity;
      prodStats.totalRevenue += item.price * item.quantity;
    }
    daily.profit += orderProfit;
  }

  // Save daily analytics
  for (const [date, data] of dailyMap) {
    await DailyAnalytics.updateOne({ date }, { $set: data }, { upsert: true });
  }
  console.log(`Created ${dailyMap.size} daily analytics records`);

  // Save product stats
  for (const [productId, stats] of productMap) {
    await ProductStats.updateOne(
      { productId },
      { $set: stats },
      { upsert: true },
    );
  }
  console.log(`Created ${productMap.size} product stats records`);

  console.log("Migration complete!");
}

migrate().then(() => process.exit(0));

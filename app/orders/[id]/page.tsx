import { getOrderDetail } from "@/lib/actions/order/getOrderDetails";
import OrderConfirmationPage from "../../../components/storefront/orderDetails/OrderConfirmation";

import ErrorBox from "@/components/shared/ErrorBox";

import { OrderType } from "@/lib/types/order";

const OrderDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const res = await getOrderDetail(id);
  if (!res.success) {
    return (
      <ErrorBox title="Failed to fetch order details" message={res.error} />
    );
  }
  const data: OrderType = res.data;
  return (
    <div>
      <OrderConfirmationPage orderData={data} header={false} />
    </div>
  );
};

export default OrderDetails;

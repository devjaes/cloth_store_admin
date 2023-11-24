import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      OrderItem: {
        include: {
          orderProductSizes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    name: item.clientName,
    lastname: item.clientLastName,
    email: item.clientEmail,
    products: item.OrderItem.map((orderItem) => orderItem.productName).join(
      ", "
    ),
    sizes: item.OrderItem.map((orderItem) =>
      orderItem.orderProductSizes.map(
        (size) => size.sizeName + ":(" + size.quantity + ")"
      )
    ).join(", "),
    totalPrice: formatter.format(item.total),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;

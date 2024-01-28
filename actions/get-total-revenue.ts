import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
    },
    include: {
      OrderItem: {
        include: {
          orderProductSizes: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    return order.total;
  }, 0);

  return totalRevenue;
};

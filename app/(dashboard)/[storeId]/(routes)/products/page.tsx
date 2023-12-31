import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter, toSpanishDate } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      sizes: {
        include: {
          size: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = await Promise.all(
    products.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        isFeatured: item.isFeatured ? "Si" : "No",
        isArchived: item.isArchived ? "Si" : "No",
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        sizes: item.sizes
          .filter((size) => size.quantity > 0)
          .map((size) => " " + size.size.value + ":(" + size.quantity + ")"),
        createdAt: toSpanishDate(item.createdAt),
      };
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;

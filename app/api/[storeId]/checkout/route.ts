import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string;
  isFeatured: boolean;
  sizes: ProductSize[];
  images: Image[];
}

export interface ProductToBuy {
  product: Product;
  selectedSizes: { size: Size; quantity: number }[];
  totalPrice: number;
}

export interface Image {
  id: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface ProductSize {
  id: string;
  size: Size;
  quantity: number;
}

interface OrderRegistration {
  productsToBuy: ProductToBuy[];
  total: number;
  clientName: string;
  clientLastName: string;
  clientEmail: string;
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { orderRegistration } = (await req.json()) as {
    orderRegistration: OrderRegistration;
  };

  if (!orderRegistration || orderRegistration.productsToBuy.length === 0) {
    return new NextResponse("Order registartion is required", { status: 400 });
  }

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      clientName: orderRegistration.clientName,
      clientLastName: orderRegistration.clientLastName,
      clientEmail: orderRegistration.clientEmail,
      total: orderRegistration.total,
      OrderItem: {
        create: orderRegistration.productsToBuy.map(
          (productToBuy: ProductToBuy) => ({
            productName: productToBuy.product.name,
            orderProductSizes: {
              create: productToBuy.selectedSizes.map(
                (selectedSize: { size: Size; quantity: number }) => ({
                  sizeName: selectedSize.size.name,
                  quantity: selectedSize.quantity,
                })
              ),
            },
          })
        ),
      },
    },
  });

  return NextResponse.json(
    { order },
    {
      headers: corsHeaders,
    }
  );
}

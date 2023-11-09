import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { productId, sizeId, quantity } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!productId) {
        return new NextResponse("Product id is required", { status: 400 });
        }

    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    if (!quantity) {
      return new NextResponse("Quantity is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const product_size = await prismadb.product_Sizes.create({
      data: {
        productId,
        sizeId,
        quantity: Number(quantity),
      },
    });
  
    return NextResponse.json(product_size);
  } catch (error) {
    console.log('[PRODUCTS_SIZE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get('productId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const quantity = searchParams.get('quantity') || undefined;

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products_sizes = await prismadb.product_Sizes.findMany({
      where: {
        productId,
        sizeId,
        quantity: Number(quantity),
      },
      include: {
        product: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });
  
    return NextResponse.json(products_sizes);
  } catch (error) {
    console.log('[PRODUCTS_SIZES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

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

    const { productsIds, sizesIds } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!productsIds) {
        return new NextResponse("Products ids are required", { status: 400 });
        }

    if (!sizesIds) {
        return new NextResponse("Sizes ids are required", { status: 400 });
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

    const product_size = await prismadb.product_Sizes.createMany({
        data: productsIds.map((productId: string) => {
            return sizesIds.map((sizeId: string) => {
                return {
                    productId,
                    sizeId,
                    quantity: 4,
                }
            })
        }).flat(),
    });
  
    return NextResponse.json(product_size);
  } catch (error) {
    console.log('[PRODUCTS_SIZE_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
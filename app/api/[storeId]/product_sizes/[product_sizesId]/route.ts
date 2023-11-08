import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { product_sizeId: string } }
) {
  try {
    if (!params.product_sizeId) {
      return new NextResponse("Product_size id is required", { status: 400 });
    }

    const product = await prismadb.product_Sizes.findUnique({
      where: {
        id: params.product_sizeId
      },
      include: {
        product: true,
        size: true,
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_SIZE_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { product_sizeId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.product_sizeId) {
      return new NextResponse("Product_size id is required", { status: 400 });
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

    const product = await prismadb.product_Sizes.delete({
      where: {
        id: params.product_sizeId,
      },
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_SIZE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { product_sizeId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { productId, sizeId, quantity } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.product_sizeId) {
      return new NextResponse("Product_size id is required", { status: 400 });
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

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    await prismadb.product_Sizes.update({
      where: {
        id: params.product_sizeId
      },
      data: {
        productId,
        sizeId,
        quantity: Number(quantity),
      },
    });

    const product_size = await prismadb.product_Sizes.update({
      where: {
        id: params.product_sizeId
      },
      data: {
        updatedAt: new Date(),
        },
    })
  
    return NextResponse.json(product_size);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

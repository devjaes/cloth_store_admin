import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { getPublicId } from "@/lib/utils";
import cloudinary from "@/lib/cloudinary";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
      },
      include: {
        images: true,
        category: true,
        sizes: {
          include: {
            size: true,
          }
        },
      }
    });
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
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

    const product_sizes = await prismadb.product_Sizes.deleteMany({
      where: {
        productId: params.productId
      }
    });

    const images = await prismadb.image.findMany({
      where: {
        productId: params.productId
      }
    });

    if (images.length > 0) {

      const imagesPublicIds = images.map((image) => getPublicId(image.url));
  
      await cloudinary.api.delete_resources(imagesPublicIds);

    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId
      },
    });
  
    return NextResponse.json(product  && product_sizes);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { productId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, price, categoryId, images, sizes, isFeatured, isArchived } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category id is required", { status: 400 });
    }

    if (!sizes) {
      return new NextResponse("Sizes is required", { status: 400 });
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

    const previousImages = await prismadb.image.findMany({
      where: {
        productId: params.productId
      }
    });

    const previousImagesPublicIds = previousImages.map((image) => getPublicId(image.url));
    const imagesPublicIds = images.map((image: {url:string}) => getPublicId(image.url));
    const imagesPublicIdsToDelete = previousImagesPublicIds.filter((imagePublicId) => !imagesPublicIds.includes(imagePublicId));

    if (imagesPublicIdsToDelete.length > 0) {  
      await cloudinary.api.delete_resources(imagesPublicIdsToDelete);

    }

    await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        name,
        price,
        categoryId,
        sizes: {
          deleteMany: {}
        },
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId
      },
      data: {
        images: {
          createMany: {
            data: [
              ...images.map((image: { url: string }) => image),
            ],
          },
        },
        sizes: {
          createMany: {
            data: [
              ...sizes.map((size: { sizeId: string, quantity: number }) => ({
                sizeId: size.sizeId,
                quantity: size.quantity,
              })),
            ],
          },
        },
      },
    })
  
    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

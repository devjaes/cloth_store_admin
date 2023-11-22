"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Category, Image, Product, Product_Sizes, Size } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Label } from "@/components/ui/label";
import { IntegerInput } from "@/components/ui/integer-input";
import { TextArea } from "@/components/ui/tex-area";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizes: z
    .object({ sizeId: z.string(), quantity: z.coerce.number().min(0) })
    .array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
        sizes: Product_Sizes[];
      })
    | null;
  categories: Category[];
  sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar producto" : "Crear producto";
  const description = initialData
    ? "Cambia o modifica los valores que quieras actualizar."
    : "Añade un nuevo producto a tu tienda.";
  const toastMessage = initialData
    ? "Producto modificado."
    : "Producto creado.";
  const action = initialData ? "Guardar cambios" : "Crear";

  const defaultValues = initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)),
      }
    : {
        name: "",
        description: "",
        images: [],
        price: 0,
        categoryId: "",
        sizes: sizes.map((size) => ({ sizeId: size.id, quantity: 0 })),
        isFeatured: false,
        isArchived: false,
      };

  const [selectSizes, setSelectSizes] = useState<
    { sizeId: string; quantity: number }[]
  >(defaultValues.sizes);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/products`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted.");
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagenes</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Product name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <TextArea
                      disabled={loading}
                      placeholder="Descripción del producto"
                      rows={10}
                      cols={20}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Selecciona una categoría"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tallas
                    {selectSizes.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {" (" +
                          selectSizes.filter((size) => size.quantity > 0)
                            .length +
                          ")"}
                      </span>
                    )}
                  </FormLabel>

                  <FormControl>
                    <Dialog onOpenChange={() => setSelectSizes(field.value)}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center justify-between">
                          Seleccionar Tallas
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        style={{ width: "fit-content", maxWidth: "100%" }}
                      >
                        <DialogTitle className="mt-6">
                          Seleccione las tallas
                        </DialogTitle>
                        <DialogDescription>
                          Ingrese el stock por tallas
                        </DialogDescription>
                        {sizes.map((size) => (
                          <div
                            key={size.id}
                            className="flex flex-row items-center justify-between"
                          >
                            <Label key={size.id} className="">
                              {size.name}
                            </Label>

                            <IntegerInput
                              min="0"
                              maxIntegerValue={9999}
                              step="1"
                              placeholder="0"
                              disabled={loading}
                              value={
                                field.value.find(
                                  (current) => current.sizeId === size.id
                                )?.quantity
                              }
                              className="ml-3 px-3 w-20"
                              onChange={(e) => {
                                const newSizes = selectSizes.map((current) => {
                                  if (current.sizeId === size.id) {
                                    return {
                                      sizeId: size.id,
                                      quantity: parseInt(e.target.value),
                                    };
                                  }
                                  return current;
                                });

                                setSelectSizes(newSizes);
                              }}
                            />
                          </div>
                        ))}
                        <DialogClose>
                          <Button
                            onClick={() => {
                              field.onChange(
                                selectSizes as {
                                  sizeId: string;
                                  quantity: number;
                                }[]
                              );

                              setSelectSizes(field.value);
                            }}
                          >
                            Guardar
                          </Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Destacado</FormLabel>
                    <FormDescription>
                      Este producto aparecerá en la sección de destacados.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archivado</FormLabel>
                    <FormDescription>
                      Este producto no aparecerá en la tienda.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

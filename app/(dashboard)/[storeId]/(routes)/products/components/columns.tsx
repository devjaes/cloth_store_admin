"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ProductColumn = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  sizes: string[];
  createdAt: string;
  isFeatured: string;
  isArchived: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "isArchived",
    header: "Archivado",
  },
  {
    accessorKey: "isFeatured",
    header: "Destacado",
  },
  {
    accessorKey: "price",
    header: "Precio",
  },
  {
    accessorKey: "category",
    header: "Categoría",
  },
  {
    accessorKey: "sizes",
    header: "Tallas en stock",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
  {
    accessorKey: "description",
    header: "Descripción",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

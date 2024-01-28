"use client";

import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type CategoryColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de creación",
  },
  {
    id: "acciones",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

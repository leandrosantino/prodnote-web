import { ProductionRegistry } from "@/entities/ProductionRegistry";
import { ColumnDef } from "@tanstack/react-table";

export const tableColumns: ColumnDef<ProductionRegistry>[] = [
  {
    accessorKey: "created_at",
    header: () => <div className='w-32' >Data</div>,
    cell: ({row}) => <div className='w-32'>{(row.getValue('created_at') as Date).toLocaleDateString()}</div>,
    filterFn: (row, columnId, filterValue) =>{
      const rowValue = row.getValue(columnId) as Date;
      const dataLinha = new Date(rowValue);
      const dataFiltro = new Date(filterValue);
      return dataLinha.toDateString() === dataFiltro.toDateString();
    }
  },
  {
    accessorKey: "turn",
    header: () => <div className='min-w-20 w-full' >Turno</div>,
    cell: ({row}) => <div className='min-w-20 w-full'>{row.getValue('turn')}</div>
  },
  {
    accessorKey: "ute",
    header: () => <div className='min-w-20' >UTE</div>,
    cell: ({row}) => <div className='min-w-20'>{row.original.process.ute}</div>
  },
  {
    accessorKey: "time_tag",
    header: () => <div className='min-w-32' >Hora</div>,
    cell: ({row}) => <div className='min-w-32'>{row.getValue('time_tag')}</div>
  },
  {
    accessorKey: "process_id",
    header: () => <div className='w-56' >Processo</div>,
    cell: ({row}) => <div className='w-56'>{row.original.process.description}</div>
  },
  {
    accessorKey: "pieces_quantity",
    header: () => <div className='min-w-28' >Peças Boas</div>,
    cell: ({row}) => <div className='min-w-28'>{row.getValue('pieces_quantity')}</div>
  },
  {
    accessorKey: "oee",
    header: () => <div className='min-w-28' >OEE</div>,
    cell: ({row}) => <div className='min-w-28'>{(Number(row.getValue('oee')) * 100).toFixed(0) + '%'}</div>
  },
];

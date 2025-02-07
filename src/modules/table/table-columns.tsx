import { EfficiencyRecord } from "@/entities/EfficiencyRecord";
import { ColumnDef } from "@tanstack/react-table";

export const columnsViewNames = {
  'created_time' :'Data/Hora',
  'display_name' :'Usuário',
  'registration' :'Matrícula',
  'seq' :'Serial',
  'count' :'Seq',
  'amount' :'Quantidade',
}

export const tableColumns: ColumnDef<EfficiencyRecord>[] = [
  {
    accessorKey: "date",
    header: () => <div className='w-32' >Data</div>,
    cell: ({row}) => <div className='w-32'>{(row.getValue('date') as Date).toLocaleDateString()}</div>
  },
  {
    accessorKey: "turn",
    header: () => <div className='min-w-20 w-full' >Turno</div>,
    cell: ({row}) => <div className='min-w-20 w-full'>{row.getValue('turn')}</div>
  },
  {
    accessorKey: "ute",
    header: () => <div className='min-w-20' >UTE</div>,
    cell: ({row}) => <div className='min-w-20'>{row.getValue('ute')}</div>
  },
  {
    accessorKey: "hourInterval",
    header: () => <div className='min-w-32' >Hora</div>,
    cell: ({row}) => <div className='min-w-32'>{row.getValue('hourInterval')}</div>
  },
  {
    accessorKey: "productionProcessId",
    header: () => <div className='w-56' >Processo</div>,
    cell: ({row}) => <div className='w-56'>{row.getValue('productionProcessId')}</div>
  },
  {
    accessorKey: "piecesQuantity",
    header: () => <div className='min-w-28' >Peças Boas</div>,
    cell: ({row}) => <div className='min-w-28'>{row.getValue('piecesQuantity')}</div>
  },
  {
    accessorKey: "oeeValue",
    header: () => <div className='min-w-28' >OEE</div>,
    cell: ({row}) => <div className='min-w-28'>{(Number(row.getValue('oeeValue')) * 100).toFixed(0) + '%'}</div>
  },
];

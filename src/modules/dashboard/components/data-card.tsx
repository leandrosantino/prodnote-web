import { LucideIcon } from "lucide-react";

type props = {
  label: string
  value: string
  Icon: LucideIcon
}

export function DataCard({ Icon, label, value }: props) {
  return (
    <div className="w-full min-h-[100px] max-h-[100px] h-full border rounded-lg p-3 flex gap-1 text-zinc-700 shadow" >
      <div className="w-5/6 flex flex-col justify-start items-center font-medium" >
        <span className="w-full" >{label}</span>
        <span className="w-full h-full flex justify-start items-center text-3xl">{value}</span>
      </div>
      <div className="w-1/6 flex justify-center items-center">
        <span ><Icon size={40} /></span>
      </div>
    </div>
  )
}

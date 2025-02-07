import { Loading } from "@/components/Loading";
import { ReactNode } from "react";

export function Container({children, loading}: {children: ReactNode, loading: boolean}) {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-md min-h-full flex flex-col" >
      {loading?<>
        <span className="m-auto inset-0" >
          <Loading />
        </span>
      </>:children}
    </div>
  )
}

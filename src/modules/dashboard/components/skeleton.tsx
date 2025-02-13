import { Skeleton } from "@/components/ui/skeleton";

export function ChartsSkeleton(){
  return <>
    <div className="w-full grid gap-2 grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <div>
        <Skeleton className="w-full h-[100px]" />
      </div>
      <div>
        <Skeleton className="w-full h-[100px]" />
      </div>
      <div>
        <Skeleton className="w-full h-[100px]" />
      </div>
      <div>
        <Skeleton className="w-full h-[100px]" />
      </div>
    </div>

    <div className="w-full grid grid-cols-[43%_auto] grid-rows-[380px] gap-2 max-lg:grid-cols-1">
      <div className="">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="">
      <Skeleton className="w-full h-full" />
      </div>
    </div>

    <div className="w-full h-[250px]" >
      <Skeleton className="w-full h-full" />
    </div>
  </>
}

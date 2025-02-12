import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { category: "MOLDAGEM M15", oee: 0.5, fill: 'hsl(var(--chart-1))' },
  { category: "MOLDAGEM M51", oee: 0.6, fill: 'hsl(var(--chart-1))' },
  { category: "ACOPLAGEM M19", oee: 0.65, fill: 'hsl(var(--chart-1))' },
  { category: "ACOPLAGEM M20", oee: 0.74, fill: 'hsl(var(--chart-1))' },
  { category: "MONTAGEM 521", oee:0.75, fill: 'hsl(var(--chart-1))' },
]

export type TopFiveProcessChartData = {
  category: string;
  oee: number;
  fill: string;
}

export function TopFiveProcessChart({data}: {data: TopFiveProcessChartData[]}) {

  const categories: Record<string, {label: string}> = {}
  data.forEach(item => { categories[item.category] = {label: item.category} })
  const chartConfig = { oee: { label: "OEE" }, ...categories} satisfies ChartConfig

  return (
    <Card className="h-full w-full rounded-md">
      <CardHeader>
        <CardTitle>Top 5 - menor eficiência</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[320px]  w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 50,
              right: 50,
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              className="text-[.8rem] font-medium"
              tickMargin={0}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="oee" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                valueFormat={(value: string) => `${(Number(value.replace(',', '.'))* 100).toFixed(0)}%`}
              />}
            />
            <Bar dataKey="oee" layout="vertical" radius={5} >
              <LabelList
                style={{ fontWeight: 500, fontSize: '.9rem'}}
                dataKey="oee" position="right"
                formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

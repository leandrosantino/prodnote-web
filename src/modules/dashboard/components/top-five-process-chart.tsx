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
  { category: "MOLDAGEM M15", hours: 27, fill: 'hsl(var(--chart-1))' },
  { category: "MOLDAGEM M51", hours: 20, fill: 'hsl(var(--chart-1))' },
  { category: "ACOPLAGEM M19", hours: 18, fill: 'hsl(var(--chart-1))' },
  { category: "ACOPLAGEM M20", hours: 17, fill: 'hsl(var(--chart-1))' },
  { category: "MONTAGEM 521", hours: 9, fill: 'hsl(var(--chart-1))' },
]

const chartConfig = {
  hours: {
    label: "Horas",
  },
  'MOLDAGEM M15' : { label: 'MOLDAGEM M15'  },
  'MOLDAGEM M51' : { label: 'MOLDAGEM M51'  },
  'ACOPLAGEM M19': { label: 'ACOPLAGEM M19' },
  'ACOPLAGEM M20': { label: 'ACOPLAGEM M20' },
  'MONTAGEM 521' : { label: 'MONTAGEM 521'  },
} satisfies ChartConfig

export function TopFiveProcessChart() {
  return (
    <Card className="h-full w-full rounded-md">
      <CardHeader>
        <CardTitle>Top 5 - menor eficiência</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[390px]  w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 30,
              right: 30,
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
            <XAxis dataKey="hours" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="hours" layout="vertical" radius={5} >
              <LabelList style={{ fontWeight: 500, fontSize: '.9rem'}}  dataKey="hours" position="right" formatter={(item: number) => item + ' h'} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

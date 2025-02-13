import { Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"
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

const chartConfig = {
  oee: {
    label: "OEE",
    color: "hsl(var(--primary))",
  },
  goal: {
    label: "Goal",
    color: "hsl(var(--destructive))",
  },

} satisfies ChartConfig

export type DailyChartData = {
  date: string;
  oee: number;
}

export function DailyChart({ data }: {data: DailyChartData[]}) {
  return (
    <Card className="max-h-full w-full rounded-md">
      <CardHeader>
        <CardTitle>OEE - Evolução Diária</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[160px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={8}
            />
            <YAxis hide domain={[0, 1]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent
                datatype="percent"
                indicator="line"
                labelFormatter={item => item + ' de Abril' }
                valueFormat={(value: string) => `${(Number(value.replace(',', '.'))* 100).toFixed(1)}%`}
              />}
            />
            <ReferenceLine
              y={0.83}
              stroke="var(--color-goal)"
              strokeDasharray="3 3"
              label={{ value: "Meta: 83%", position: "insideTopLeft", fill: "var(--color-goal)" }}
            />
            <Line
              dataKey="oee"
              type="natural"
              stroke="var(--color-oee)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-oee)",
              }}
              activeDot={{
                r: 6,
              }}
            >
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

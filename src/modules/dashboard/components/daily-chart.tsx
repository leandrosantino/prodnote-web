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

const chartData = [
  { date: "01", oee: 0.83 },
  { date: "02", oee: 0.45 },
  { date: "03", oee: 0.85 },
  { date: "04", oee: 0.89 },
  { date: "05", oee: 0.90 },
  { date: "06", oee: 0.58 },
  { date: "07", oee: 0.70 },
  { date: "08", oee: 0.35 },
  { date: "09", oee: 0.45 },
  { date: "10", oee: 0.78 },
  { date: "11", oee: 0.89 },
  { date: "12", oee: 0.92 },
  { date: "13", oee: 0.56 },
  { date: "14", oee: 0.45 },
  { date: "15", oee: 0.83 },
  { date: "16", oee: 0.85 },
  { date: "17", oee: 0.84 },
  { date: "18", oee: 0.83 },
  { date: "19", oee: 0.83 },
  { date: "20", oee: 0.69 },
  { date: "21", oee: 0.78 },
  { date: "22", oee: 0.79 },
  { date: "23", oee: 0.78 },
  { date: "24", oee: 0.83 },
  { date: "25", oee: 0.83 },
  { date: "26", oee: 0.78 },
  { date: "27", oee: 0.89 },
  { date: "28", oee: 0.45 },
  { date: "29", oee: 0.77 },
  { date: "30", oee: 0.89 },
  { date: "31", oee: 0.89 },
]

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

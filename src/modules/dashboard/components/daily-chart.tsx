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
  { date: "01", desktop: 0.83 },
  { date: "02", desktop: 0.45 },
  { date: "03", desktop: 0.85 },
  { date: "04", desktop: 0.89 },
  { date: "05", desktop: 0.90 },
  { date: "06", desktop: 0.58 },
  { date: "07", desktop: 0.70 },
  { date: "08", desktop: 0.35 },
  { date: "09", desktop: 0.45 },
  { date: "10", desktop: 0.78 },
  { date: "11", desktop: 0.89 },
  { date: "12", desktop: 0.92 },
  { date: "13", desktop: 0.56 },
  { date: "14", desktop: 0.45 },
  { date: "15", desktop: 0.83 },
  { date: "16", desktop: 0.85 },
  { date: "17", desktop: 0.84 },
  { date: "18", desktop: 0.83 },
  { date: "19", desktop: 0.83 },
  { date: "20", desktop: 0.69 },
  { date: "21", desktop: 0.78 },
  { date: "22", desktop: 0.79 },
  { date: "23", desktop: 0.78 },
  { date: "24", desktop: 0.83 },
  { date: "25", desktop: 0.83 },
  { date: "26", desktop: 0.78 },
  { date: "27", desktop: 0.89 },
  { date: "28", desktop: 0.45 },
  { date: "29", desktop: 0.77 },
  { date: "30", desktop: 0.89 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--primary))",
  },
  goal: {
    label: "Goal",
    color: "hsl(var(--destructive))",
  },

} satisfies ChartConfig

export function DailyChart() {
  return (
    <Card className="max-h-full w-full rounded-md">
      <CardHeader>
        <CardTitle>OEE - Evolução Diária</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[160px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
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

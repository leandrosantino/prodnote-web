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
  { category: "Ajsute de Parâmetro", hours: 27, fill: 'hsl(var(--chart-2))' },
  { category: "Setup", hours: 20, fill: 'hsl(var(--chart-2))' },
  { category: "Máquina quebrada", hours: 18, fill: 'hsl(var(--chart-2))' },
  { category: "Manutenção programada/preventiva", hours: 17, fill: 'hsl(var(--chart-2))' },
  { category: "Organização/Limpeza/Refeição", hours: 9, fill: 'hsl(var(--chart-2))' },
  { category: "Retrabalho", hours: 9, fill: 'hsl(var(--chart-2))' },
  { category: "Refugo", hours: 9, fill: 'hsl(var(--chart-2))' },
  { category: "RH", hours: 9, fill: 'hsl(var(--chart-2))' },
  { category: "Logística", hours: 9, fill: 'hsl(var(--chart-2))' },
  { category: "Eficiência Operacinal", hours: 9, fill: 'hsl(var(--chart-2))' },
]

const chartConfig = {
  hours: {
    label: "Horas",
  },
  'Ajsute de Parâmetro': { label: 'Ajsute-de-Parâmetro'},
  'Setup': { label: 'Setup'},
  'Máquina quebrada': { label: 'Máquina-quebrada'},
  'Manutenção programada/preventiva': { label: 'Manutenção-programada'},
  'Organização/Limpeza/Refeição': { label: 'Organização/Limpeza/Refeição'},
  'Retrabalho': { label: 'Retrabalho'},
  'Refugo': { label: 'Refugo'},
  'RH': { label: 'RH'},
  'Logística': { label: 'Logística'},
  'Eficiência Operacinal': { label: 'Eficiência-Operacinal'},
} satisfies ChartConfig

export function LossReasonChart() {
  return (
    <Card className="h-full w-full rounded-md">
      <CardHeader>
        <CardTitle>Perdas por Classificação</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[390px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 128,
              right: 30
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

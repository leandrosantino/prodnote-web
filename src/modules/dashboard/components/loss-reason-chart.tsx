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

const chartConfig = {
  hours: {
    label: "min",
  },
  'Ajsute de Parâmetro': { label: 'Ajsute-de-Parâmetro'},
  'Setup': { label: 'Setup'},
  'Máquina quebrada': { label: 'Máquina-quebrada'},
  'Manutenção programada': { label: 'Manutenção-programada'},
  'Organização/Limpeza': { label: 'Organização/Limpeza'},
  'Troca de material': { label: 'Troca-de-material'},
  'Refeição': { label: 'Refeição'},
  'Retrabalho': { label: 'Retrabalho'},
  'Refugo': { label: 'Refugo'},
  'RH': { label: 'RH'},
  'Logística': { label: 'Logística'},
  'Operacional': { label: 'Operacional'},
  'Micro paradas': { label: 'Micro-paradas'}
} satisfies ChartConfig

export type LossReasonChartData = {
  category: string;
  hours: number;
  fill: string;
}

export function LossReasonChart({data}: {data: LossReasonChartData[]}) {
  return (
    <Card className="h-full w-full rounded-md">
      <CardHeader>
        <CardTitle>Perdas por Classificação (min)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[320px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 100,
              right: 30
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              className="text-[.8rem] font-medium"
              tickMargin={0}
              interval={0}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="hours" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent  />}
            />
            <Bar dataKey="hours" layout="vertical" radius={5} >
              <LabelList style={{ fontWeight: 500, fontSize: '.9rem'}}  dataKey="hours" position="right" formatter={(item: number) => item.toFixed(0)} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avaliacao } from "@/hooks/useAvaliacoes";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface EvolutionChartProps {
  data: Avaliacao[];
  title: string;
  description?: string;
  dataKeys: {
    key: keyof Avaliacao;
    name: string;
    color: string;
    yAxisId?: "left" | "right";
  }[];
}

const EvolutionChart = ({ data, title, description, dataKeys }: EvolutionChartProps) => {
  const chartData = data.map((avaliacao) => ({
    data: new Date(avaliacao.data_avaliacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
    ...dataKeys.reduce((acc, { key }) => ({
      ...acc,
      [key]: avaliacao[key] || 0,
    }), {}),
  }));

  const hasRightAxis = dataKeys.some(k => k.yAxisId === "right");

  return (
    <Card className="border-border/50 bg-[#1a1b4b] text-white border-none shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {/* Icon logic could be passed or handled here, but title is enough for now */}
          {title}
        </CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="data"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#4b5563' }}
            />
            <YAxis
              yAxisId="left"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#4b5563' }}
            />
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#4b5563' }}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#f3f4f6"
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {dataKeys.map(({ key, name, color, yAxisId }) => (
              <Line
                key={key as string}
                yAxisId={yAxisId || "left"}
                type="monotone"
                dataKey={key as string}
                stroke={color}
                strokeWidth={3}
                name={name}
                dot={{ fill: color, strokeWidth: 2, r: 4, stroke: "#fff" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EvolutionChart;

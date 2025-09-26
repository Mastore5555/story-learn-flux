import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsChartProps {
  title: string;
  description?: string;
  data: any[];
  type: 'line' | 'bar' | 'pie';
  dataKey: string;
  xAxisKey?: string;
  color?: string;
}

const chartConfig = {
  progress: {
    label: "Progresso",
    color: "hsl(var(--primary))",
  },
  time: {
    label: "Tempo (min)",
    color: "hsl(var(--accent))",
  },
  courses: {
    label: "Cursos",
    color: "hsl(var(--primary-glow))",
  },
};

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--accent))',
  'hsl(var(--primary-glow))',
  'hsl(var(--secondary))',
];

export function AnalyticsChart({ 
  title, 
  description, 
  data, 
  type, 
  dataKey, 
  xAxisKey = 'name',
  color = 'hsl(var(--primary))'
}: AnalyticsChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color}
                strokeWidth={3}
                dot={{ fill: color, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[350px]">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>
    </ChartContainer>
  );
}
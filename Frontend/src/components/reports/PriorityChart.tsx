
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TaskProps } from '@/types/task';
import { useTheme } from '@/contexts/ThemeContext';

interface PriorityChartProps {
  tasks: TaskProps[];
}

const PriorityChart = ({ tasks }: PriorityChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#93C5FD' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#FCD34D' },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#F87171' }
  ];

 
  const filteredData = priorityData.filter(item => item.value > 0);
  
  
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name: string;
  }) => {
   
    if (percent < 0.1) return null;
    
    const RADIAN = Math.PI / 180;
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.2;
    const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.2;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={isDark ? "#fff" : "#000"} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filteredData.length > 0 ? filteredData : [{name: 'No Data', value: 1, color: isDark ? '#333' : '#E5E7EB'}]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {(filteredData.length > 0 ? filteredData : [{name: 'No Data', value: 1, color: isDark ? '#333' : '#E5E7EB'}]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? "#121827" : "#fff"} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} tasks`, 'Count']} 
            contentStyle={{ backgroundColor: isDark ? '#1A1F2C' : '#fff', borderColor: isDark ? '#333' : '#ccc' }}
            itemStyle={{ color: isDark ? '#fff' : '#000' }}
            labelStyle={{ color: isDark ? '#ccc' : '#666' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            layout="horizontal"
            formatter={(value) => <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityChart;

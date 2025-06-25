
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TaskProps } from '@/types/task';
import { useTheme } from '@/contexts/ThemeContext';

interface StatusChartProps {
  tasks: TaskProps[];
}

const StatusChart = ({ tasks }: StatusChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
 
  const statusData = [
    { name: 'To Do', value: todoTasks.length, color: '#FCD34D' },
    { name: 'In Progress', value: inProgressTasks.length, color: '#A78BFA' },
    { name: 'Completed', value: completedTasks.length, color: '#4ADE80' }
  ];

  
  const filteredData = statusData.filter(item => item.value > 0);
  
  
  interface CustomizedLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name: string;
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: CustomizedLabelProps) => {
   
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

export default StatusChart;

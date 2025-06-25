
import { BarChart as ReBarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { TaskProps } from '@/types/task';
import { useTheme } from '@/contexts/ThemeContext';

interface TimeChartProps {
  tasks: TaskProps[];
}

const TimeChart = ({ tasks }: TimeChartProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const timeData = [
    { name: 'To Do', time: todoTasks.reduce((t, task) => t + (task.timeLogged || 0), 0) / 3600, color: '#FCD34D' },
    { name: 'In Progress', time: inProgressTasks.reduce((t, task) => t + (task.timeLogged || 0), 0) / 3600, color: '#A78BFA' },
    { name: 'Completed', time: completedTasks.reduce((t, task) => t + (task.timeLogged || 0), 0) / 3600, color: '#4ADE80' }
  ];

  
  const filteredData = timeData.filter(item => item.time > 0);
  
  const formatYAxisTick = (value: number) => {
    if (value === 0) return '0';
    if (value < 0.1) return value.toFixed(2);
    if (value < 1) return value.toFixed(1);
    return value.toFixed(1);
  };
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart
          data={filteredData.length > 0 ? filteredData : [
            { name: 'No Data', time: 0, color: isDark ? '#333' : '#E5E7EB' },
            { name: ' ', time: 0, color: isDark ? '#333' : '#E5E7EB' }
          ]}
          margin={{
            top: 20,
            right: 30,
            left: 40,
            bottom: 30,
          }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12, fill: isDark ? '#ccc' : '#333' }}
            interval={0}
          />
          <YAxis 
            label={{ 
              value: 'Hours', 
              angle: -90, 
              position: 'insideLeft', 
              offset: -25,
              style: { fontSize: 12, textAnchor: 'middle', fill: isDark ? '#ccc' : '#333' }
            }} 
            domain={[0, 'auto']}
            tickFormatter={formatYAxisTick}
            tick={{ fontSize: 11, fill: isDark ? '#ccc' : '#333' }}
          />
          <Tooltip 
            formatter={(value) => {
              const numValue = typeof value === 'number' ? value : 0;
              return [numValue.toFixed(2) + ' hours', 'Time Spent'];
            }}
            contentStyle={{ backgroundColor: isDark ? '#1A1F2C' : '#fff', borderColor: isDark ? '#333' : '#ccc' }}
            itemStyle={{ color: isDark ? '#fff' : '#000' }}
            labelStyle={{ color: isDark ? '#ccc' : '#666' }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            formatter={(value) => <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>}
          />
          {filteredData.length > 0 ? (
            <Bar dataKey="time" name="Hours Spent" radius={[4, 4, 0, 0]}>
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="time" position="top" formatter={(value: number) => value.toFixed(1)} fill={isDark ? '#ccc' : '#333'} />
            </Bar>
          ) : (
            <Bar dataKey="time" name="Hours Spent" fill={isDark ? '#333' : '#E5E7EB'} radius={[4, 4, 0, 0]} />
          )}
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeChart;

/*import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer  } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';




const data = [
  
  { day:"Mon",students:94,teachers:88},
  { day:"Tue",students:88,teachers:85},
  { day:"Wed",students:90,teachers:87},
  { day:"Thu",students:91,teachers:89},
  { day:"Fri",students:87,teachers:84},
 
];


export default function Example() {
  return (
    <div>
  <h3>Attendance Overview</h3>
    <ResponsiveContainer width="100%" height={300}>
    <LineChart 
      style={{ width: '100%', maxWidth: '700px', height: '100%', maxHeight: '70vh', aspectRatio: 1.618 }}
      
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
      <XAxis dataKey="day" stroke="var(--color-text-3)" />
      <YAxis width="auto" stroke="var(--color-text-3)" />
      <Tooltip
        cursor={{
          stroke: 'var(--color-border-2)',
        }}
        contentStyle={{
          backgroundColor: 'var(--color-surface-raised)',
          borderColor: 'var(--color-border-2)',
        }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey="students"
        stroke="var(--color-chart-1)"
        name="students"
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
       
      />
      <Line
        type="monotone"
        dataKey="teachers"
        stroke="var(--color-chart-2)"
        name="Teachers"
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
       />
      <RechartsDevtools />
    </LineChart>
    </ResponsiveContainer>
    </div>
  );
}*/

<div className="chart-section">
  <h3>Attendance Overview</h3>

  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      data={data}
      margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Legend />

      <Line
        type="monotone"
        dataKey="students"
        stroke="#8884d8"
        name="Students"
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
      />

      <Line
        type="monotone"
        dataKey="teachers"
        stroke="#82ca9d"
        name="Teachers"
        dot={{ r: 4 }}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
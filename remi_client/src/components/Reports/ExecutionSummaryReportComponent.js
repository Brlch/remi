import React from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import '../../styles/css/styles.css'; 

function ExecutionSummaryReportComponent({ data }) {

  if (!data || data.length === 0) return null;

  const item = data[0];

  //Chart variables
  const COLORS = ['#0088FE', '#00C49F'];
  const chartData = [
    { name: 'Monto ejecutado', value: item.devn },
    { name: 'Monto por ejecutar', value: item.pim - item.devn }
  ];
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <>
      <table className='table table-hover table-stripped'>
        <thead>
          <tr>
            <th colSpan="2">Resumen de ejecución presupuestal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monto ejecutado</td>
            <td>{item.devn.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Monto por ejecutar</td>
            <td>{(item.pim - item.devn).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <PieChart width={400} height={400}>
        <Legend verticalAlign="top" height={36} />
        <Pie
          dataKey="value"
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <text x={200} y={200} textAnchor="middle" dominantBaseline="middle">
          {total.toLocaleString()}
        </text>
      </PieChart>
    </>
  );
}

export default ExecutionSummaryReportComponent;
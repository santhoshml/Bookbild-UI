import React, { Component } from 'react';
import constants from '../utils/constants';
import formatCurrency from 'format-currency';
import { CircleLoader } from 'react-spinners';
import { PieChart, Pie, Sector, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#154360', '#873600', '#34495E', '#3498DB', '#145A32', '#D5D8DC'];

const RADIAN = Math.PI / 180;                    
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);
 
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
    	{`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default class PieChartComponent extends Component {
	render () {
  	return (
      <span>
        <h3>{this.props.title}</h3>
        <PieChart width={800} height={500} onMouseEnter={this.onPieEnter}>
          <Legend height={36} layout='vertical' align='right' verticalAlign='top'/>
          <Pie
            dataKey='value'
            data={this.props.data} 
            cx={300} 
            cy={200} 
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={200} 
            fill="#8884d8"
          >
            {
              this.props.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
            }
          </Pie>
        </PieChart>
      </span>
    );
  }
}
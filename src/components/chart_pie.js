import React, { Component } from 'react';
import constants from '../utils/constants';
import formatCurrency from 'format-currency';
import { CircleLoader } from 'react-spinners';
import { PieChart, Pie, Sector, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#154360', '#873600', '#34495E', '#3498DB', '#145A32', '#D5D8DC'];

const RADIAN = Math.PI / 180;                    
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
 	const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
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
        <h4 style={{textAlign:'center'}}>{this.props.title}</h4>
        <PieChart width={600} height={400} onMouseEnter={this.onPieEnter}>
          <Legend height={36} layout='vertical' align='right' verticalAlign='top'/>
          <Pie
            dataKey='value'
            data={this.props.data} 
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150} 
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
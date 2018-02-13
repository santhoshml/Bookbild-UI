import React, { Component } from 'react';
import constants from '../utils/constants';
import formatCurrency from 'format-currency';
import { CircleLoader } from 'react-spinners';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#F4F6F7', '#873600', '#34495E', '#3498DB', '#145A32', '#D5D8DC'];

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

export default class BarLineChartComponent extends Component {
	render () {
  	return (
      <span>
        <h3>{this.props.title}</h3>
        <ComposedChart width={600} height={400} data={this.props.data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          <XAxis dataKey="name" allowDataOverflow={true}/>
          <YAxis />
          <Tooltip/>
          <Legend/>
          <CartesianGrid stroke='#f5f5f5'/>
          <Bar dataKey='Sector' barSize={20} fill='#413ea0'/>
          <Line type='monotone' dataKey='Overall Market' stroke='#ff7300'/>
        </ComposedChart>
      </span>
    );
  }
}
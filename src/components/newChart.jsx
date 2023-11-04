import React from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { scaleOrdinal } from '@visx/scale';
import { Text } from '@visx/text';

const data = [
  { label: 'Slice 1', value: 30 },
  { label: 'Slice 2', value: 40 },
  { label: 'Slice 3', value: 30 },
];

const width = 400;
const height = 400;
const margin = { top: 10, bottom: 10, left: 10, right: 10 };

const colorScale = scaleOrdinal({
  domain: data.map((d) => d.label),
  range: ['#FF5733', '#36A2EB', '#FFC300'],
});

function PieChart() {
  const pieRadius = width / 2 - margin.left;
  const labelRadius = pieRadius + 20; // Adjust the distance of the labels from the pie chart

  return (
    <svg width={width} height={height}>
      <Group top={height / 2} left={width / 2}>
        <Pie
          data={data}
          pieValue={(d) => d.value}
          outerRadius={pieRadius}
          innerRadius={0}
          cornerRadius={3}
          padAngle={0.02}
        >
          {(pie) =>
            pie.arcs.map((arc) => (
              <g key={arc.data.label}>
                <path d={pie.path(arc)} fill={colorScale(arc.data.label)} />
                <Text
                  x={labelRadius * Math.cos((arc.startAngle + arc.endAngle) / 2)}
                  y={labelRadius * Math.sin((arc.startAngle + arc.endAngle) / 2)}
                  textAnchor='middle'
                  verticalAnchor='middle'
                  fill='black'
                >
                  {arc.data.label}
                </Text>
              </g>
            ))
          }
        </Pie>
      </Group>
    </svg>
  );
}

export default PieChart;

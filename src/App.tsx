import React, { useEffect, useRef } from 'react';
import { getClients } from './services/api';
import './App.css';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import Loading from './components/Loading';

function App() {
  const chartRef = useRef<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [clientData, setClientData] = React.useState<{ client: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getClients();
      setLoading(false);
      const reducedData = data.reduce((acc: Record<string, number>, data: { client_version: string }) => {
        const client = data.client_version.split('/')[0];
        acc[client] = (acc[client] || 0) + 1;
        return acc;
      }, {});
      setClientData(
        Object.entries(reducedData).map(([client, count]) => ({
          client,
          count: count as number,
        }))
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.dispose();
    }

    let root;
    if (!chartRef.current) {
      root = am5.Root.new('chartdiv');
      chartRef.current = root;
    } else {
      root = chartRef.current;
    }

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalHorizontal,
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: 'Series',
        valueField: 'count',
        categoryField: 'client',
        color: am5.color('#fff'),
      })
    );

    // Adjust the font size of labels
    series.labels.template.setAll({
      forceHidden: false,
      text: "{category}: {valuePercentTotal.formatNumber('#.0')}% ({value})",
      fill: am5.color('#fff'),
      populateText: true,
      fontSize: 14,
    });

    series.data.setAll(clientData);

    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(20),
        layout: root.verticalLayout,
      })
    );
    legend.data.setAll(series.dataItems);

    // Adjust the font size of legend on the left side of the chart
    legend.labels.template.setAll({
      fontSize: 16,
      fill: am5.color('#fff'),
    });
    legend.markers.template.setAll({
      width: 10,
      height: 10,
      fill: am5.color('#fff'),
    });
    legend.valueLabels.template.setAll({
      fontSize: 14,
      text: "{valuePercentTotal.formatNumber('#.0')}% ({value})",
      fill: am5.color('#ccc'),
      marginTop: '3px',
    });

    // @ts-ignore-next-line
    legend.valueLabels.template.adapters.add('text', function (text, target) {
      if (target.dataItem) {
        console.log(
          target.dataItem.get('valuePercentTotal').formatNumber('#.0') + '% (' + target.dataItem.get('value') + ')'
        );
        return `${target.dataItem.get('valuePercentTotal').formatNumber('#.0')}% (${target.dataItem.get('value')})`;
      }
      return text;
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
  }, [clientData]);

  return (
    <div className='App'>
      {loading && <Loading />}
      <div id='chartdiv' style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
}

export default App;

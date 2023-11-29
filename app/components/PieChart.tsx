import { useRef, useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";

interface PieChartProps<T> {
  data: T[] | null;
  id: string;
  categoryField: string;
  onClick?: ((client: string) => void) | null;
}

export default function PieChart<T extends { [key: string]: any }>(props: PieChartProps<T>) {
  const { data, id, categoryField, onClick } = props;

  const chartdivRef = useRef<HTMLDivElement>(null);
  const rootRef: any = useRef<am5.Root | null>(null);

  useEffect(() => {
    let chartdiv = document.getElementById(id);
    if (!chartdiv) {
      chartdiv = document.createElement("div");
      chartdiv.id = id;
      chartdiv.style.width = "100%";
      chartdiv.style.minHeight = "500px";
      chartdiv.style.paddingBottom = "100px";
      chartdivRef.current?.appendChild(chartdiv);
    }

    if (rootRef.current) {
      rootRef.current.dispose();
    }

    rootRef.current = am5.Root.new(chartdiv.id);
    let chart = rootRef.current.container.children.push(
      am5percent.PieChart.new(rootRef.current, {
        layout: rootRef.current.verticalHorizontal,
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(rootRef.current, {
        name: "Series",
        valueField: "count",
        categoryField: categoryField,
        color: am5.color("#fff"),
        legendLabelText: "{category}",
        legendValueText: "{count} ({valuePercentTotal.formatNumber('#.0')}%)",
      })
    );

    const responsive = am5themes_Responsive.newEmpty(rootRef.current);
    responsive.addRule({
      relevant: function (width, height) {
        return width < 700;
      },
      applying: function () {
        series.chart.setAll({
          radius: am5.percent(60), // Decrease the size of the pie chart
        });
        legend.setAll({
          y: am5.percent(-100), // Move the legend above the chart
          height: am5.percent(20), // Adjust the legend's height
        });
        infoLabel.setAll({
          x: am5.percent(25), // Adjust horizontal positioning
          y: am5.percent(95), // Adjust vertical positioning
        })
      },
      removing: function () {},
    });
    

    series.labels.template.setAll({
      forceHidden: true,
    });

    series.ticks.template.setAll({
      forceHidden: true,
    });

    series.slices.template.events.on("click", function (ev: any) {
      if (ev.target.get("active")) {
        ev.target.set("active", false);
      }
      onClick && onClick(ev.target.dataItem.get("category"));
    });

    // series.slices.template.adapters.add("fill", function (fill: any, target: any) {
    //   let count = target.dataItem.get("count");
    //   let shade = count * 10; // Adjust this value to get the desired shade variation
    //   return am5.color(`rgb(${shade}, ${shade}, ${shade})`);
    // });

    series
      .get("colors")
      .set("colors", [am5.color(0x47dc7a), am5.color(0x000000), am5.color(0xFFA500), am5.color(0x03459C), am5.color(0x800080)]);

    series.slices.template.setAll({
      stroke: am5.color("#FFFFFF"),
      strokeWidth: 2,
    });

    rootRef.current.setThemes([am5themes_Animated.new(rootRef.current), am5themes_Dark.new(rootRef.current), responsive]);

    series.data.setAll(data);

    // Create and position a label for the filtering information
    let infoLabel = chart.children.push(
      am5.Label.new(rootRef.current, {
        text: "Displaying only clients with count > 10",
        x: am5.percent(80), // Adjust horizontal positioning
        y: am5.percent(95), // Adjust vertical positioning
        fontSize: 12,
        fill: am5.color("#000000"), // Adjust color as needed
        textAlign: "middle", // Center-align the text
      })
    );

    let legend = chart.children.push(
      am5.Legend.new(rootRef.current, {
        // centerX: am5.percent(50),
        x: am5.percent(0),
        layout: rootRef.current.verticalLayout,
        height: am5.percent(100),
        verticalScrollbar: am5.Scrollbar.new(rootRef.current, {
          orientation: "vertical",
        }),
        paddingBottom: 50,
        marginBottom: 50,
      })
    );
    legend.scrollable = true;
    legend.data.setAll(series.dataItems);

    legend.labels.template.setAll({
      fontSize: 15.1,
      fill: am5.color("#19232D"),
    });
    legend.markers.template.setAll({
      width: 10,
      height: 10,
      fill: am5.color("#19232D"),
    });
    legend.valueLabels.template.setAll({
      fontSize: 12,
      text: "{category} {count} ({valuePercentTotal.formatNumber('#.0')}%)",
      fill: am5.color("#818C96"),
      marginTop: "3px",
    });
    legend.valueLabels.template.adapters.add("text", function (text: any, target: any) {
      if (target.dataItem) {
        return `{category} ${target.dataItem.get("valuePercentTotal").formatNumber("#.0")}% (${target.dataItem.get("count")})`;
      }
      return text;
    });

    return () => {
      am5.array.each(am5.registry.rootElements, function (root) {
        if (root.dom.id == id) {
          root.dispose();
        }
      });
    };
  }, [data, id, categoryField, onClick, rootRef]);

  return <div id={id} ref={chartdivRef} />;
}

import { useEffect } from "react";
import * as echarts from 'echarts';
import { Empty } from "antd";
import { custTheme } from './custTheme'
const BoxLineChart = ({ linkActive, index, data, onChange }) => {

  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`));
    if (data) {
      // console.log(data)
      myChart.hideLoading();
      myChart.setOption({
        legend: { bottom: 0 },
        dataset: [
          {
            source: data.boxData
          },
          {
            transform: {
              type: 'boxplot',
              config: {
                itemNameFormatter: (d) => {
                  return data.period_list[d.value];
                }
              }
            }
          },
          {
            fromDatasetIndex: 1,
            fromTransformResult: 1
          },
          {
            source: [
              ['period_list', ...data.lineData.map((item) => item.title)],
              ...data.period_list.map((item, index) => {
                return [item, ...data.lineData.map((d) => d.data[index])];
              })
            ]
          }
        ],
        tooltip: {
          trigger: 'item',
          axisPointer: {
            type: 'shadow'
          }
        },
        toolbox: {
          showTitle:false,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          },
          orient: 'vertical'
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '15%',
          top: '2%'
        },
        xAxis: {
          type: 'category'
        },
        yAxis: [
          {
            type: 'value',
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                let val = Math.abs(value)
                if (val >= 1000000) {
                  return value / 1000000 + 'M'
                }
                else if (val >= 1000) {
                  return value / 1000 + 'k'
                }
                return value
              }
            },
          },
          {
            type: 'value',
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              formatter: function (value) {
                let val = Math.abs(value)
                if (val >= 1000000) {
                  return value / 1000000 + 'M'
                }
                else if (val >= 1000) {
                  return value / 1000 + 'k'
                }
                return value
              }
            },
          },
        ],
        series: [
          {
            name: data.boxTitle,
            type: 'boxplot',
            datasetIndex: 1
          },
          {
            name: data.scatterTitle,
            type: 'scatter',
            datasetIndex: 2,
            symbolSize: 5
          },
          ...data.lineData.map((item) => ({
            type: 'line',
            id:'3',
            datasetIndex: 3,
            yAxisIndex: 1,
            symbol: 'circle',
            lineStyle: { width: 3 },
            symbolSize: (val, params) => {
              if (linkActive[index] >= 0) {
                if (data.period_list.indexOf(params.value[0]) === linkActive[index] - 1) { return data.period_list.length < 12 ? 20 : 12 }
                if (data.period_list.indexOf(params.value[0])=== linkActive[index] - 2) { return data.period_list.length < 12 ? 12 : 7 }
                if (data.period_list.indexOf(params.value[0]) === linkActive[index]) { return data.period_list.length < 12 ? 12 : 7 }
              }
              return 3.5
            }
          }))
        ]
      }, true); //legend变化不更新，必须加true
      myChart.off('click')
      myChart.on('click', function (e) {
        //先把之前的放大状态清空
        onChange(index,data.period_list.indexOf(e.value[0])+1)
        myChart.setOption({
          series: [
            {
              id: '3',
              symbolSize: (val, params) => {
                if (data.period_list.indexOf(params.value[0]) === data.period_list.indexOf(e.value[0])) { return data.period_list.length < 12 ? 20 : 12 }
                if (data.period_list.indexOf(params.value[0]) === data.period_list.indexOf(e.value[0]) - 1) { return data.period_list.length < 12 ? 12 : 7 }
                if (data.period_list.indexOf(params.value[0]) === data.period_list.indexOf(e.value[0]) + 1) { return data.period_list.length < 12 ? 12 : 7 }

                return 3.5
              }
            }
          ]
        });
      });

      window.addEventListener("resize", () => {
        myChart.resize();
      });
    } else {
      myChart.showLoading();
    }

  }, [linkActive,data])

  return (
    <div id={'main' + index} style={{ height: '400px', width: '100%' }} ></div>
  )
};


export default BoxLineChart;

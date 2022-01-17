import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import { toDollarAuto, toPercentage } from '@/utils/math';
import { custTheme } from './custTheme'
// 基于准备好的dom，初始化echarts实例
const HBarChart = ({ index, data }) => {
  // console.log('chartData',data)

  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`),'chalk');


    if (data) {

      myChart.hideLoading();
      myChart.setOption({
        legend: {bottom:'0%',},

        tooltip: {
          position: 'top',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#fff'
            }
          },
          formatter: (params, ticket, callback) => {
            return `${params.data[0]}<br />
            ${params.marker + params.seriesName + ': ' + toDollarAuto(params.data[1])}`;
          },
          transitionDuration: 1.2 //跟随鼠标延迟
        },
        toolbox: {
          showTitle:false,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          },
          orient:'vertical'
        },
        dataset: [
          data.bar_data
            ? {
              source: data.bar_data
            }
            :
            {
              source: data.bar_data_1
            },
          {
            source: data.bar_data_2
          },
        ],
        grid: data.bar_data
          ? {left: '6%',right:'4%',bottom: '15%',top: '2%'} 
          : [{ right: '55%',top: '2%',left:'6%'  }, { left: '55%',top: '2%',right:'6%' }],
        xAxis: data.bar_data 
          //单Hbar
          ? {
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
          } 
          : [{
              gridIndex: 0,
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
            }, {
              gridIndex: 1,
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
        yAxis: data.bar_data 
          ? { type: 'category' } 
          : [{ type: 'category', gridIndex: 0 },
            { type: 'category', gridIndex: 1 }],
        series: data.bar_data
          //单Hbar
          ? (function () {
            let barSeries = []
            
            barSeries = data.bar_data[0].map(s => ({
              type: 'bar',
              stack: 'same',
              barMaxWidth: 150,
              datasetIndex: 0,
              // emphasis: { focus: 'series' },
              }))
            barSeries.shift()
            return barSeries
            
            })()
            //双hBar
          : [
            // These series are in the first grid.
            {
              type: 'bar',
              datasetIndex: 0,
              seriesLayoutBy: 'row',
              label: {
                show: true,
                color: '#4d67bc',
                position: 'right',
                formatter: function (params) {
                  return toDollarAuto(params.value[params.encode.x[0]]);
                }
              }
            },
            // These series are in the second grid.
          {
              type: 'bar',
              datasetIndex: 1,
              seriesLayoutBy: 'row',
              xAxisIndex: 1,
              yAxisIndex: 1,
              label: {
                show: true,
                color: '#4d67bc',
                position: 'right',
                formatter: function (params) {
                  return toPercentage(params.value[params.encode.x[0]]);
                }
              }
            }
          ]

      }, true); //legend变化不更新，必须加true




      window.addEventListener("resize", () => {
        myChart.resize();
      });
    } else {
      myChart.showLoading();
    }

  }, [data])

  return (
    <div id={'main' + index} style={{ height: '400px', width: '100%' }} ></div>
  )
};

export default HBarChart;
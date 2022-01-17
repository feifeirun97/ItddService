import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import styles from '../style.less'
// 基于准备好的dom，初始化echarts实例
import { toDollar, toPercentageChart,toChartData,keepTwoDecimal } from "@/utils/math"
import { custTheme } from './custTheme'
import { BarChartOutlined, DownOutlined, PercentageOutlined } from '@ant-design/icons';
import _ from "lodash";

const AreaChart = ({ index, data, linkActive, onChange, isPer, hasPer, isPerOnchange, compareList,heat }) => {
  // console.log('chartData',data)

  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');
    if (data) {
      
      let chartData = data
      console.log('chartData',chartData)
      const colors = [
        ['rgba(65, 167, 220, 0.5)', 'rgba(65, 167, 220, 0.2)'],
        ['rgba(102, 224, 186, 0.5)', 'rgba(102, 224, 186, 0.2)'],
        ['rgba(88, 98, 132, 0.5)', 'rgba(88, 98, 132, 0.2)'],
        ['rgba(151, 158, 224, 0.5)', 'rgba(151, 158, 224, 0.2)'],
        ['rgba(189, 230, 166, 0.5)', 'rgba(189, 230, 166, 0.2)'],
        ['rgba(143, 217, 227, 0.5)', 'rgba(143, 217, 227, 0.2)'],

        ['rgba(182, 38, 43, 0.5)', 'rgba(182, 38, 43, 0.2)'],
        ['rgba(250, 123, 94, 0.5)', 'rgba(250, 123, 94, 0.2)'],
        ['rgba(134, 148, 128, 0.5)', 'rgba(134, 148, 128, 0.2)'],
        ['rgba(196, 104, 164, 0.5)', 'rgba(196, 104, 164, 0.2)'],

        ['rgba(238, 153, 63, 0.5)', 'rgba(238, 153, 63, 0.2)'],
        ['rgba(48, 183, 183, 0.5)', 'rgba(48, 183, 183, 0.2)'],
        ['rgba(168, 106, 106, 0.5)', 'rgba(168, 106, 106, 0.2)'],
        ['rgba(43, 217, 227, 0.5)', 'rgba(43, 217, 227, 0.2)'],
      ]

      myChart.hideLoading();
      myChart.setOption({
        legend: { width: 650, bottom:0 },
        tooltip: {
          trigger: 'axis',
          formatter:(params,ticket,callback)=>{

            const barLength = params.filter((item)=>{return item.seriesType==='bar'?true:false}).length
            // console.log(params)
            return `${params[0].axisValue}<br />
            ${params.map((item, index) => {
              
              if (item.seriesType==='line'){
                return item.marker + item.seriesName + ': ' + toChartData(item.data[index-barLength+1],chartData.line_data_per)
              }
              return item.marker + item.seriesName + ': ' + toChartData(item.data[index+1])
            }).join('<br />')}`;
          },
          position: function (pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            const [width, height] = size.viewSize;
            const obj = { top: 20 };
            const current = pos[0]
            if (current < 0.25*width) {obj['left']=0.25*width}
            // else if (current < 0.5*width) {obj['right']=0.75*width}
            else if (current < 0.5*width) {obj['left']=0.5*width}
            else if (current < 0.75*width) {obj['left']=0.75*width}
            else {obj['right']=0.25*width}
            return obj;
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
          {
            source: chartData.area_data
          },
        ],
        grid: heat? {
          left: '9%',
          right: '6%',
          bottom: '18%',
          top: '2%'
        }:{
          left: '4%',
          right: '4%',
          bottom: '18%',
          top: '2%'
        },
        xAxis: {
          type: 'category',
          axisPointer: {
            type: 'shadow'
          },
          boundaryGap: false,
        },
        yAxis: [
          {
            type: 'value',

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
            }
          }
        ],
        series: (function () {

          let lineSeries = []
          if (chartData.area_data.length !== 0) {
            lineSeries = chartData.area_data[0].map((s, lineidx) => ({
              type: 'line',
              datasetIndex: 0,
              color: chartData.area_data[0].length===2 && heat?'rgba(143, 217, 227, 0.6)':new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colors[lineidx][0]
                },
                {
                  offset: 1,
                  color: colors[lineidx][1]
                }
              ]),
              
              stack: 'same',
              emphasis: { focus: 'series' },
              areaStyle: {},
              symbol: 'circle',
              lineStyle: { width: 3 },
              symbolSize: (val, params) => {
                const dataLength = chartData[Object.keys(chartData)[0]].length
 
                if (linkActive[index] >= 0) {
                  if (params.dataIndex === linkActive[index] - 1) { return dataLength < 8 ? 20 : 10 }
                  if (params.dataIndex === linkActive[index] - 2) { return dataLength < 8 ? 12 : 7 }
                  if (params.dataIndex === linkActive[index]) { return dataLength < 8 ? 12 : 7 }
                }
                return 3
              }

            }))
          }
          lineSeries.shift()
          return lineSeries

        })()
      }, true); //legend变化不更新，必须加true

      myChart.off('click')
      myChart.on('click', function (e) {
        //先把之前的放大状态清空

        onChange(index, e.dataIndex + 1)
        myChart.setOption({
          series: [
            {
              symbolSize: (val, params) => {
                const dataLength = chartData[Object.keys(chartData)[0]].length
                
                if (params.dataIndex === e.dataIndex) { return dataLength < 8 ? 20 : 12 }
                if (params.dataIndex === e.dataIndex - 1) { return dataLength < 8 ? 12 : 7 }
                if (params.dataIndex === e.dataIndex + 1) { return dataLength < 8 ? 12 : 7 }

                return 3
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

  }, [linkActive, data, isPer, compareList])

  return (
    <div id={'main' + index} style={{ height: '400px', width: '100%',marginBottom:`${heat?'1.5rem':0}` }} ></div>
  )
};


export default AreaChart
import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import styles from '../style.less'
// 基于准备好的dom，初始化echarts实例
import { toPercentageChart, toChartData,keepTwoDecimal } from "@/utils/math"
import { custTheme } from './custTheme'
import _ from "lodash";



const calYaxis = (data1) => {
  const sortedLine = data1.line_data.flat(Infinity).filter(Number).sort((a, b) => a - b)
  const lineMax = sortedLine[sortedLine.length-1]< Math.abs(sortedLine[0]) ?  Math.abs(sortedLine[0]) : sortedLine[sortedLine.length-1]

  const sum = (arr) => {
    let [p, n] = [0, 0]
    arr.forEach(s => s > 0 ? p += s : n += s)
    return [p, n]
  }
  const bar = data1.bar_data.reduce((accumulator, item) => {
    let [max, min] = sum(item.filter(num => { return typeof (num) === 'number' }))
    if (max > accumulator.max) { accumulator.max = max }
    if (min < accumulator.min) { accumulator.min = min }
    accumulator
    return accumulator
  }, { max: 0, min: 0 })

  if (bar.max < Math.abs(bar.min)) { bar.max = Math.abs(bar.min) }
  const barMax = bar.max
  return [lineMax, sortedLine[0], barMax, bar.min]
}


const BarLineSimple = ({ index, data, isPer }) => {


  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');
    console.log('chartData', data)
    if (data) {

      let chartData = data
      const [lineMax, lineMin, barMax, barMin] = calYaxis(data)
      // console.log([lineMax, lineMin, barMax, barMin])
      const isMinNeg = lineMin<0 || barMin<0 ? true :false 

      myChart.hideLoading();
      myChart.setOption({
        legend: {
          type: "scroll",
          width: 1000,
          bottom: '0%',
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params, ticket, callback) => {

            const barLength = params.filter((item) => { return item.seriesType === 'bar' ? true : false }).length
            // console.log('barLength',barLength)
            return `${params[0].axisValue}<br />
            ${params.map((item, index) => {

              if (item.seriesType === 'line') {
                return item.marker + item.seriesName + ': ' + toChartData(item.data[index - barLength + 1],chartData.line_data_per)
              }
              return item.marker + item.seriesName + ': ' + toChartData(item.data[index + 1])
            }).join('<br />')}`;
          },
          position:
            function (pos, params, dom, rect, size) {
              // tooltip will be fixed on the right if mouse hovering on the left,
              // and on the left if hovering on the right.
              var obj = { top: 60 };
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
            },
          transitionDuration: 1.2 //跟随鼠标延迟
        },
        dataset: [
          {
            source: chartData.bar_data
          },
          {
            source: chartData.line_data
          },
        ],
        grid: {
          left: '10%',
          right: chartData.line_data.length ? '10%' : '4%',
          bottom: '15%',
          top: '2%'
        },
        xAxis: {
          type: 'category',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [
          {
            type: 'value',
            max: barMax * 1.1,
            min: !isMinNeg? 0 : -barMax * 1.1,
            interval: !isMinNeg ? barMax * 1.1 / 5 : barMax * 1.1 / 3,
            axisLabel:{
                  formatter: function (value) {
                    let val = Math.abs(value)
                    if (val >= 1000000) {
                      return keepTwoDecimal(value / 1000000) + 'M'
                    }
                    else if (val >= 1000) {
                      return keepTwoDecimal(value / 1000) + 'k'
                    }
                    return keepTwoDecimal(value)
                  }
                },


          },
          {
            type: 'value',
            max: lineMax * 1.1,
            min: !isMinNeg ? 0 : -lineMax * 1.1,
            interval: !isMinNeg ? lineMax * 1.1 / 5 : lineMax * 1.1 / 3,
            axisLabel: chartData.line_data_per
              ? {
                formatter: function (value) {
                  return toPercentageChart(value)
                }
              }
              : {
                formatter: function (value) {
                  let val = Math.abs(value)
                  if (val >= 1000000) {
                    return keepTwoDecimal(value / 1000000) + 'M'
                  }
                  else if (val >= 1000) {
                    return keepTwoDecimal(value / 1000) + 'k'
                  }
                  return keepTwoDecimal(value)
                }
              }
          }
        ],

        series: (function () {
          let barSeries = []
          if (chartData.bar_data.length !== 0) {
            barSeries = chartData.bar_data[0].map(s => ({
              type: 'bar',
              stack: 'same',
              barMaxWidth: 45,
              datasetIndex: 0,
              // emphasis: { focus: 'series' },
            }))
          }

          let lineSeries = []
          if (chartData.line_data.length !== 0) {
            lineSeries = chartData.line_data[0].map(s => ({
              type: 'line',
              datasetIndex: 1,
              emphasis: { focus: 'series' },
              yAxisIndex: 1,
              symbol: 'circle',
              lineStyle: { width: 7 },
              symbolSize: 10
            }))
          }

          barSeries.shift()
          lineSeries.shift()
          let a = barSeries.concat(lineSeries)
          // console.log('series:', a)
          return a

        })()
      }, true); //legend变化不更新，必须加true



      window.addEventListener("resize", () => {
        myChart.resize();
      });
    } else {
      myChart.showLoading();
    }

  }, [data, isPer])

  console.log('当前图的id', `main${index}`)

  return (
    <div id={'main' + index} style={{ height: '300px', width: '100%' }} ></div>
  )
};


export default BarLineSimple;


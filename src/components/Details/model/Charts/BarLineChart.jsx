import React, {useState, useEffect } from 'react';
import * as echarts from 'echarts';
import styles from '../style.less'
// 基于准备好的dom，初始化echarts实例
import { toDollar, toPercentageChart,toChartData,keepTwoDecimal } from "@/utils/math"
import { custTheme } from './custTheme'
import { BarChartOutlined, DownOutlined, PercentageOutlined } from '@ant-design/icons';
import _ from "lodash";



const calYaxis =(data1)=>{
  const sortedLine = data1.line_data.flat(Infinity).filter(num=>typeof(num)==='number').sort((a,b)=>a-b)
  const lineMax = sortedLine[sortedLine.length-1]< Math.abs(sortedLine[0]) ?  Math.abs(sortedLine[0]) : sortedLine[sortedLine.length-1]

  const sum = (arr)=>{
    let [p,n] = [0,0]
    arr.forEach(s=>s>0?p+=s:n+=s)
    return [p,n]
  }
  const bar = data1.bar_data.reduce((accumulator, item) => {
    let [max,min] = sum(item.filter(num=>{return typeof(num)==='number'}))
    if (max>accumulator.max) {accumulator.max=max}
    if (min<accumulator.min) {accumulator.min=min}
    accumulator
    return accumulator
  }, { max: 0,min:0 })

  if (bar.max < Math.abs(bar.min)) {bar.max = Math.abs(bar.min) }
  const barMax = bar.max 
  return [lineMax,sortedLine[0],barMax,bar.min]
}
const colors = [
  ['rgba(43, 217, 227, 0.5)', 'rgba(43, 217, 227, 0.2)'],
  ['rgba(168, 106, 106, 0.5)', 'rgba(168, 106, 106, 0.2)'],

  ['rgba(238, 153, 63, 0.5)', 'rgba(238, 153, 63, 0.2)'],
  ['rgba(48, 183, 183, 0.5)', 'rgba(48, 183, 183, 0.2)'],

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


]

const BarLineChart = ({ index, data, linkActive, onChange, isPer, hasPer, isPerOnchange, compareList, heat, isCagr }) => {
  // console.log('chartData',JSON.stringify(data))
  const [hasAnimation, setHasAnimation] = useState(true)
  // useEffect(() => {
  //   setHasAnimation(false)
  // }, [linkActive, data, isPer, compareList])
  useEffect(() => {
    if (isCagr) {
      setHasAnimation(false)
    } else {
      setHasAnimation(true)
    }
  }, [isCagr])


  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');
    if (data) {
      const perdata = _.cloneDeep(data)
      //是否切换百分比模式
      if (data.bar_data.length && isPer) {

        perdata.bar_data = data.bar_data.map((item, index) => {
          if (index !== 0) {
            let total = 0
            for (let k = 1; k < item.length; k++) total += +item[k]
            return item.map((item2, index2) => {
              if (index2 !== 0) return item2 / total
              return item2
            })
          }
          return item

        })
      }

      let chartData = isPer ? perdata : data
      const [lineMax,lineMin,barMax,barMin] = calYaxis(data)
      // console.log(lineMax,lineMin)
      const isMinNeg = lineMin<0 || barMin<0 ? true :false 

      let min 
      if (lineMin>=0 && barMin>=0) min=0
      if (lineMin<0 && barMin>0) min=lineMin*1.1
      if (lineMin>0 && barMin<0) min=barMin*1.1
      if (lineMin<0 && barMin<0) { Math.abs(lineMin)<Math.abs(barMin)? min=barMin*1.1: lineMin*1.1}
     
      myChart.hideLoading();
      myChart.setOption({
        legend: {
          type: "scroll",
          width: 1000,
          // heat?top:'0%'
          bottom:heat?null:'0%',
          top:heat?'0%':null,
        },
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
          orient:'vertical',
          showTitle:false,
          feature: {
            myTool1: {
              show: hasPer&&chartData.bar_data.length,
              title: isPer ? 'switch to normal' : 'switch to percentage',
              icon: "path://M 847.087 207.087 l -640 640 a 21.3333 21.3333 0 0 1 -30.1733 -30.1733 l 640 -640 a 21.3333 21.3333 0 1 1 30.1733 30.1733 Z M 746.667 640 a 106.667 106.667 0 1 0 106.667 106.667 a 106.667 106.667 0 0 0 -106.667 -106.667 Z M 277.333 384 a 106.667 106.667 0 1 0 -106.667 -106.667 a 106.667 106.667 0 0 0 106.667 106.667 Z",
              onclick: () => {
                isPerOnchange(!isPer)
              }
            },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        dataset: [
          {
            source: chartData.bar_data
          },
          {
            source: chartData.line_data
          },
        ],
        grid: heat
        ?{ left: '9%', right: '6%', bottom: '3%', top: '12%' }
        
        :{
          left: '5%',
          right: chartData.line_data.length ? '6%' : '4%',
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
            max: isPer ? 1 : barMax*1.1,
            min: !isMinNeg? 0 : -barMax * 1.1,
            interval: !isMinNeg ? barMax * 1.1 / 5 : barMax * 1.1 / 3,
            axisLabel:
              isPer
                ?
                {
                  formatter: function (value) {
                    return value * 100 + '%'
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
                },


          },
          {
            type: 'value',
            max:lineMax*1.1,
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
            barSeries = chartData.bar_data[0].map((s,idx) => ({
              type: 'bar',
              stack: 'same',
              color: chartData.bar_data[0].length===2 && heat?'rgba(143, 217, 227, 0.5)':null,
              barMaxWidth: 50,
              datasetIndex: 0,
              // emphasis: { focus: 'series' },
              markLine: idx===1 && isCagr?{
                data: chartData.markline_data.map((item)=>([
                  {
                    name: 'start',
                    coord: item[0],
                    label: {
                      formatter: `CAGR:${item[2]}`,
                      position: 'insideMiddleTop',
                      color: '#E84C85',
                      fontSize:'12px'
                    }
                  },
                  { name: 'end', coord: item[1] }
                
              ])),
                label: {
                  distance: [10, 8]
                },
                lineStyle: { color: '#E84C85', join: 'round' ,width:1.5},
                animation: hasAnimation,
              }:null
            }))
          }

          let lineSeries = []
          if (chartData.line_data.length !== 0) {
            lineSeries = chartData.line_data[0].map((s,idx) => ({
              type: 'line',
              datasetIndex: 1,
              emphasis: { focus: 'series' },
              color: chartData.line_data[0].length===2 && heat?'rgba(143, 217, 227, 0.5)':colors[idx][0],
              yAxisIndex: 1,
              symbol: 'circle',
              lineStyle: { width: heat?5:3 },
              symbolSize: (val, params) => {
                const dataLength = chartData.bar_data.length ? chartData.bar_data.length : chartData.line_data.length
              
                if (linkActive[index] >= 0) {

                  if (params.dataIndex === linkActive[index] - 1) { return dataLength < 40 ? 18 : 10 }
                  if (params.dataIndex === linkActive[index] - 2) { return dataLength < 40 ? 10 : 7 }
                  if (params.dataIndex === linkActive[index]) { return dataLength < 40 ? 10 : 7 }
                }
                return 3.5
              }

            }))
          }

          barSeries.shift()
          lineSeries.shift()
          let a = barSeries.concat(lineSeries)
          // console.log('series:', a)
          return a

        })()
      }, true); //legend变化不更新，必须加true

      myChart.off('click')
      myChart.on('click', function (e) {
        //先把之前的放大状态清空

        onChange(index, e.dataIndex + 1)
        myChart.setOption({
          series: [
            {
              id: 'aaa',
              symbolSize: (val, params) => {
                const dataLength = chartData[Object.keys(chartData)[0]].length
                if (params.dataIndex === e.dataIndex) { return dataLength < 8 ? 20 : 12 }
                if (params.dataIndex === e.dataIndex - 1) { return dataLength < 8 ? 12 : 7 }
                if (params.dataIndex === e.dataIndex + 1) { return dataLength < 8 ? 12 : 7 }

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

  }, [linkActive, data, isPer, compareList,isCagr])

  return (
    <div id={'main' + index} style={{ height: `${heat?'280px':'400px'}`, width: '100%' }} ></div>
  )
};


export default BarLineChart;
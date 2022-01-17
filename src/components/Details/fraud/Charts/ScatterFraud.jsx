import React, { useEffect } from 'react'
import * as echarts from 'echarts';
import { custTheme } from './custTheme'
function ScatterFraud({ index, data }) {

  const markerList = []

  useEffect(() => {

    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');
    // console.log('myChart', myChart)
    if (data && data.scatter_data) {


      
        console.log('Scatter received', data)
      myChart.hideLoading();
      myChart.setOption({
        legend: { top: '1%' },
        tooltip: {
          trigger: 'item',
          showContent: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#fff'
            }
          },
          position: 'top',
          transitionDuration: 1.2, //跟随鼠标延迟,
          formatter: (params, ticket, callback) => {


            return `${data.scatter_text[params.dataIndex].map((text) => {
              return `${text.key}:  ${text.value}<br />`
            })}`.replaceAll(',', '');
          },
        },
        toolbox: {
          orient:'vertical',
          showTitle:false,
          feature: {
            dataZoom: {},
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        dataset:
          { source: data.scatter_data }
        ,
        grid: {
          left: '5%',
          right: '5%',
          bottom: '18%',
          top: '7%',
        },
        xAxis: {
          type: 'value',
          axisPointer: {
            type: 'shadow'
          },
          name: data.xaxis_name,
          nameLocation: "middle",
          nameTextStyle: {
            color: "#000",
            fontSize: 14,
            // fontWeight: "lighter",

          },
          nameGap: 50
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
            },
            name: data.yaxis_name,
            nameLocation: "middle",
            nameTextStyle: {
              color: "#000",
              fontSize: 14,
              // fontWeight: "lighter",

            },
            nameGap: 40
          },
        ],
        dataZoom: [
          {
            type: 'slider',
            height: 20,
            top: '87%',
            xAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            show: true,
            left: '96%',
            width: 20,
            yAxisIndex: [0],
            start: 0,
            end: 100
          },
          {
            type: 'inside',//这个 dataZoom 组件是 inside 型 dataZoom 组件（能在坐标系内进行拖动，以及用滚轮（或移动触屏上的两指滑动）进行缩放）
            xAxisIndex: 0,//控制x轴
            start: 0,
            end: 100
          },

          {
            type: 'inside',// inside 型 dataZoom 组件
            yAxisIndex: 0,//控制y轴
            start: 0,
            end: 100
          }
        ],
        series:
        {
          name: data.legend,
          type: 'scatter',
          symbolSize: (val, params) => {
            if(data.highlight_index.includes(params.dataIndex)){
              return 30
            }
            return 8
          },
          itemStyle: {
            color: function (params) {
              if(data.highlight_index.includes(params.dataIndex)){
                return '#E84C85'
              }
              return '#66bae4'
            }
          }
        }

      }, true); //legend变化不更新，必须加true


      window.addEventListener("resize", () => {
        myChart.resize();
      });
    } else {
      myChart.showLoading();
    }

  }, [data])

  return (
    <div id={'main' + index} style={{ height: '500px', width: '100%' }} ></div>
  )
}

export default ScatterFraud

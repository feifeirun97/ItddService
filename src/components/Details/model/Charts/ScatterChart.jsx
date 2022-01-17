import React, { useEffect } from 'react'
import * as echarts from 'echarts';
import { custTheme } from './custTheme'
function ScatterChart({ index, data }) {

  useEffect(() => {
    console.log('received')
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');

    if (data && data.scatter_data) {
      let scatterData = data.scatter_data
      myChart.hideLoading();
      myChart.setOption({
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#fff'
            }
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
        toolbox: {
          orient:'vertical',
          showTitle:false,
          feature: {
            dataZoom: {},
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        dataset: scatterData.map(s => (
          { source: s.data }
        )),
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
        series: scatterData.map((s, index) => (
          {
            name: s.type,
            symbolSize: function (val) {
              let v = val[2]
              switch (true) {
                case (Math.abs(val[2]) < 10): v = Math.log(v + 1) * 6; break
                case (10 <= Math.abs(val[2]) < 100): v = Math.log(v + 1) * 2; break
                case (100 <= Math.abs(val[2])): v = Math.log(v + 1) * 2; break
                default: v = 1
              }
              return v
            },
            datasetIndex: index,
            type: 'scatter'
          }
        ))
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
}

export default ScatterChart

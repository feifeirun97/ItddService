import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import styles from '../style.less'
// 基于准备好的dom，初始化echarts实例
import { toDollar } from "@/utils/math"
import { custTheme } from './custTheme'


const XaxisMultiBarCHart = ({ index, data, linkActive, onChange }) => {
  // console.log('chartData',data)
  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');
    if (data) {
      const colors = {
        activated_start: 'rgb(77, 103, 188)',
        activated_end: 'rgb(77, 103, 188,0.5)',
        pending_start: 'rgb(225, 114, 45)',
        pending_end: 'rgb(225, 114, 45, 0.5)',
        unknown_start: 'rgb(232, 95, 94)'
      }

      myChart.hideLoading();
      myChart.setOption({

        legend: {
          bottom: 0
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          position:
            function (pos, params, dom, rect, size) {
              // tooltip will be fixed on the right if mouse hovering on the left,
              // and on the left if hovering on the right.
              var obj = { top: 60 };
              obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
              return obj;
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
        xAxis: [
          {
            type: 'category',
            data: data.period_list
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: data.bar_data.map((d) => ({
          name: d.title,
          type: 'bar',
          stack: d.stack,
          color: colors[d.title],
          emphasis: {
            focus: 'series'
          },
          data: d.data
        }))
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
                const dataLength = data[Object.keys(data)[0]].length
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

  }, [linkActive, data])

  return (
    <div id={'main' + index} style={{ height: '400px', width: '100%' }} ></div>
  )
};


export default XaxisMultiBarCHart

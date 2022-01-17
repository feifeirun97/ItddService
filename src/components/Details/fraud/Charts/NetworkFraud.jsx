import React, { useEffect } from 'react'
import * as echarts from 'echarts';
import { custTheme } from './custTheme'

function NetworkFraud({ index, data,chartTable }) {

  

  useEffect(() => {

    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`));
    // console.log('myChart', myChart)
    if (data) {
      // console.log('Network received', data)
      myChart.hideLoading();
      myChart.setOption({
        legend: { bottom: '0%' ,data: data.categories.map(function (a) {return a.name;})},
        tooltip: {
          trigger: 'item',
          showContent: true,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          position: 'top',
          transitionDuration: 1.2, //跟随鼠标延迟,
          // formatter: (params, ticket, callback) => {
          //   return `${data.scatter_text[params.dataIndex].map((text) => {
          //     return `${text.key}:  ${text.value}<br />`
          //   })}`.replaceAll(',', '');
          // },
        },
        toolbox: {
          orient:'vertical',
          showTitle:false,
          feature: {
            // dataZoom: {},
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
        grid: {
          left: '0%',
          right: '0%',
          bottom: '7%',
          top: '0%',
        },
        
        series: [
          {
            // name: 'Les Miserables',
            type: 'graph',
            layout: 'none',
            data: data.nodes,
            links: data.links,
            categories: data.categories,
            roam: true,
            label: {
              show: true,
              position: 'right',
              formatter: '{b}'
            },
            labelLayout: {
              hideOverlap: true
            },
            scaleLimit: {
              min: 0.4,
              max: 40
            },
            lineStyle: {
              color: 'source',
              curveness: 0.1
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
    <div id={'main' + index} style={{ height: chartTable?'500px':'900px', width: '100%',marginBottom:'20px' }} ></div>
  )
}

export default NetworkFraud

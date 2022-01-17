import React, { useEffect } from 'react'
import * as echarts from 'echarts';
import {custTheme} from './custTheme'


function SankeyChart({data,index}) {
  useEffect(() => {
    echarts.registerTheme('chalk',custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`),'chalk');
    
    if (data && data.sankey_data) {
      myChart.hideLoading();
      myChart.setOption({
        tooltip: {},
        toolbox: {
          showTitle:false,
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          },
          orient:'vertical'
        },
        series: {
          left: 10.0,
          top: 10.0,
          right: 60.0,
          bottom: 10.0,
          type: 'sankey',
          layout: 'none',
      
          emphasis: {
            focus: 'adjacency'
          },
      
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          },
          data: data.sankey_data.data,
          links: data.sankey_data.links
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
    <div id={'main' + index} style={{ height: '400px', width: '100%' }} ></div>
  )
}
export default SankeyChart

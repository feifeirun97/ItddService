
import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts';
import {custTheme} from './custTheme'


function FunnelScatterChart({ index, data }) {

  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');

    if (data && data.scatter_data) {
      let scatterData = data.scatter_data
      myChart.hideLoading();
      myChart.setOption({
        legend: {bottom:'0%',},
        tooltip: {
          position: 'top',
          formatter: function (params) {
            return (
              data.yaxis[params.value[1]]+': '+data.xaxis[params.value[0]]+' '+
              params.value[2] +
              '人'
            );
          }
        },
        toolbox: {
          showTitle:false,
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          },
          orient:'vertical'
        },
        dataset: data.scatter_data.map((s) => ({ source: s.data })),
        grid: {
          left: '6%',
          right: '5%',
          bottom: '15%',
          top:'2%'
        },
        xAxis: {
          type: 'category',
          data: data.xaxis,
          boundaryGap: false,
          splitLine: {
            show: true
          },
          axisLine: {
            show: false
          },
        },
        yAxis: [
          {
            type: 'category',
            data: data.yaxis,
            // boundaryGap: false,
            axisLine: {
              show: false
            },
          },
        ],
        series: data.scatter_data.map((s, index) => ({
          name: s.type,
          symbolSize: function (val) {
            let v = val[2];
            if (10000 <= Math.abs(val[2])) return (val[2] / 10000) * 4 + 90;
            if (1000 <= Math.abs(val[2])) return (val[2] / 1000) * 4 + 54;
            if (100 <= Math.abs(val[2])) return (val[2] / 100) * 4 + 18;
            return Math.log(v + 4) * 4;
          },
          datasetIndex: index,
          type: 'scatter'
        }))
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

export default FunnelScatterChart

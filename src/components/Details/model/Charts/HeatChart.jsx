import React, { useEffect } from 'react';
import echarts from 'echarts';
import { toDollarAuto, toPercentageChart, toCount } from '@/utils/math';
import { custTheme } from './custTheme'
// 基于准备好的dom，初始化echarts实例

const labelFormat = (type,data,params)=>{
  return  data[type] ==='amt'?toDollarAuto(params.data[2]):data[type] === 'cnt'?toCount(params.data[2]):toPercentageChart(params.data[2])
}

const HeatChart = ({ index, data }) => {

  useEffect(() => {
    echarts.registerTheme('chalk', custTheme)
    let myChart = echarts.init(document.getElementById(`main${index}`), 'chalk');



    if (data) {
      let minMaxList = [];
      let breakPoints = [];
      data.heatmap_data.forEach(item => {
        if (item[0] !== 0.0 && item[1] !== 0.0) {
          minMaxList.push(item[2]);
        }
        const rangeUnit = Math.ceil(minMaxList.length / 5)
        minMaxList.sort((a, b) => a - b)
        breakPoints = [minMaxList[rangeUnit], minMaxList[rangeUnit * 2], minMaxList[rangeUnit * 3], minMaxList[rangeUnit * 4],]
      })



      myChart.hideLoading();
      myChart.setOption({
        tooltip: {
          position: 'top',
          backgroundColor:'#fff',
          textStyle: {
            color: "#5b5b5b"
          },
          borderColor:"#586285",
          borderWidth:0.6,
          formatter: (params, ticket, callback) => {
            let itemData = params.data;
            let val 
            if (data.left_type){
              val = itemData[0] === 0.0
              ? labelFormat('left_type',data,params)
              : labelFormat('main_type',data,params)
            }
            else {
              val = labelFormat('main_type',data,params)
            }   
            return `${data.yaxis[params.data[1]]}&nbsp ${data.xaxis[params.data[0]]}<br />
            ${params.marker + params.seriesName + ': ' + val}`;
          },
          transitionDuration: 1.2 //跟随鼠标延迟

        },
        grid: { left: '9%', right: '6%', bottom: '3%', top: '5%' },
        toolbox: {
          showTitle:false,
          feature: {

            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          },
          orient:'vertical',
        },
        xAxis: {
          type: 'category',
          data: data.xaxis,
          // splitArea: {
          //   show: true
          // },
          position: "top"
        },
        yAxis: {
          type: 'category',
          data: data.yaxis,
          // splitArea: {
          //   show: true
          // }
        },
        // visualMap:{show:false},
        series: [
          {
            name: 'Punch Card',
            type: 'heatmap',
            data: data.heatmap_data,
            label: {
              show: true,
              // color: function (params) {return 'red'},
              color: "#555",
              formatter: function (params) {
                let itemData = params.data;
                if (itemData[0] === 0.0) {
                  //有left——type才有不同颜色
                  if(data.left_type){
                    if (data.left_type === 'amt') return toDollarAuto(params.data[2])
                    if (data.left_type === 'cnt') return toCount(params.data[2])
                    if (data.left_type === 'per') return toPercentageChart(params.data[2])
                  }
                }

                if (data.main_type === 'amt') return toDollarAuto(params.data[2])
                if (data.main_type === 'cnt') return toCount(params.data[2])
                if (data.main_type === 'per') return toPercentageChart(params.data[2])
              },
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            itemStyle: {
              color: (params) => {
                let itemData = params.data;
                // if (itemData[1] === 0.0) return 'rgba(103, 224, 186, 0.8)';
                if (itemData[1] === 0.0) return 'rgba(143, 217, 227, 0.3)';
                // if (itemData[1] === 0.0) return 'rgba(149, 150, 185, 0.8)';

                if (itemData[0] === 0.0 && data.left_type) return 'rgba(151, 158, 224, 0.2)';


                if (breakPoints[3]<= itemData[2]) return 'rgba(151, 158, 224, 1)';
                if (breakPoints[2] <= itemData[2]) return 'rgba(151, 158, 224,0.8)';
                if (breakPoints[1] <= itemData[2]) return 'rgba(151, 158, 224, 0.6)';
                if (breakPoints[0] <= itemData[2]) return 'rgba(151, 158, 224, 0.4)';
                return 'rgba(151, 158, 224, 0.3)';
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

export default HeatChart;
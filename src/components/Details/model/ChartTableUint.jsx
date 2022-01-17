import React, { useEffect, useState } from 'react'
import BarLineChart from './Charts/BarLineChart'
import CombTable from './Table/CombTable'
import GraphToolbar from './ToolBars/GraphToolbar'
import axios from 'axios'
import TableToolbar from './ToolBars/TableToolBar'
import styles from './style.less';
import ScatterChart from './Charts/ScatterChart'
import HBarChart from './Charts/HBarChart'
import BoxLineChart from './Charts/BoxLineChart'
import XaxisMultiBarCHart from './Charts/XaxisMultiBarCHart'
import TableChart from './Charts/TableChart'
import FunnelScatterChart from './Charts/FunnelScatterChart'
import SankeyChart from './Charts/SankeyChart'
import AreaChart from './Charts/AreaChart'
import HeatChart from './Charts/HeatChart'
import { Empty } from 'antd'
import TrendSummary from './TrendSummary/TrendSummary'
import { commonApi } from "@/services/commonApi";

export default function ChartAndTableUnit({ inputProj,local,options, index, urlValue, type, hasPer, linkActive, linkActiveChange }) {

    //dimension是一个{‘requestKey’:'period','requestValue':'Y'}字典
    const [dimension, setDimension] = useState([])
    //Graph Tool Bar 展示内容 切换百分比 
    const [display, setDisplay] = useState([])
    const [chartTitle, setChartTitle ] = useState('')
    const [data, setData] = useState('')
    //Graph Tool Bar 切换为百分比柱状图
    const [isPer, setIsPer] = useState(false)
    //Graph Tool Bar 比较日期双图
    const [compareList, setCompareList] = useState([[], []])
    //Graph Tool Bar CAGR Line线图
    const [isCagr, setIsCagr] = useState(false)

    //Table tool bar
    const [quantity, SetQuantity] = useState('')  



    const onDateChange = (date, dateString, type, periodAll) => {
        if (periodAll){
            setCompareList(periodAll)
            return 
        }
        let tempDate = [...compareList]
        type === 'start'
            ? tempDate[0] = dateString
            : tempDate[1] = dateString
        setCompareList(tempDate)
    }

    // useEffect(() => {
    //     console.log(JSON.stringify(compareList))
    // }, [compareList])


    useEffect(() => {
        if (!quantity) {
            SetQuantity('Raw')
        }
    }, [quantity])

    const urlList = {
        get: 'http://192.168.8.165:5020/service-itdd-post/',
        post: 'http://192.168.8.165:5020/service-itdd-post/',
    }
    //urlValue变化吧dimension晴空

    useEffect(() => {
        if(!(options && options.nsrsbh)) return 
        //先get确定下一步post的formdata内容
        if (!local) {
            commonApi(urlValue + '_readme', {
                proj_id:options.nsrsbh,
                // type:"SaaS",
                port:5020,
                ...options
              }).then(res => {
                setDimension(res.display.map(d => (
                    { requestKey: d.dim, requestValue: Object.keys(d.options)[0], displayName: Object.values(d.options)[0] }
                )))
                setDisplay(res.display)
                setChartTitle(res.title)
              });
        }
        else {
            let formdata = new FormData()
            formdata.append('proj_id', inputProj)
            axios.post(urlList.post + urlValue + '_readme', formdata )
                .then(res => {
                    //第一次请求先获取display列表，获取并设置demensionList
                    setDimension(res.data.content.display.map(d => (
                        { requestKey: d.dim, requestValue: Object.keys(d.options)[0], displayName: Object.values(d.options)[0] }
                    )))
                    setDisplay(res.data.content.display)
                    setChartTitle(res.data.content.title)
                })
                .catch(err => console.log(err))
        }

        
    }, [urlValue,options])


    useEffect(() => {
        if (!dimension.length) return;
        console.log('dimension', dimension)
        if (!local){
            const data= {
                proj_id:options.nsrsbh,
                // type:"SaaS",
                port:5020,
                ...options
              }
            dimension.forEach((r) => {
                data[r.requestKey]=r.requestValue
            })
            console.log('传参',data)
            commonApi(urlValue,data ).then(res => {
                    if (typeof (res.data) === 'string') {
                        // Json中不存在NaN，若返回数据有NaN会alert
                        alert('Type: string')
                        let t1 = res.data.trim('\n').replaceAll('NaN', '')
                        let t2 = JSON.parse(t1)
                        setData(t2.content.plt)
                        return
                    }
                    // console.log('rrrrrrr',res.data,typeof(res.data))
                    if (res.plt || res.table) {
                        setData(res)
                        console.log('Post请求数据', res)
                    }else {
                        setData('nodata')
                        console.log('Post请求失败', res)
                    }
              })
              .catch(
                  err=>console.log(err)
              )
        }
        else {
        
        let formdata = new FormData()
        formdata.append('proj_id', inputProj)
        
        dimension.forEach((r) => {
            formdata.append(r.requestKey, r.requestValue)
        })
        axios.post(urlList.post + urlValue, formdata)
            .then(res => {
                // console.log('散点图数据',res.data.content.plt.scatter_data)
                // Json中不存在NaN，
                if (typeof (res.data) === 'string') {
                    alert('Type: string')
                    let t1 = res.data.trim('\n').replaceAll('NaN', '')
                    let t2 = JSON.parse(t1)
                    setData(t2.content.plt)
                    return
                }
                // console.log('rrrrrrr',res.data)
                if (res.data.respCode==='9999') {;return}
                
                setData(res.data.content)
                console.log('Post请求数据', res.data.content )
            })
        }

        

        

    }, [dimension])







    //加一个空状态，等到data获取到才显示

    return (
        <>
            <div className={styles.ChartAndTableUnit}>
                
                <GraphToolbar index={index} chartTitle={chartTitle} data={type === 'bar_line' ? data.plt : null} dimension={dimension} display={display} onDateChange={onDateChange} onChange={(data1) => { setDimension(data1); linkActiveChange(index, '') }} compareList={compareList} hasPer={hasPer} isPer={isPer} isPerOnchange={data1 => setIsPer(data1)} onCagrChange={()=>setIsCagr(!isCagr)}/>
                {   
                    data==='nodata'?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{height:'300px',display:'flex',alignItems:'center',justifyContent:'center'}}/>
                    : type === 'scatter' ?
                        <ScatterChart index={index} data={data.plt} />
                    : type === 'funnel_scatter' ?
                        <FunnelScatterChart index={index} data={data.plt} />
                    : type === 'bar_line' ?
                        <BarLineChart  index={index} data={data.plt} linkActive={linkActive} onChange={linkActiveChange} hasPer={hasPer} isPer={isPer} isPerOnchange={data1 => setIsPer(data1)} isCagr={isCagr} />
                    : type === 'h_bar' ?
                        <HBarChart index={index} data={data.plt} />
                    : type === 'box_line' ?
                        <BoxLineChart index={index} data={data.plt} linkActive={linkActive} onChange={linkActiveChange} />
                    : type === 'multi_bar' ?    
                        <XaxisMultiBarCHart index={index} data={data.plt} linkActive={linkActive} onChange={linkActiveChange} />
                    : type === 'table' ?
                        <TableChart index={index} dataSource={data.table} linkActive={linkActive} onChange={linkActiveChange} />
                    : type === 'sankey' ?
                        <SankeyChart index={index} data={data.plt} />
                    : type === 'area' ?
                        <AreaChart  index={index} data={data.plt} linkActive={linkActive} onChange={linkActiveChange}  />
                    : type === 'heatmap' ?
                        <>
                            
                            {
                                data && data.plt.line_data.length ?
                                    <>
                                        <HeatChart  index={index*2+1} data={data.plt}/>
                                        <BarLineChart  heat={true} index={index+10} data={data.plt} linkActive={linkActive} onChange={linkActiveChange} hasPer={hasPer} isPer={isPer} isPerOnchange={data1 => setIsPer(data1)} />
                                    </>
                                :   data && data.plt.bar_data.length ?
                                    <>
                                        <HeatChart  index={index*2+1} data={data.plt}/>
                                        <BarLineChart  heat={true} index={index+10} data={data.plt} linkActive={linkActive} onChange={linkActiveChange} hasPer={hasPer} isPer={isPer} isPerOnchange={data1 => setIsPer(data1)} />
                                    </>
                                :   data && data.plt.area_data.length ?
                                    <>
                                        <AreaChart heat={true} index={index+10}  data={data.plt} linkActive={linkActive} onChange={linkActiveChange}  />
                                        <HeatChart  index={index*2+1} data={data.plt}/>                                
                                    </>
                                :   <Empty/>
                            
                            }
                        </>
                    : '未适配图类'
                }

                

                {
                    data.table && type !== 'table' && type!=='heatmap'
                        ? <>
                            <TableToolbar quantity={quantity} onChange={data1 => SetQuantity(data1)} />
                            <CombTable index={index} quantity={quantity} data={data.table} linkActive={linkActive} onChange={linkActiveChange} />
                        </>
                        : null
                }
            </div>
                {  type==='bar_line'
                    ?
                    <TrendSummary data={data && data.table}/>
                    :
                    null

                }
        </>
    )
}




import { Table, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './style.less';
import { toCount, toPercentage, toDollar } from '@/utils/math'
import TableToolbar from '../model/ToolBars/TableToolBar';
import FraudTable from './Table/FraudTable';
import axios from 'axios';
import { commonApi } from "@/services/commonApi";
function TableModalUnit({ urlValue, chartTable, proj,local,options }) {
  //Table tool bar
  const [quantity, SetQuantity] = useState('Raw')
  const [data, setData] = useState(undefined)

  const urlList = {
    get: 'http://192.168.8.165:5020/service-itdd-get/',
    post: 'http://192.168.8.165:5020/service-itdd-post/',
  }

  // console.log('yes',urlValue)
  useEffect(() => {
    // console.log('yes',urlValue,options)
    if (!options) return 
    
    if (!local ){
      console.log('yes',urlValue)
      commonApi(urlValue.key, {
        port: 5020,
        ...options
      }).then(res => {
        console.log('Post请求数据', res)
        setData(res)
      })
      return 
    }
  



    let formdata = new FormData()
    formdata.append('proj_id', proj)
    axios.post(urlList.post + urlValue.key, formdata)
      .then(res => {
        if (typeof (res.data) === 'string') {
          alert('Type: string')
          let t1 = res.data.trim('\n').replaceAll('NaN', '')
          let t2 = JSON.parse(t1)
          setData(t2.content.plt)
          return
        }

        setData(res.data.content)
        console.log('Post请求数据', res.data.content)
      })
    return function cleanup(){
      setData(undefined)
    }
  }, [urlValue,options])

  return (
    <>
      {

        data ?
          <div className={chartTable ? null : styles.ChartAndTableUnit} >
            <TableToolbar title={data && { title: data.title, notation: data.title_notation }} quantity={quantity} onChange={data1 => SetQuantity(data1)} style={{ borderTop: '0px' }} />
            <FraudTable quantity={quantity} data={data} proj={proj} options={options} local={local}/>
          </div>
        : null
      }
    </>
  )
}

export default TableModalUnit

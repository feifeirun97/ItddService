
import { Button, Cascader, Dropdown, Menu, DatePicker, Modal, Empty, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react'
import styles from '../style.less';
import { QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import TableModalUnit from '../TableModalUnit';
import NetworkFraud from '../Charts/NetworkFraud';
import { commonApi } from "@/services/commonApi";

function ChartTable({ urlValueList, proj ,local, options}) {
  const [data, setData] = useState(undefined)


  useEffect(() => {
    if (!urlValueList.length) return ;
    // if (urlValueList[0].type === 'table') return;
    
    if (!local){
      commonApi(urlValueList[0].key.includes('network')?urlValueList[0].key:urlValueList[1].key, {
        port: 5020,
        ...options
      }).then(res => {
        // console.log('Post请求数据', res)
        setData(res)
      })
      return 
    }
  



    let formdata = new FormData()
    formdata.append('proj_id', proj)
    axios.post('http://192.168.8.165:5020/service-itdd-post/' + urlValueList[0].key, formdata)
      .then(res => {
        // console.log('散点图数据',res.data.content.plt.scatter_data)
        // Json中不存在NaN，
        if (typeof (res.data) === 'string') {
          alert('Type: string')
          let t1 = res.data.trim('\n').replaceAll('NaN', '')
          let t2 = JSON.parse(t1)
          // setData(t2.content.plt)
          return
        }
        setData(res.data.content)
        console.log('Post请求数据', res.data.content)
      })
  }, [urlValueList,options])




  return (

      <div style={{ display: 'flex', flexDirection: 'column', overflowY:'scroll', maxHeight:'calc(100vh - 166px)' }}>
        {urlValueList.map(item => (
          item.type === 'network' ?
            <div className={styles.ChartAndTableUnit}>
              <div style={{display:'flex',borderBottom:'1px solid #E6E6FF', paddingBottom:'6px'}}>
                <div style={{ userSelect: 'none',fontSize:'1.3rem',fontWeight:'550',color:'#808080',fontFamily: '"Inter", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif'}}>{data?.plt?.title}</div>
                <Tooltip placement="top" title={data?.plt?.title_notation} overlayClassName={styles.customTooltip}>
                  {data?<QuestionCircleOutlined style={{ marginTop: '8px',marginLeft:'15px',fontSize:'14px'}} />:null}
                </Tooltip>  
              </div>
              <NetworkFraud index={0} data={data?.plt} chartTable={true} />
            </div>
          : item.type === 'table' ?
            <div className={styles.ChartAndTableUnit}>
              <TableModalUnit urlValue={item} chartTable={true} proj={proj} options={options} local={local}/>
            </div>
          : null
        ))}
      </div>
  )
}

export default ChartTable

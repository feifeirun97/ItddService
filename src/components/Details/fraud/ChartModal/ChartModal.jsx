import React, { useEffect, useState } from 'react'
import { Button, Cascader, Dropdown, Menu, DatePicker, Modal, Empty, Tooltip } from 'antd';
import styles from '../style.less'
import _ from "lodash";
import moment from 'moment';
import axios from 'axios';
import ScatterFraud from '../Charts/ScatterFraud';
import { QuestionCircleOutlined } from '@ant-design/icons';
import BarLineFraud from '../Charts/BarLineFraud';
import NetworkFraud from '../Charts/NetworkFraud';
import FraudTable from '../Table/FraudTable';
import { commonApi } from '@/services/commonApi'


function ChartModal({ modalOptions, modelOptionsChange,proj, local, options }) {
  const [data, setData] = useState(undefined)


  useEffect(() => {
    if (!modalOptions ) return;
    console.log('modalOptions',modalOptions.details)
    Object.keys(modalOptions.details).forEach(item => {
      options[item] =  modalOptions.details[item]
    })
    
    if (!local){
      commonApi(modalOptions.api, {
        port: 5020,
        ...options
      }).then(res => {
        // if (res.respCode==='9999') { return }
        console.log('Post请求数据', res)
        setData(res)
      })
      return 
    }
  



    let formdata = new FormData()
    formdata.append('proj_id', proj)
    Object.keys(modalOptions.details).forEach(item => {
      formdata.append(item, modalOptions.details[item])
    })
    axios.post('http://192.168.8.165:5020/service-itdd-post/' + modalOptions.api, formdata)
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
        // console.log('Post请求数据', res.data.content)
      })
  }, [modalOptions,options])
  

  const Title = ()=>{
    return (
      <div style={{display:'flex',}}>
        <div style={{ userSelect: 'none',fontSize:'1.3rem',fontWeight:'550',color:'#808080',fontFamily: '"Inter", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif'}}>{data?.plt?.title}</div>
        <Tooltip placement="top" title={data?.plt?.title_notation} overlayClassName={styles.customTooltip}>
          <QuestionCircleOutlined style={{ marginTop: '3.5px',marginLeft:'15px',fontSize:'14px'}} /> 
        </Tooltip>  
      </div>
    )
  }
  return (
    <>
      <Modal
        title={data && Title()}
        centered
        visible={modalOptions}
        footer={null}
        onCancel={()=>{modelOptionsChange();setData(undefined)}}
        width={1400}
        id='area'
      >

        {
          data && data.plt.text ?
          <div 
            dangerouslySetInnerHTML={{__html: data.plt.text.replace(/\n/g, "<br />")}} 
            style={{
              fontSize:'14px',
              fontWeight:'300',
              color:'#808080',
              marginBottom:'1.5rem',
            }}
          />
          :null
        }

        {
          data && data.type === 'scatter' ?
            <ScatterFraud index={1} data={data && data.plt} />
          : data && data.type === "bar_line" ?
            <BarLineFraud index={1} data={data && data.plt} isPer={false}/>
          : data && data.type === "network" ?
            <NetworkFraud index={1} data={data && data.plt} />
          : data && data.type === "table" ?
            <FraudTable quantity="Raw" data ={data && data.plt}  proj={proj} />
          :<Empty style={{height:'555px',display:'flex',justifyContent:'center',alignItems:'center'}}/>
        }
        

        {/* <ScatterChart index={0} data={data}/> */}
      </Modal >
    </>
  )
}

export default ChartModal

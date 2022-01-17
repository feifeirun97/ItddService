
import React, { useEffect, useState } from 'react'
import SideMenu from '@/components/Details/model/SideMenu/sideMenu'
import axios from 'axios'
import { Button, Input } from 'antd'
import { commonApi } from '@/services/commonApi'
// import CustomHeader from "@/components/ProjectDetail/CustomHeader";
import TableModalUnit from './TableModalUnit';
import ChartTable from './ChartTable/ChartTable';
function FraudModel() {
  const urlList = {
    catlogGet: 'http://192.168.8.165:5020/service-itdd-get/get_catalog_doc',
    catlogPost: 'http://192.168.8.165:5020/service-itdd-post/get_catalog_fraud'
  }

  const [menuList, setMenuList] = useState([])
  const [urlValueList, setUrlValueList] = useState([])
  //获取纳税人
  const [options, setOptions] = useState(undefined)
  //projID
  const [inputProj, setInputProj] = useState('dcm_bop')
  //变化就刷新
  const [refresh, setRefresh]= useState(false)
  //测试本地or在线
  const [local, setLocal] = useState(false)

  // console.log(import('./index-online').then(res=>console.log(res.default)))
  useEffect(() => {
  
    if (!options?.type) return 
    console.log(JSON.stringify(options))
    //请求参数
    if (local){
      let formdata = new FormData()
      formdata.append('proj_id', inputProj)
      axios.post(urlList.catlogPost, formdata)
        .then(res => {
          console.log(res.data.content.cat[0].children[0].value)
          setUrlValueList(res.data.content.cat[0].children[0].value)
          setMenuList(res.data.content.cat)
        })
        .catch(err => console.log(err))
      return 
    }

    
    commonApi("get_catalog_fraud", {
      port: 5020,
      ...options
    }).then(res => {
      setUrlValueList(res.cat[0].children[0].value)
      setMenuList(res.cat)
    })

  }, [refresh])

  useEffect(() => {
    console.log('urlValueList change', urlValueList)
  }, [urlValueList])

  return (
    <>
      <div style={{width:'100%',backgroundColor:"#fff"}}>
          
        <Input placeholder="default:dcm_bop" style={{ height: '70%', width: '150px' }} onChange={(e) => { setInputProj(e.target.value) }} />
        <Button onClick={() => setLocal(!local)} style={{ color: 'red', margin: 'auto' }}>{local ? '当前为本地测试' : '当前为在线测试'}</Button>
        <Button onClick={() => {
          setOptions({type:"SaaS",proj_id:inputProj})
          
          setRefresh(!refresh)
        }}>Apply</Button>
              
        
      </div>
      <div style={{ position: 'relative', marginTop: '16px' }}>
        <SideMenu menuList={menuList} onChange={data1 => setUrlValueList(data1)} />
        {
          urlValueList.length ===1 
          ? <TableModalUnit urlValue={urlValueList[0]} proj={inputProj}  local={local} options={options}/>
          :urlValueList.length >1
          ?  <ChartTable urlValueList={urlValueList} proj={inputProj} local={local} options={options}/>
          :null
        }

      </div>
    </>
  )
}

export default FraudModel

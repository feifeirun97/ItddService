
import React, { useEffect, useState } from 'react'
import SideMenu from '@/components/Details/model/SideMenu/sideMenu'
import axios from 'axios'
import { Button, Input } from 'antd'
import { commonApi } from '@/services/commonApi'
import CustomHeader from "@/components/ProjectDetail/CustomHeader";
import TableModalUnit from './TableModalUnit';
import ChartTable from './ChartTable/ChartTable';
function FraudModel() {
  const [menuList, setMenuList] = useState([])
  const [urlValueList, setUrlValueList] = useState([])
  //获取纳税人
  const [options, setOptions] = useState(undefined)

  useEffect(() => {
    //请求参数
    if (!options) return 
    commonApi("get_catalog_fraud", {
      port: 5020,
      ...options
    }).then(res => {
      setUrlValueList(res.cat[0].children[0].value)
      setMenuList(res.cat)
    })


  }, [options])

  useEffect(() => {
    console.log('urlValueList change', urlValueList)
  }, [urlValueList])

  return (
    <>
      <CustomHeader callback={(val) => setOptions({ ...val,type:"SaaS",nsrsbh:'dcm_bop',proj_id: 'dcm_bop' })}>
      </CustomHeader>

      <div style={{ position: 'relative', marginTop: '16px' }}>
        <SideMenu menuList={menuList} onChange={data1 => setUrlValueList(data1)} fraud={true}/>
        {
          urlValueList.length ===1 
          ? <TableModalUnit urlValue={urlValueList[0]} proj={'dcm_bop'} local={false} options={options}/>
          :urlValueList.length >1
          ?  <ChartTable urlValueList={urlValueList} proj={'dcm_bop'} local={false} options={options}/>
          :null
        }

      </div>
    </>
  )
}

export default FraudModel

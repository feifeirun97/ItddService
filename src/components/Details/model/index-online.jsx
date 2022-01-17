
import React, { useEffect, useState } from 'react'
import SideMenu from '@/components/Details/model/SideMenu/sideMenu'
import ChartAndTableUnit from '@/components/Details/model/ChartTableUint'
import axios from 'axios'
import { Button, Input } from 'antd'
import styles from './style.less'
import { commonApi } from '@/services/commonApi'
import CustomHeader from "@/components/ProjectDetail/CustomHeader";
import { set } from 'lodash'
function NewModel() {

  //表格和图互动的纽带，每个图的key=index, value= selected_item_index, currentChange是当前要联动的表index
  //多图动态生成，下方usEeffect
  const [linkActive, setLinkActive] = useState('')
  const [menuList, setMenuList] = useState([])
  const [urlValueList, setUrlValueList] = useState(undefined)
  //获取纳税人
  const [options, setOptions] = useState(undefined)
  //测试input id



  const linkActiveChange = (index, data1) => {
    //浅拷贝 此时temp === linkActive [output = false]
    let temp = { ...linkActive }
    temp[index] = data1
    temp['currentChange'] = index

    //如果他们的字符串不同再去setState
    if (JSON.stringify(linkActive) !== JSON.stringify(temp)) setLinkActive(temp)
  }

  useEffect(() => {
      //post请求
      commonApi("get_catalog", {
        type: "SaaS",
        port: 5020,
        proj_id: 'gc_dxm',
        nsrsbh: 'gc_dxm',
        ...options
      }).then(res => {
        setUrlValueList(res.cat[0].children[0].value)
        setMenuList(res.cat)
      })
  }, [options])




  useEffect(() => {
    if (!urlValueList) return 
    console.log('urlValueList change', urlValueList)

    //reducer一般常用：类型的转换，去重，累加计算
    setLinkActive(urlValueList.reduce((accumulator, u, index) => {
      accumulator[index] = '';
      return accumulator
    }, { currentChange: '' }))

  }, [urlValueList])

  return (
    <>
      <CustomHeader callback={(val) => setOptions({ ...val, type: 'SaaS', nsrsbh:'gc_dxm' })}>
      </CustomHeader>


        <div style={{ position: 'relative', marginTop: '16px' }}>
        <SideMenu menuList={menuList} onChange={data1 => setUrlValueList(data1)} />
        <div style={{ maxHeight: 'calc(100vh - 166px)', overflowY: 'scroll' }}>
          {
            urlValueList?
            urlValueList.map((unit, index) => (
              <ChartAndTableUnit inputProj={'gc_dxm'} local={false} options={options} index={index} hasPer={unit.type === 'bar_line' && unit.percent === 0 ? false : true} urlValue={unit.key} type={unit.type} key={unit.key} linkActive={linkActive} linkActiveChange={(index, data1) => linkActiveChange(index, data1)} />
            ))
            :null
          }
        </div>
      </div>
  


    </>

  )
}

export default NewModel

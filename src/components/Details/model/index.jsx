
import React, { useEffect, useState } from 'react'
import SideMenu from '@/components/Details/model/SideMenu/sideMenu'
import ChartAndTableUnit from '@/components/Details/model/ChartTableUint'
import axios from 'axios'
import { Button, Input } from 'antd'
import styles from './style.less'
import { commonApi } from '@/services/commonApi'
// import CustomHeader from "@/components/ProjectDetail/CustomHeader";
import { set } from 'lodash'
function NewModel() {
  const urlList = {
    catlogGet: 'http://192.168.8.165:5020/service-itdd-get/get_catalog_doc',
    catlogPost: 'http://192.168.8.165:5020/service-itdd-post/get_catalog'
  }

  //表格和图互动的纽带，每个图的key=index, value= selected_item_index, currentChange是当前要联动的表index
  //多图动态生成，下方usEeffect
  const [linkActive, setLinkActive] = useState('')
  const [menuList, setMenuList] = useState([])
  const [urlValueList, setUrlValueList] = useState(undefined)
  //获取纳税人
  const [options, setOptions] = useState(undefined)
  //测试input id
  const [inputProj, setInputProj] = useState('gc_dxm')
  //测试type 
  const [type, setType] = useState('SaaS')
  //测试本地or在线
  const [local, setLocal] = useState(false)
  const [refresh,setRefresh] = useState(false)





  const linkActiveChange = (index, data1) => {
    //浅拷贝 此时temp === linkActive [output = false]
    let temp = { ...linkActive }
    temp[index] = data1
    temp['currentChange'] = index

    //如果他们的字符串不同再去setState
    if (JSON.stringify(linkActive) !== JSON.stringify(temp)) setLinkActive(temp)
  }

  useEffect(() => {
    console.log('linkActive,', linkActive)
  }, [linkActive])




  useEffect(() => {
    if (!(options && options.nsrsbh)) return
    //请求参数
    let formdata = new FormData()
    formdata.append('proj_id', inputProj)
    formdata.append('type', type)

    if (local) {
      axios.post(urlList.catlogPost, formdata)
        .then(res => {
          // console.log('cat-menulist',res.data.content.cat[0].children[0].value)
          setUrlValueList(res.data.content.cat[0].children[0].value)
          setMenuList(res.data.content.cat)
        })
        .catch(err => console.log(err))
    }
    else {
      //post请求
      if(options?.type){
      commonApi("get_catalog", {
        type: type,
        port: 5020,
        proj_id: options.nsrsbh,
        ...options
      }).then(res => {
        console.log('cat-menulist',res.cat)
        setUrlValueList(res.cat[0].children[0].value)
        setMenuList(res.cat)
      });
    }}

  }, [refresh])




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
      <div style={{width:'100%',backgroundColor:"#fff"}}>
       

          <Input placeholder="default:gc_dxm" style={{ height: '100%', width: '150px' }} onChange={(e) => { setInputProj(e.target.value) }} />
          <Button onClick={() => {
            if (type === 'SaaS') { setType('Retail') }
            else { setType('SaaS') }
          }}>{type}</Button>
           <Button onClick={() => setLocal(!local)} style={{color:'red',margin:'auto'}}>{local ? '当前为本地测试' : '当前为在线测试'}</Button>
          <Button onClick={() => {
            setOptions({nsrsbh:inputProj,type:type})
            setRefresh(!refresh)
          }}>Apply</Button>




        

      </div>

      {
        options?.type?
        <div style={{ position: 'relative', marginTop: '16px' }}>
        <SideMenu menuList={menuList} onChange={data1 => setUrlValueList(data1)} />
        <div style={{ maxHeight: 'calc(100vh - 166px)', overflowY: 'scroll' }}>
          {
            urlValueList?
            urlValueList.map((unit, index) => (
              <ChartAndTableUnit inputProj={inputProj} local={local} options={options} index={index} hasPer={unit.type === 'bar_line' && unit.percent === 0 ? false : true} urlValue={unit.key} type={unit.type} key={unit.key} linkActive={linkActive} linkActiveChange={(index, data1) => linkActiveChange(index, data1)} />
            ))
            :null
          }
        </div>
      </div>
      :null

      }


    </>

  )
}

export default NewModel

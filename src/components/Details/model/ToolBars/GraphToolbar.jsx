import React, { useEffect, useState } from 'react'
import { Button, Cascader, Dropdown, Menu } from 'antd';
import styles from '../style.less'
import _ from "lodash";
import moment from 'moment';
import { BarChartOutlined, DownOutlined, PercentageOutlined } from '@ant-design/icons';
import CompareModal from '../CompareModal/CompareModal';


function GraphToolbar({ index, chartTitle, data, dimension, onChange, display, onDateChange,compareList, isPer, hasPer, isPerOnchange, onCagrChange  }) {

  //一级选择菜单
  const handleMenuClick = (e, dim) => {
    //dimension是一个{‘requestKey’,'requestValue'}的字典列表
    //深拷贝 一晚上一个列表嵌套字典
    //e.key包含了key和value
    let kv = e.key.split(',')
    let temp = _.cloneDeep(dimension);

    temp.forEach(t => {
      if (t.requestKey === dim.dim) {
        t.requestValue = kv[0]
        t.displayName = kv[1]
      }
    })

    //如果他们的字符串不同再去setState
    if (JSON.stringify(dimension) !== JSON.stringify(temp)) onChange(temp)
  }
  const menu = (d, index) => {
    // console.log(dimension.requestValue)
    return (
      <Menu onClick={(e) => handleMenuClick(e, d)}>
        {Object.keys(d.options).map(s =>
          <Menu.Item key={[s, d.options[s]]} className={dimension[index].requestValue === s ? 'active1' : null}>
            {d.options[s]}
          </Menu.Item>
        )}
      </Menu>
    )
  };
  //二级选择菜单组件
  const cascaderOption = (dataSource) => {
    let flag = true; //标记数据是否为日期
    const pattern = /^(21|20|19)[0-9]{2}$/
    const baseOpt = Object.entries(dataSource).map(([value, label]) => ({
      value,
      label,
    }))
    flag = pattern.test(baseOpt[0].value)
    let arr
    // flag为true 时间维度, 通过Q,M判断二级菜单
    if (flag) {
      arr = baseOpt
        .filter(({ label }) => !label.includes("Q") && !label.includes("M"))
        .map((item) => {
          return {
            ...item,
            children: baseOpt
              .filter(({ label }) => {
                let bool = label.includes(item.label);
                //时间维度，二级菜单会显示该时间
                //不是而且不为‘all'，就不显示
                if (flag || label === 'all') return bool;
                return bool && label !== item.label;
              })
          };
        });
    }
    // flag为false 其他维度, 通过-判断二级菜单
    else {
      arr = baseOpt
        .filter(({ value }) => !value.includes("-"))
        .map((item) => {
          return {
            ...item,
            children: baseOpt
              .filter(({ value }) => {
                let bool = value.includes(item.value);
                //时间维度，二级菜单会显示该时间
                //不是而且不为‘all'，就不显示
                if (flag || value === 'all') return bool;
                return bool && value !== item.value;
              })
          };
        });
    }

    return arr
  }




  //日期格式’2018Q1‘ or 2018 or '2018-02'只要月份才能显示比较日期的选择框
  const hasCompare = () => {
    const dateData = data.line_data.length ? data.line_data : data.bar_data
    const dateSample = dateData[1][0] + ''
    if (!dateSample.includes('-')) return false
    return true
  }

  return (

    <div className={styles.graphToolbar} id='area'>
      {<div style={{fontSize:'1.3rem',fontWeight:'550',color:'#808080',fontFamily: '"Inter", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif'}}>{chartTitle}</div>}



      <div style={{ display: 'flex' }}>
        {
          data && hasCompare()
            ?
            <CompareModal index={index} data={data} onDateChange={onDateChange} compareList={compareList} hasPer={hasPer} isPer={isPer} isPerOnchange={data1 => setIsPer(data1)}/>
            :
            <div></div>
        }
        {
          data && data.markline_data
            ?
            <Button className={styles.option} onClick={()=>onCagrChange()}>
                CAGR Line
            </Button>
            :
            <div></div>
        }
        {display.map((d, index) => (
          d.stepwise_menu
            ?
            <Cascader
              getPopupContainer={() => document.getElementById('area')}
              key={d.dim}
              className={styles.cascader}
              expandTrigger="click"
              options={cascaderOption(d.options)}
              displayRender={label => label[label.length - 1]}
              defaultValue={[dimension[index].requestValue, dimension[index].requestValue]}
              onChange={(val) => {
                let temp = _.cloneDeep(dimension);
                temp.forEach(t => {
                  if (t.requestKey === d.dim) {
                    t.requestValue = val[1]
                    t.displayName = '级联选择无须displayName'
                  }
                })

                //如果他们的字符串不同再去setState
                if (JSON.stringify(dimension) !== JSON.stringify(temp)) onChange(temp)
              }}
            />
            :
            <Dropdown overlay={() => menu(d, index)} trigger={['click']} key={d.dim} getPopupContainer={() => document.getElementById('area')}>
              <Button className={styles.option}>
                {dimension[index].displayName ? dimension[index].displayName : 'rea'}<DownOutlined />
              </Button>

            </Dropdown>
        ))
        }

      </div>
    </div>
  )
}

export default GraphToolbar
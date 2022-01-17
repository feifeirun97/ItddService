import { Button, Input, InputNumber, Space, Table, Tooltip, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from '../style.less';
import { toCount, toPercentage } from '@/utils/math'
import ChartModal from '../ChartModal/ChartModal'
import numeral from 'numeral';
import { SearchOutlined } from '@ant-design/icons';
import _ from 'lodash'

const toDollar = (value, quantity) => {
  let q = quantity === "Raw" ? 1 : quantity === "Thousand" ? 1000 : quantity === "Million" ? 1000000 : 1000000000
  let num = Number(value) / q
  if (isNaN(num)) return '-'
  if (num === 0) return '$0'
  // console.log(quantity)
  if (Math.abs(num) < 0.0099) return 'N/A'
  if (q === 1000) return numeral(num).format('$0,0.00') + 'K'
  else if (q === 1000000) return numeral(num).format('$0,0.00') + 'M'
  else if (q === 1000000000) return numeral(num).format('$0,0.00') + 'B'
  return numeral(num).format('$0,0.00')
}


function FraudTable({ quantity, data, proj,local,options }) {
  const [columns, setColumns] = useState(undefined)
  const [modalOptions, setModalOptions] = useState(undefined)
  const [data2, setData2] = useState(undefined)
  const [compareList, setCompareList] = useState('')


  useEffect(() => {
    if (data) {
      setData2({ ...data })
      setCompareList(data.columns.filter(item => item.sort).
        reduce((accumulator, u, index) => {
          accumulator[u.name] = ['', ''];
          return accumulator
        }, {}))
    }
  }, [data])

  // useEffect(() => {
  //   if (compareList) {
  //     console.log('compareList', JSON.stringify(compareList))
  //   }
  // }, [compareList])




  const handleCompare = (type, name, value) => {
    const valueAfter = value.replace(/[^-0-9.0-9]/g, "").replace(/\.{2}/g, "")
    const len = valueAfter.split(".").length - 1
    console.log(type, name, value, compareList[name])
    const tempCompare = _.cloneDeep(compareList)
    if (type === 'lg') {
      if (len >= 2) { tempCompare[name][0] = `${valueAfter.split('.')[0]}.${valueAfter.split('.')[1]}` }
      else { tempCompare[name][0] = `${valueAfter}` }
      setCompareList(tempCompare)
    }
    else if (type === 'sm') {
      if (len >= 2) { tempCompare[name][1] = `${valueAfter.split('.')[0]}.${valueAfter.split('.')[1]}` }
      else { tempCompare[name][1] = `${valueAfter}` }
      setCompareList(tempCompare)
    }

  };

  const handleSubmitCompare = () => {
    const temp = { ...data2 }
    Object.keys(compareList).forEach(item => {
      const [num1, num2] = [parseFloat(compareList[item][0]), parseFloat(compareList[item][1])]
      if (num1 === NaN && num2 === NaN) return
      if (num1) {
        temp.table = temp.table.filter(d => d[item] >= num1)
      }
      if (num2) {
        temp.table = temp.table.filter(d => d[item] <= num2)
      }
    })
    setData2(temp)
  }



  useEffect(() => {

    if (!data2) return;
    // console.log(data2)
    let temp = []
    temp = data2.columns.map((item, index) => {

      const tempColumn = {
        title: item.name,
        dataIndex: item.name,
        width: 120,
        sorter: item.sort
          ? {
            compare: (a, b) => {
              if (a[item.name]) {
                return a[item.name] - b[item.name]
              } else {
                return 0
              }
            },
            multiple: 1,
          } : null,
        render: (text, record) => {
          if (text === "") return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#B8B8D9', userSelect: 'none' }}>-</div>
          const type = item.value_type
          let val
          if (typeof (text) === 'string' && text.length > 15) {

            return <Tooltip placement="top" title={`${item.name}: ${text}`} overlayClassName={styles.customTooltip}>
              <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', userSelect: 'none' }}>{text.substring(0, 10)}...</div>
            </Tooltip>
          }
          if (type === 'cnt') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#33334F', fontFamily: "Inter", userSelect: 'none' }}>{toCount(text)}</div>
          if (type === 'per') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#33334F', fontFamily: "Inter", userSelect: 'none' }}>{toPercentage(text)}</div>
          if (type === 'amt') {
            val = toDollar(text, quantity)
            if (text === 0 || val === 'N/A') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#B8B8D9', userSelect: 'none' }}>{val}</div>
            if (text > 0) return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', userSelect: 'none' }}>{val}</div>
            if (text < 0) return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', userSelect: 'none' }}>{val}</div>
          }
          return (<div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', userSelect: 'none' }}>{text}</div>)
        }
      }

      if (item.sort) {
        tempColumn.filterDropdown = () => {
          return (<div style={{ padding: '8px 12px ', width: 280 }}>
            <div style={{ marginBottom: '8px', userSelect: 'none', fontSize: '16px', fontWeight: '550', color: '#808080' }}>{item.name}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ userSelect: 'none', fontSize: '14px', fontWeight: '400', color: '#808080' }}>Larger than</div>
              <Input value={compareList[item.name][0]} style={{ marginBottom: 8, width: '130px', height: '20px' }} onChange={(e) => handleCompare('lg', item.name, e.target.value)} />


            </div >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ userSelect: 'none', fontSize: '14px', fontWeight: '400', color: '#808080' }}>Less than</div>
              <Input value={compareList[item.name][1]} style={{ marginBottom: 8, width: '130px', height: '20px' }} onChange={(e) => handleCompare('sm', item.name, e.target.value)} />
            </div>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>

              <Button type="primary" size='small' style={{ width: 110 }} onClick={() => handleSubmitCompare()}>Apply</Button>
              <Button type="primary" size='small' style={{ width: 110 }} onClick={() => {
                const tempCompare = _.cloneDeep(compareList);
                tempCompare[item.name] = ['', '']
                setCompareList(tempCompare);
                handleSubmitCompare()
                const temp = { ...data }
                Object.keys(compareList).forEach(i => {
                  const [num1, num2] = [parseFloat(compareList[i][0]), parseFloat(compareList[i][1])]
                  if (num1 === NaN && num2 === NaN ) return
                  if ( item.name === i ) return
                  if (num1) {
                    temp.table = temp.table.filter(d => d[i] >= num1)
                  }
                  if (num2) {
                    temp.table = temp.table.filter(d => d[i] <= num2)
                  }
                })
                setData2(temp)
              }}>Reset</Button>
            </Space>
          </div>)
        };
        tempColumn.filterIcon = <SearchOutlined style={{ color: compareList[item.name][0] || compareList[item.name][1]?'#2887fb':''}} />;
      }

      return tempColumn
    })
    if (data?.actions.length){
    temp.push({
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 110,
      render: (record) => {
        return (
          <div style={{ display: 'flex', flexDirection:'column',alignItems: 'space-between', userSelect: 'none' }}>
            {data2.actions.map((a,idx) => (
              <a key={idx} style={{ textDecoration: 'underline' }} onClick={() => setModalOptions({ details: record, api: a.api, title: data.title })}>{a.name}</a>
            ))}
          </div>
        )
      },
    })
  }
    setColumns(temp)
  }, [data2, quantity, compareList])



  return (
    <>
      <Table
        size='small'
        dataSource={data2 && data2.table}
        columns={columns}
        pagination={{ defaultPageSize: 15 }}
        defaultPageSize={20}
      // onChange={(pagination, filters, sorter, extra)=>{console.log(pagination, filters, sorter, extra)}}
      // scroll={{ x: 100 }}
      />
      <ChartModal modalOptions={modalOptions} modelOptionsChange={() => setModalOptions(undefined)} proj={proj} local={local} options={options}/>



      {/* <ChartModal  modalOptions={modalOptions}/> */}

    </>


  )
}

export default FraudTable



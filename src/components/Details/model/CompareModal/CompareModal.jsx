import React, { useEffect, useState } from 'react'
import { Button, Cascader, Dropdown, Menu, DatePicker, Modal } from 'antd';
import styles from '../style.less'
import _ from "lodash";
import moment from 'moment';
import { BarChartOutlined, DownOutlined, PercentageOutlined } from '@ant-design/icons';
import BarLineSimple from '../Charts/BarLineSimple';


//新建了一个BarLineSimple，因为不需要和表格联动，参数变少了
function CompareModal({ index, data, onDateChange, compareList, isPer, hasPer, isPerOnchange }) {
  //日期选择菜单
  const [modalOpen, setModalOpen] = useState(false);
  const [leftData, setLeftData] = useState(undefined);
  const [rightData, setRightData] = useState(undefined);


  useEffect(() => {
    if (!data) return 
    const dateData = data.line_data.length ? data.line_data : data.bar_data
    const [start, end] = [dateData[1][0], dateData[dateData.length - 1][0]]
    

    let calcDate = (date, diff) => {
      // 拆分年月日
      date  = date.split('-')
      // 得到月数
      const date2 = parseInt(date[0]) * 12 + parseInt(date[1])-diff
      let year = Math.floor(date2/12)
      let month = date2 - year*12
      if (month===0) {
        year -= 1
        month =12
      }
      return `${year}-${month<10?'0'+month:month}`
    }
    // console.log('periodAll,periodAll',[[calcDate(end,5),calcDate(end,3)],[calcDate(end,2),end]])
    onDateChange(1,1,1,[[calcDate(end,5),calcDate(end,3)],[calcDate(end,2),end]])
  }, [data])

  useEffect(() => {
    //开始结束日期， 字符串
    if (!compareList[0].length) return
    let [startDate, endDate] = compareList[0]
    let temp = {}
    //找到对应的Index [开始，结束]
    let indexList = [0, 0]
    let barLineData = data.bar_data.length? data.bar_data :data.line_data
    for (let i = 1; i < barLineData.length; i++) {
      barLineData[i][0] === startDate ? indexList[0] = i : null
      barLineData[i][0] === endDate ? indexList[1] = i : null
    }
    
    temp.line_data = data.line_data.filter((item, index) => {
      if (index === 0) return true
      if (index >= indexList[0] && index <= indexList[1]) return true
      return false
    })
    temp.line_data_per  = data.line_data_per
    temp.bar_data = data.bar_data.filter((item, index) => {
      if (index === 0) return true
      if (index >= indexList[0] && index <= indexList[1]) return true
      return false
    })

    setLeftData(temp)

  }, [compareList[0]])

  useEffect(() => {
    //开始结束日期， 字符串
    if (!compareList[1].length) return
    let [startDate, endDate] = compareList[1]
    let temp = {}
    //找到对应的Index [开始，结束]
    let indexList = [0, 0]
    let barLineData = data.bar_data.length? data.bar_data :data.line_data
    for (let i = 1; i < barLineData.length; i++) {
      barLineData[i][0] === startDate ? indexList[0] = i : null
      barLineData[i][0] === endDate ? indexList[1] = i : null
    }

    temp.line_data = data.line_data.filter((item, index) => {
      if (index === 0) return true
      if (index >= indexList[0] && index <= indexList[1]) return true
      return false
    })
    temp.line_data_per  = data.line_data_per
    temp.bar_data = data.bar_data.filter((item, index) => {
      if (index === 0) return true
      if (index >= indexList[0] && index <= indexList[1]) return true
      return false
    })

    setRightData(temp)

  }, [compareList[1]])

 

  const { RangePicker } = DatePicker;

  function disabledDate(current) {
    const dateData = data.line_data.length ? data.line_data : data.bar_data
    const [start, end] = [dateData[1][0], dateData[dateData.length - 1][0]]
    return current < moment(start, "YYYY-MM").endOf('day') || current > moment(end, "YYYY-MM").endOf('day');
  }
  return (
    <>
      <Button className={styles.option} onClick={() => setModalOpen(!modalOpen)} >
        Compare Dates
      </Button>
      <Modal
        title="Compare Dates"
        centered
        visible={modalOpen}
        footer={null}
        onCancel={() => setModalOpen(false)}
        width={1400}
        id='area'
      >
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ width: 700 }}>
            <div style={{ marginLeft: '200px', marginBottom: '1rem' }}>
              <RangePicker
                onChange={(date, dateString) => { onDateChange(date, dateString, 'start') }}
                size='small'
                picker="month"
                disabledDate={disabledDate}
                defaultValue={compareList[0].length?[moment(compareList[0][0], "YYYY-MM"),moment(compareList[0][1], "YYYY-MM")]:[]}
              />
            </div>
            <BarLineSimple index={15*(index+1)+1} data={leftData} isPer={isPer} hasPer={hasPer} isPerOnchange={isPerOnchange} />
          </div>


          <div style={{ color: '#7171A6', fontSize: '18px', margin: 'auto' }}>vs</div>

          <div style={{ width: 700 }}>
            <div style={{ marginLeft: '200px', marginBottom: '1rem' }}>
              <RangePicker
                onChange={(date, dateString) => { onDateChange(date, dateString, 'end') }}
                size='small'
                picker="month"
                disabledDate={disabledDate}
                defaultValue={compareList[1].length?[moment(compareList[1][0], "YYYY-MM"),moment(compareList[1][1], "YYYY-MM")]:[]}

              />
            </div>
            <BarLineSimple index={15*(index+1)+2} data={rightData} isPer={isPer} hasPer={hasPer} isPerOnchange={isPerOnchange} />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CompareModal

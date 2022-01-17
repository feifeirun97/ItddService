import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import styles from '../style.less';
import { Row, Col, Tooltip } from 'antd';
import { keepTwoDecimal, toCount, toPercentageTrend, toDollarAuto } from '@/utils/math'
import moment from 'moment';

//format '2018-12'
const calcDate = (date1, date2, diff) => {
  if (date2===undefined){return false}
  // 拆分年月日
  [date1, date2] = [date1.split('-'), date2.split('-')];
  // 得到月数
  date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
  date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
  return Math.abs(date1 - date2) === diff;
}
const fromat = (num, type) => {
  return type === 'amt' ? toDollarAuto(num) : type === 'cnt' ? toCount(num) : toPercentageTrend(num,true)
}

function TrendSummary({ data }) {
  const [itemsData, setItemsData] = useState(null)
  //日期格式’2018Q1‘ or 2018 or '2018-02'只要月份才能显示比较日期的选择框
  const hasCompare = () => {
    const dateSample = Object.keys(data[0])[3]
    if (!dateSample.includes('-')) return false
    return true
  }

  useEffect(() => {
    if (!data) return
    if (!hasCompare()) return
    
    setItemsData(
      data.map((item) => {
        const keys = Object.keys(item).filter(date=>!['attr','value_type','key'].includes(date))
        keys.sort((a, b) => {return moment(a) - moment(b)});
        const current = keys[keys.length - 1]
        const month1 = calcDate(current, keys[keys.length - 2], 1) && item[keys[keys.length - 2]]
        const month3 = calcDate(current, keys[keys.length - 4], 3) && item[keys[keys.length - 4]]
        const month6 = calcDate(current, keys[keys.length - 7], 6) && item[keys[keys.length - 7]]
        const month12 = calcDate(current, keys[keys.length - 13], 12) && item[keys[keys.length - 13]]
        const month24 = calcDate(current, keys[keys.length - 25], 24) && item[keys[keys.length - 25]]
        return {
          title: item.attr,
          type: item.value_type,
          months: [['Current', current], ['1 month ago',keys[keys.length - 2]],['3 months ago',keys[keys.length - 4]], ['6 months ago',keys[keys.length - 7]], ['12 months ago',keys[keys.length - 13]], ['24 months ago',keys[keys.length - 25]]],
          current: [item[current], ''],
          month1: [month1, month1 ? 100 * (item[current] - month1) / (month1) : ''],
          month3: [month3, month3 ? 100 * (item[current] - month3) / month3 : ''],
          month6: [month6, month6 ? 100 * (item[current] - month6) / month6 : ''],
          month12: [month12, month12 ? 100 * (item[current] - month12) / month12 : ''],
          month24: [month24, month24 ? 100 * (item[current] - month24) / month24 : ''],
        }
      }))
  }, [data])


  return (
    <>
      {
        data && hasCompare()
          ?
          <div className={styles.trendCard}>
            {
              itemsData
              ?
                <>
                  <div className={styles.header} >
                    <div></div>
                    {itemsData[0].months.map((date) => (
                      <Tooltip key={date}  placement="top" title={date[1]}  overlayClassName={styles.customTooltip}>
                        <div key={date} className={styles.headerItem}>{date[0]}</div>
                      </Tooltip>
                    ))}
                  </div>

                  <div className={styles.items}>
                    {itemsData.map((item) => (
                      <div key={item.title} className={styles.itemLayout}  >
                        {
                          Object.keys(item).map((key,index) => {
                            if (key === 'type' || key === 'months') return null

                            return (
                              <div className={styles.item} key={index}>
                                {key === 'title'
                                  ? <div className={styles.itemTitle}>{item[key]}</div>
                                  :
                                  <>
                                    <div className={styles.number}>{fromat(item[key][0], item.type)}</div>
                                    {
                                      <div className={styles.changePer} style={{ color: item[key][1] > 0 ? '#E84C85' : '#12C457', backgroundColor: item[key][1] > 0 ? '#f2eaef' : '#e7f1ed' }}>
                                        <div style={{ fontSize: '10px', marginRight: '3px' }}>
                                          {item[key][1] > 0 ? <CaretUpOutlined /> : item[key][1] < 0 ? <CaretDownOutlined /> : null}
                                        </div>
                                        <div>{toPercentageTrend(item[key][1])}</div>
                                      </div>

                                    }

                                  </>
                                }
                              </div>)
                          })
                        }
                      </div>
                    ))}
                  </div>
                </>
              : null
            }
          </div>
          : null
      }
    </>
  )
}

export default TrendSummary

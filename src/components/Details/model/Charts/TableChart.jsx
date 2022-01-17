import { useState, useEffect } from "react";
import { Table } from "antd";
import { toDollar, keepTwoDecimal, toCount, toPercentage } from "@/utils/math"
import { Effects } from "bizcharts";
import styles from '../style.less'


const renderFormat = (type, value) => type === 'amt' ? toWan(value) : type === 'per' ? toPercenr(value) : value;

function TableChart({ index, quantity, dataSource, linkActive, onChange }) {
  const [data, setData] = useState([])
  const [col, setCol] = useState([])

  useEffect(() => {
    if (!dataSource) return;
    const { key, attr, value_type, ...reset } = dataSource[0];
    const newAttr = Object.keys(reset)
    const newData = newAttr.map((item, index) => {
      return {
        attr: item,
        key: index + 1,
        ...dataSource.reduce((prev, d) => {
          prev[d.attr] = d[item];
          return prev
        }, {})
      }
    })
    setData([...newData])
  }, [dataSource])


  useEffect(() => {
    //index和当前变化表格index不同，直接return 
    if (index !== linkActive.currentChange) return
    // console.log('这是表' + index, 'link值' + linkActive[index])
    if (linkActive) {
      //find the table, thead and tbody
      const table = document.getElementsByClassName(styles.tableChart)[0]
      const thead = table.getElementsByClassName('ant-table-thead')[0].getElementsByClassName('ant-table-cell')
      const tbody = table.getElementsByClassName('ant-table-tbody')[0].getElementsByClassName('ant-table-row')

      //change the title
      //activeIndex work in tbody part
      let activeIndex = -1
      for (let i = 0; i < thead.length; i++) {
        if (i === linkActive[index]) {
          thead[i].scrollIntoView({
            behavior: "smooth", block: 'nearest', inline: "center"
          })
          thead[i].style.color = '#fff'
          thead[i].style.backgroundColor = '#6076fa'
          activeIndex = i
        } else {
          thead[i].style.color = 'black'
          thead[i].style.backgroundColor = 'white'
        }


        let bodyCells = null
        for (let i = 0; i < tbody.length; i++) {

          bodyCells = tbody[i].getElementsByClassName('ant-table-cell')
          for (let j = 0; j < bodyCells.length; j++) {
            if (j === activeIndex) {
              bodyCells[j].style.backgroundColor = '#eef0ff'
            } else {
              bodyCells[j].style.backgroundColor = 'white'
            }
          }

        }
      }
    }
  }, [linkActive])


  useEffect(() => {
    if (!data.length) return;
    let temp=[]
    Object.keys(data[0]).map(item => {
      if (item!=='key') { 
        temp.push({
          dataIndex: item,
          width: !dataSource.filter(d => d.attr === item).length ? 150 : 120,
          title: item === 'attr' ? '' : <div style={{ fontSize: '12px', fontWeight: '500', }}>{item}</div>,
          render: (text, record) => {
            if (!dataSource.filter(d => d.attr === item).length) return <div style={{ fontSize: '12px', fontWeight: '500', padding: '0px' }}>{text}</div>;
    
            const { value_type } = dataSource.filter(d => d.attr === item)[0];
    
            let decimal = keepTwoDecimal(text)
            let val
            if (value_type === 'cnt') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#33334F', fontFamily: "Inter" }}>{toCount(decimal)}</div>
            if (value_type === 'per') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#33334F', fontFamily: "Inter" }}>{toPercentage(decimal)}</div>
            if (value_type === 'amt') {
              val = toDollar(decimal, 'Raw')
              if (decimal === 0 || val === 'N/A') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#B8B8D9' }}>{val}</div>
              if (decimal > 0) return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#E84C85' }}>{val}</div>
              if (decimal < 0) return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#12C457' }}>{val}</div>
            }
          }
        })
      }

    })

    setCol([...temp])
  }, [data])

  return (
    <div className={styles.tableChart}>
      <Table
        size='small'
        dataSource={data}
        columns={col}
        scroll={{ x: 100 }}
        pagination={false}
        onRow={(record) => {
          return {
            onClick: event => {
              const table = document.getElementsByClassName(styles.tableChart)[0]
              const thead = table.getElementsByClassName('ant-table-thead')[0].getElementsByClassName('ant-table-cell')
              const tbody = table.getElementsByClassName('ant-table-tbody')[0].getElementsByClassName('ant-table-row')

              //record是当前行的内容，key，attr，value...
              let bodyCells = tbody[record.key - 1].getElementsByClassName('ant-table-cell')

              //遍历所有行元素
              for (let j = 1; j < bodyCells.length; j++) {
                // console.log('点击行遍历：')
                // console.log(bodyCells[j])
                // console.log('点击目标：')
                // console.log(event.target)
                // console.log('点击目标父级：')
                // console.log(event.target.parentElement)
                // console.log('===================')
                //点击目标和为cells，遍历得到当前点击值所在的索引
                if (bodyCells[j] === event.target) {
                  // console.log('+++++++++++++++++++++++++匹配成功传输索引', j)
                  onChange(index, j)
                }
                //点击目标和为cells下级的文字，需要设置为其父元素
                if (bodyCells[j] === event.target.parentElement) {
                  // console.log('+++++++++++++++++++++++++匹配成功传输索引', j)
                  onChange(index, j)
                }
              }
            },
          };
        }}
        onHeaderRow={(record) => {
          return {
            onClick: event => {
              for (let i = 1; i < record.length; i++) {
                if (event.target.innerText === record[i].dataIndex) {
                  // console.log('+++++++++++++++++++++++++匹配成功传输索引', i)
                  onChange(index, i)
                  return
                }
              }
            },
          };
        }}
      />
    </div>
  )
}

export default TableChart;

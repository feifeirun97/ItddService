import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { keepTwoDecimal, toCount, toPercentage, toDollar } from '@/utils/math'
import styles from '../style.less'
import moment from 'moment';

const CombTable = ({ index, quantity, data, linkActive, onChange }) => {
    const [columns, setColumns] = useState([])
    // console.log(data, columns)

    useEffect(() => {

        if (!data) return;
        let sortedData = Object.keys(data[0]).filter(date=>!['attr','value_type','key'].includes(date))
        sortedData.sort((a,b)=>{
            if (a.includes('Q')){
                if (a==='QTD') return 1
                if (b==='QTD') return -1
                a = parseInt(a.split('Q')[0]) + parseInt(a.split('Q')[1])*0.1
                b = parseInt(b.split('Q')[0]) + parseInt(b.split('Q')[1])*0.1
                return a-b
            }
            if (a.includes('y')|| b.includes('y')){
                console.log('yes',a,b)
                if (a==='YTD') return 1
                if (b==='YTD') return -1
                return parseInt(a.split('y')[0])-parseInt(b.split('y')[0])
            }
            return moment(a)-moment(b)
        })    

        let temp = [{
            title: "",
            width: 115,
            dataIndex: "attr",
            key: "attr",
            fixed: "left",
            render: text => <div style={{ fontSize: '12px', fontWeight: '500', padding: '0px',userSelect: 'none' }}>{text}</div>
        },]
        for (let i of sortedData) {
           
                let currentObj = {
                    title: <div style={{ fontSize: '12px', fontWeight: '500', userSelect: 'none',cursor:'pointer' }}>{i}</div>,
                    width: 120,
                    dataIndex: i,
                    key: i,
                    render: (text, record) => {
                        if (text==="") return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#B8B8D9',userSelect: 'none' }}>-</div>
                        let decimal = keepTwoDecimal(text)
                        let val
                        if (record.value_type === 'cnt') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#33334F', fontFamily: "Inter",userSelect: 'none' }}>{toCount(decimal)}</div>
                        if (record.value_type === 'per') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#33334F', fontFamily: "Inter",userSelect: 'none' }}>{toPercentage(decimal)}</div>
                        if (record.value_type === 'amt') {
                            val = toDollar(decimal, quantity)
                            if (decimal === 0 || val === 'N/A') return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#B8B8D9',userSelect: 'none' }}>{val}</div>
                            if (decimal > 0) return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#E84C85',userSelect: 'none' }}>{val}</div>
                            if (decimal < 0) return <div style={{ fontSize: '12px', fontWeight: '400', padding: '0px', color: '#12C457',userSelect: 'none' }}>{val}</div>
                        }
                    }
                }
                if (!(currentObj in columns)) {

                    temp.push(currentObj)
                }
            
        }


        setColumns(temp)
    }, [data, quantity])

    useEffect(() => {
        //index和当前变化表格index不同，直接return 
        if (index !== linkActive.currentChange) return
        // console.log('这是表' + index, 'link值' + linkActive[index])
        if (linkActive) {
            //find the table, thead and tbody
            const table = document.getElementsByClassName(styles.combTable + index)[0]
            const thead = table.getElementsByClassName('ant-table-thead')[0].getElementsByClassName('ant-table-cell')
            const tbody = table.getElementsByClassName('ant-table-tbody')[0].getElementsByClassName('ant-table-row')

            for (let i = 1; i < thead.length; i++) {
                if (i === linkActive[index]) {
                    thead[i].scrollIntoView({behavior: "smooth", block: 'nearest', inline: "center"})
                    thead[i].style.color = '#fff'
                    thead[i].style.backgroundColor = '#6076fa'
                } else {
                    thead[i].style.color = 'black'
                    thead[i].style.backgroundColor = '#fafafa'
                }

                let bodyCells = null
                for (let i = 0; i < tbody.length; i++) {
                    bodyCells = tbody[i].getElementsByClassName('ant-table-cell')
                    for (let j = 1; j < bodyCells.length; j++) {
                        if (j === linkActive[index]) {
                            bodyCells[j].style.backgroundColor = '#eef0ff'
                        } else {
                            bodyCells[j].style.backgroundColor = 'white'
                        }
                    }
                }
            }
        }
    }, [linkActive, data])

    
    return (

        <div className={styles.combTable + index} >
            <Table
                size='small'
                dataSource={data}
                columns={columns}
                scroll={{ x: 100 }}
                pagination={false}
                // loading={data?false:true}
                onRow={(record) => {
                    return {
                        onClick: event => {
                            const table = document.getElementsByClassName(styles.combTable+index)[0]
                            const thead = table.getElementsByClassName('ant-table-thead')[0].getElementsByClassName('ant-table-cell')
                            const tbody = table.getElementsByClassName('ant-table-tbody')[0].getElementsByClassName('ant-table-row')
                            
                            //record是当前行的内容，key，attr，value...
                            let bodyCells = tbody[record.key-1].getElementsByClassName('ant-table-cell')

                            //遍历所有列
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
                                    onChange(index,j)
                                }
                                //点击目标和为cells下级的文字，需要设置为其父元素
                                if (bodyCells[j] === event.target.parentElement) {
                                    // console.log('+++++++++++++++++++++++++匹配成功传输索引', j)
                                    onChange(index,j)
                                }
                            }
                        },
                        onMouseEnter: event => { }, // 鼠标移入行
                        onMouseLeave: event => { },
                    };
                }}
                onHeaderRow={(record) => {
                    return {
                        onClick: event => {
                            for (let i = 1; i < record.length; i++) {
                                if (event.target.innerText === record[i].dataIndex) {
                                    // console.log('+++++++++++++++++++++++++匹配成功传输索引', i)
                                    onChange(index,i)
                                    return
                                }
                            }
                        },
                        onMouseEnter: event => { }, // 鼠标移入行
                        onMouseLeave: event => { },
                    };
                }}

            ></Table>
        </div>
    )

};

export default CombTable;

//

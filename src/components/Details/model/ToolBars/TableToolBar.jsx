import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Menu, Tooltip } from 'antd';

import styles from '../style.less'
import { DownOutlined, QuestionCircleOutlined } from '@ant-design/icons';


function TableToolbar({ quantity, onChange, title }) {

  // useEffect(() => {
  //   title && console.log('title', title)
  // }, [title])

  const display = ['Raw', 'Thousand', 'Million', 'Billion']

  const menu = (

    <Menu onClick={(e) => onChange(e.key)}>
      {display.map(q =>
        <Menu.Item key={q} className={q === quantity ? styles.active : null}>
          {q}
        </Menu.Item>
      )}
    </Menu>
  )


  return (

    <div className={styles.tableToolBar} >
      {title
        ? <div style={{ userSelect: 'none',display:'flex'}}>
           <div style={{ userSelect: 'none',fontSize:'1.3rem',fontWeight:'550',color:'#808080',fontFamily: '"Inter", system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif'}}>{title.title}</div>
           <Tooltip placement="top" title={title.notation} overlayClassName={styles.customTooltip}>
            <QuestionCircleOutlined style={{ marginTop: '0.5rem',marginLeft:'15px'}} /> 
          </Tooltip>  
          </div>
        : <div></div>
      }

      <div style={{display:'flex'}}>
        <Dropdown overlay={menu} trigger={['hover']} key={quantity}>
          <Button className={styles.option} >
            {quantity ? quantity : 'Raw'}<DownOutlined />
          </Button>

        </Dropdown>

        <Tooltip placement="top" title='Switch monetary unit' overlayClassName={styles.customTooltip}>
          <QuestionCircleOutlined style={{ marginTop: '0.5rem' }} />
        </Tooltip>
      </div>



    </div>
  )
}

export default TableToolbar
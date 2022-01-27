
import React, { useEffect, useState } from 'react'
import styles from '../style.less'
import { Button } from 'antd';

import { useIntl } from 'umi';
import ProjModal from '../Modal/ProjModal';

export default function Toolbar() {
  const intl = useIntl();
  const [projInfoOpen, setProjInfoOpen] = useState(false)
  // const handleProjClick = ()=>{

  // }
  return (
    <>
      <div className={styles.toolbar}>
        <h1>
          {intl.formatMessage({ id: 'pages.projList.title' })}
        </h1>
        <Button type='primary' onClick={()=>setProjInfoOpen(true)}>
          {intl.formatMessage({ id: 'pages.projList.newProj' })}
        </Button>
      </div>
      <ProjModal projInfoOpen={projInfoOpen} projOnchange={()=>setProjInfoOpen(false)} />
    
    </>

  )
}

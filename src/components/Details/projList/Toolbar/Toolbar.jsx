
import React, { useEffect, useState } from 'react'
import styles from '../style.less'
import { Button } from 'antd';
import ProjModal from '../Modal/ProjModal';
import { useIntl } from 'umi';

export default function Toolbar() {
  const [projInfoOpen, setProjInfoOpen] = useState(false)
  const intl = useIntl();
  // const handleProjClick = ()=>{

  // }
  return (
    <>
      <div className={styles.toolbar}>
        <h1>
          {intl.formatMessage({ id: 'pages.projList.title' })}
        </h1>
        <Button type='primary' onClick={() => setProjInfoOpen(true)}>
          {intl.formatMessage({ id: 'pages.projList.newProj' })}
        </Button>
      </div>

      <ProjModal projInfoOpen={projInfoOpen} projOnchange={() => setProjInfoOpen(false)} />
    </>

  )
}

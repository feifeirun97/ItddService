import React, { useEffect, useState } from 'react'

import NewModel from '@/components/Details/model'
import styles from '../style.less'

function index() {

  return (
    <div className={styles.metrics}>
      <NewModel/>
    </div>
    
  )
}

export default index

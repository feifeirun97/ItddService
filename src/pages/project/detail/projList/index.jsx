import React, { useEffect, useState } from 'react'

import ProjList from '@/components/Details/projList'
import styles from '../style.less'

function index() {

  return (
    <div className={styles.projList}>
      <ProjList />
    </div>

  )
}

export default index

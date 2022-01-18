import FraudModel from '@/components/Details/fraud'
import React, { useEffect, useState } from 'react'
import styles from '../style.less'



function index() {
  return (
    <div className={styles.fraud}>
      <FraudModel />
    </div>
    
  )
}

export default index

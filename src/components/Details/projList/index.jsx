import React, { useEffect, useState } from 'react'
import ProjTable from './Table/ProjTable'
import styles from './style.less'
import Toolbar from './Toolbar/Toolbar'
import {SelectLang } from 'umi';
import ProjModal from './Modal/ProjModal';
function ProjList() {
  
  return (
    <>
    <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
    <img className={styles.logo} alt="logo" src="http://api.opm.dev.aitaigroup.com/InvestManagement/framework/static/maxval_highres.7018e226.png" />
    <div className={styles.projList}>
     <Toolbar />
     <ProjTable />
   </div>

    </>

    
  )
}

export default ProjList

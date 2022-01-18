
import React, { useEffect, useState } from 'react'
import { Modal, Button, Table } from 'antd';
import styles from '../style.less'
import cookies from "react-cookies";
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
const data = [
  {
    key: '1',
    version: '1.0.1',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    version: '1.0.1',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    version: '1.0.1',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    version: '1.0.1',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },

];


function VersionModal({ versionOpen, versionOnchange }) {
  const intl = useIntl();
  const columns = [
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      render: text =>
        <div>{text}</div>
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: ()=><a onClick={()=>history.push('/project')}>{intl.formatMessage({ id: 'pages.projList.choose' })}</a>
    },
  ];
  

  return (
    <div className={styles.versionModal}>
      <Modal
        title={intl.formatMessage({ id: 'pages.projList.version' })}
        visible={versionOpen}
        // centered
        footer={null}
        onCancel={versionOnchange}
        width={600}
        id='area'
      >
        <Table
          className={styles.versionTable}
          columns={columns}
          dataSource={data}
          size='small'
        />
      </Modal>
    </div>

  )
}

export default VersionModal

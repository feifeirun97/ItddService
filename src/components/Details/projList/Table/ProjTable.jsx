import React, { useEffect, useState } from 'react'
import { Table, Tag, Space } from 'antd';
import styles from '../style.less'
import VersionModal from '../Modal/VersionModal';
import cookies from "react-cookies";
import { useIntl } from 'umi';
const data = [
  {
    key: '1',
    name: '成都锅圈食汇',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: '山西锅圈食汇商业管理有限公司',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: '上海锅圈食汇商贸有限公司',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '4',
    name: '沉阳锅圈食汇商业管理有限公司',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '5',
    name: '郑州锅圈食汇网络科技有限公司',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '6',
    name: '杭州锅圈食汇网络科技有限公司',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '7',
    name: '南昌锅圈食汇商贸有限公司',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    key: '8',
    name: '武汉锅圈食汇商贸有限公司',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];




export default function ProjTable() {
  const [versionOpen, setVersionOpen] = useState(false)
  const intl = useIntl();
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text =>
        <div>
          <div>{text}</div>
          <a onClick={()=>setVersionOpen(true)}>{intl.formatMessage({ id: 'pages.projList.version' })}</a>
  
        </div>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a>Edit</a>
          <a >Delete</a>
        </Space>
      ),
    },
  ];

  const handleVersionClick = () => {

  }
  return (
    <>
      <Table
        className={styles.ProjTable}
        columns={columns}
        dataSource={data}
        size={'large'}
        pagination={{ defaultPageSize: 8 }}
      />
      <VersionModal versionOpen={versionOpen} versionOnchange={()=>setVersionOpen(false)} />
    </>
  )
}

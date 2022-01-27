import React, { useEffect, useState } from 'react'
import { Table, Tag, Space, notification, Empty } from 'antd';
import styles from '../style.less'
import VersionModal from '../Modal/VersionModal';
import cookies from "react-cookies";
import { useIntl } from 'umi';
import request from "@/utils/request";
import EditModal from '../Modal/EditModal';



export default function ProjTable({ }) {
  const [versionOpen, setVersionOpen] = useState(false)
  const [tableData, setTableData] = useState(undefined)
  const [columns, setColumns] = useState(undefined)
  //控制EditModal
  const [editOpen, setEditOpen] = useState(false)
  const [editDetails, setEditDetails] = useState(undefined)
  const intl = useIntl();

  //点击Edit先请求一次查看后台是否完成数据导入了
  const handleEdit = (record) => {
    console.log(record)
    request(
      "itdd-service/itddProject/getProjStatus",
      { params: { "projectId": "zn_kjws" }, method: 'GET' }
    ).then(res => {
      const data = res?.data
      if (data?.status !== '处理完成') { notification.info({ message: '后台处理中，请耐心等待' }); return }
      setEditOpen(true)
      setEditDetails(record)
    }).catch(error => {
      notification.error({ message: error?.data?.data?.error || '项目状态请求错误' })
    })
  }

  //请求项目列表
  useEffect(() => {
    request(
      "itdd-service/itddProject/pageItddProject",
      { data: { "current": 1, "size": 8 } }
    ).then(res => {
      const data = res?.data?.data
      console.log('项目列表', data)
      // console.log(JSON.stringify(new Date(data.records[0].createTime)).split('T')[0].replace('"', ''))

      if (res?.data?.data?.records?.length) setTableData(data.records)
    }).catch(error => {
      notification.error({ message: error?.data?.data?.error || '项目列表请求错误' })
    })
  }, [])

  //得到项目列表数据生成表格
  useEffect(() => {
    if (!tableData) return
    const columns = [
      {
        title: 'Name',
        dataIndex: 'projectName',
        key: 'projectName',
        render: text =>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{text}</div>
            <a onClick={() => setVersionOpen(true)}>{intl.formatMessage({ id: 'pages.projList.version' })}</a>
          </div>,
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'UpdateTime',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: text =>
          // console.log(JSON.stringify(new Date(data.records[0].createTime)).split('T')[0].replace('"', ''))
          <div>
            <div>{JSON.stringify(new Date(text)).split('T')[0].replace('"', '')}</div>
          </div>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Space size="middle">
            <a onClick={() => handleEdit(record)}>Edit</a>
          </Space>
        ),
      },
    ]
    setColumns(columns)

  }, [tableData])

  return (
    <>
      {
        tableData ?
          <>
            <Table
              className={styles.ProjTable}
              columns={columns}
              dataSource={tableData}
              size={'large'}
              pagination={{ defaultPageSize: 8 }}
            />
            <VersionModal versionOpen={versionOpen} versionOnchange={() => setVersionOpen(false)} />
          </>
          : <Empty description='当前用户的项目列表为空，请新增项目' style={{ height: '735px', width: '100%', flexDirection: 'column', display: 'flex', paddingTop: '120px' }} />
      }

      <EditModal editOpen={editOpen} editDetails={editDetails} editOnchange={() => setEditOpen(false)} />


    </>
  )
}


import React, { useEffect, useState } from 'react'
import { Modal, Button, Select, Tabs, notification, DatePicker, Input } from 'antd';
import styles from '../style.less'
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import request from "@/utils/request";
const { TabPane } = Tabs;

function ProjModal({ projInfoOpen, projOnchange }) {
  const intl = useIntl();


  function callback(key) {
    console.log(key);
  }

  function submitNewProj(values) {
    console.log(values);
    request(
      "itdd-service/itddProject/createParentProject",
      { data: {...values} }
      
    ).then(res => {
      const data = res?.data?.data
      console.log('新增项目', data)
      if (res?.data?.data?.records?.length) setTableData(res.data.data.records)
    }).catch(error => {
      notification.error({ message: error?.data?.data?.error || '新增项目请求错误' })
    })
    console.log('yes')
  }


  return (
    <div className={styles.projModal}>
      <Modal
        title={intl.formatMessage({ id: 'pages.projList.newProj' })}
        visible={projInfoOpen}
        // centered
        footer={null}
        onCancel={()=>projOnchange()}
        width={700}
        id='area'
      >
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab={intl.formatMessage({ id: 'pages.projList.enterpriseInfo' })} key="1">
            <ProForm onFinish={submitNewProj}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 3fr 1fr' }}>
                <ProFormText label={'项目id'} name='projectId' width="sm" rules={[{ required: true, message: '必填' }]} />
                <ProFormText label={'项目简称'} name='projectName' width="sm" rules={[{ required: true, message: '必填' }]} />
                <ProFormSelect
                  name="type"
                  label="Type"
                  valueEnum={{
                    SaaS: 'SaaS',
                    Retail: 'Retail',
                  }}
                  width='100px'
                  placeholder="Type"
                  rules={[{ required: true, message: '必选' }]}
                />
              </div>
            </ProForm>
          </TabPane>

          {/* {
            editProj ?
              <TabPane tab={intl.formatMessage({ id: 'pages.projList.version' })} key="2">
                <Tabs defaultActiveKey="1" onChange={callback}>
                  <TabPane tab={'子版本1'} key="1">
                    <div style={{ width: '50%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <Button type='primary'>新增筛选 +</Button>
                      <Button type='primary'>新增映射 +</Button>
                      <Button type='primary'>新增别名 +</Button>
                    </div>
                    <ProForm >
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                        <ProFormFieldSet name="list" label={'项目id'} initialValue={'gc_dxm2'}>
                          <div>gc_dxm2</div>
                        </ProFormFieldSet>
                        <ProFormFieldSet label={intl.formatMessage({ id: 'pages.projList.enterpriseShortName' })}>
                          <ProFormText width="sm" />
                        </ProFormFieldSet>
                        <ProFormFieldSet label={'数据筛选'}>
                          <RangePicker
                            onChange={(r) => console.log(r)}
                            size='small'
                            picker="month"
                            style={{ width: 215 }}
                          // disabledDate={disabledDate}
                          // defaultValue={compareList[1].length ? [moment(compareList[1][0], "YYYY-MM"), moment(compareList[1][1], "YYYY-MM")] : []}
                          />
                        </ProFormFieldSet>
                        <ProFormFieldSet label={'数据筛选'} initialValue={'1000<amt'}>
                          <Input style={{ width: 215 }} defaultValue={'1000<amt'} />
                        </ProFormFieldSet>
                        <ProFormFieldSet label={'数据筛选'}>
                          <Input style={{ width: 215 }} defaultValue={'province in [“北京”, “上海”]'} />
                        </ProFormFieldSet>
                        <ProFormFieldSet label={'字段映射'}>
                          <Input style={{ width: 215 }} defaultValue={'member_id —> uid'} />
                        </ProFormFieldSet>
                        <ProFormFieldSet label={'字段映射'}>
                          <Input style={{ width: 215 }} defaultValue={'company_size —> province'} />
                        </ProFormFieldSet>
                        <ProFormFieldSet label={'字段映射'}>
                          <Input style={{ width: 215 }} defaultValue={'province —> company_size'} />
                        </ProFormFieldSet>
                      </div>
                    </ProForm>
                  </TabPane>


                  <TabPane tab={'子版本2'} key="2">
                    Content of Tab Pane 2
                  </TabPane>



                </Tabs>
              </TabPane>
              : null
          } */}

        </Tabs>
      </Modal>
    </div>

  )
}

export default ProjModal


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

function EditModal({ editOpen, editOnchange, editDetails }) {
  const intl = useIntl();
  const { RangePicker } = DatePicker;
  function callback(key) {
    console.log(key);
  }

  return (
    <div className={styles.editModal}>
      <Modal
        title={intl.formatMessage({ id: 'pages.projList.version' })}
        visible={editOpen}
        // centered
        footer={null}
        onCancel={() => editOnchange()}
        width={700}
        wrapClassName={styles.editModal}
      >
        <div className={styles.editDetails}>
          <div>{editDetails?.projectName}</div>
          <div>{editDetails?.projectId}</div>
          <div>{editDetails?.type}</div>
        </div>
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

      </Modal>
    </div>

  )
}

export default EditModal

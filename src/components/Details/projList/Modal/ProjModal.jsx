
import React, { useEffect, useState } from 'react'
import { Modal, Button, Table, Tabs, Grid } from 'antd';
import styles from '../style.less'
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
const { TabPane } = Tabs;

function ProjModal({ projInfoOpen, projOnchange }) {
  const intl = useIntl();
  function callback(key) {
    console.log(key);
  }


  return (
    <div className={styles.projModal}>
      <Modal
        title={intl.formatMessage({ id: 'pages.projList.newProj' })}
        visible={projInfoOpen}
        // centered
        footer={null}
        onCancel={projOnchange}
        width={600}
        id='area'
      >
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab={intl.formatMessage({ id: 'pages.projList.enterpriseInfo' })} key="1">
            <ProForm >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <ProFormFieldSet name="list" label={intl.formatMessage({ id: 'pages.projList.enterpriseFullName' })}>
                  <ProFormText width="sm" />
                </ProFormFieldSet>
                <ProFormFieldSet label={intl.formatMessage({ id: 'pages.projList.TIN' })}>
                  <ProFormText width="sm" />
                </ProFormFieldSet>
                <ProFormFieldSet label={intl.formatMessage({ id: 'pages.projList.enterpriseShortName' })}>
                  <ProFormText width="sm" />
                </ProFormFieldSet>
              </div>
            </ProForm>
          </TabPane>


          <TabPane tab={intl.formatMessage({ id: 'pages.projList.version' })} key="2">
            Content of Tab Pane 2
          </TabPane>
        </Tabs>
      </Modal>
    </div>

  )
}

export default ProjModal

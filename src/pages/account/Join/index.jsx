import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, List, Avatar, Form, InputNumber } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import ProDescriptions from '@ant-design/pro-descriptions';
import { searchGroup, joinGroup } from './service';

import moment from 'moment';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await joinGroup(fields);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
const TableList = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState(false);
  /** 分布更新窗口的弹窗 */

  const [showDetail, setShowDetail] = useState(false);
  const actionRef = useRef();
  const [currentRow, setCurrentRow] = useState();

  /** 国际化配置 */

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      tip: '名称用于区分不同的团',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '创建者',
      dataIndex: 'creator_name',
      valueType: 'textarea',
    },
    {
      title: '联系方式',
      dataIndex: 'creator_phone',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '团购状态',
      dataIndex: 'type',
      valueEnum: {
        0: {
          text: '全部',
          status: 'Default',
        },
        1: {
          text: '已经创建',
          status: 'Processing',
        },
        2: {
          text: '正在规划',
          status: 'Warning',
        },
        3: {
          text: '正在配送',
          status: 'Default',
        },
        4: {
          text: '已完成',
          status: 'Success',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      valueType: 'dateTime',
      hideInSearch: true,

      render: (dom, item) => {
        console.log(item);
        return (
          <span>{moment(parseInt(item.created_time) * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="details"
          onClick={() => {
            setCurrentRow(record);
            setShowDetail(true);
          }}
        >
          查看详情
        </a>,
        <a
          key="subscribeAlert"
          onClick={() => {
            setCurrentRow(record);
            handleModalVisible(true);
          }}
        >
          参团
        </a>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable
        headerTitle="开团列表"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          console.log(params, sort, filter);
          let group_type = params.type;
          let value, search_type;
          if (params.name) {
            search_type = 0;
            value = params.name;
          } else if (params.description) {
            search_type = 2;
            value = params.description;
          } else if (params.creator_name) {
            search_type = 1;
            value = params.creator_name;
          }
          const result = await searchGroup({
            page_size: params.pageSize,
            page_num: params.current,
            search_type,
            value,
            group_type,
          });
          return {
            data: result.data.data,
            success: true,
            total: result.data.count,
          };
        }}
        columns={columns}
      />
      <ModalForm
        title="加入团购"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          let request = {
            id: currentRow.id,
            data: [],
          };
          for (let i in value) {
            request.data.push({
              commodity_id: parseInt(i),
              number: value[i],
            });
          }
          const success = await handleAdd(request);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        {currentRow?.commodity_detail.map((r) => (
          <Form.Item
            key={r.id}
            name={r.id}
            label={r.name + ' ' + r.price + '元'}
            required={true}
            tooltip={
              '单价：' +
              r.price +
              '元\n' +
              '我已购买：' +
              r.number +
              '斤\n' +
              '整个团购买' +
              r.total_number +
              '斤'
            }
            rules={[
              {
                required: true,
                message: '请输入数量',
              },
            ]}
          >
            <InputNumber key={1000 + r.id} />
          </Form.Item>
        ))}
      </ModalForm>

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <>
            <ProDescriptions
              column={1}
              title={currentRow?.name}
              request={async () => ({
                data: currentRow || {},
              })}
              columns={columns}
            >
              <ProDescriptions.Item dataIndex="id" label="id" />
              <ProDescriptions.Item dataIndex="name" label="名称" valueType="textarea" />
              <ProDescriptions.Item label="参加人数" dataIndex="user_number" valueType="textarea" />
              <ProDescriptions.Item label="总金额" dataIndex="total_price" valueType="textarea" />
            </ProDescriptions>
            <List
              itemLayout="horizontal"
              dataSource={currentRow?.commodity_detail}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={item.name}
                    style={{ whiteSpace: 'pre-wrap' }}
                    description={
                      '单价：' +
                      item.price +
                      '元\n' +
                      '我已购买：' +
                      item.number +
                      '斤\n' +
                      '整个团购买:' +
                      item.total_number +
                      '斤'
                    }
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;

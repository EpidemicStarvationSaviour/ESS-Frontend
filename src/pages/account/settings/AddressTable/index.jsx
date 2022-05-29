import React, { useState } from 'react';
import styles from './index.less';
import {
  Table,
  Tag,
  notification,
  Button,
  Form,
  Cascader,
  Modal,
  Input,
  Switch,
  message,
} from 'antd';
import { useModel } from 'umi';
import { deleteAddress, newAddress, setDefaultAddress } from './service';
import { MapOptions } from '../../../../utils/map';
const columns = [
  {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
  },
  {
    title: '市区',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: '区',
    dataIndex: 'area',
    key: 'area',
  },
  {
    title: '详细地址',
    dataIndex: 'detail',
    key: 'detail',
  },
  {
    title: '默认',
    key: 'is_default',
    dataIndex: 'is_default',
    render: (is_default) => (
      <span>{is_default ? <Tag color="green">是</Tag> : <Tag color="red">否</Tag>}</span>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <span>
        <a
          style={{
            marginRight: 16,
          }}
          onClick={async () => {
            try {
              let res = await setDefaultAddress(record.id);
              if (res.status === 'success') {
                // 刷新页面
                window.location.reload();
              } else {
                notification.error({
                  message: '操作失败',
                  description: res.msg,
                });
              }
            } catch (e) {
              notification.error({
                message: '操作失败',
                description: e.message,
              });
            }
          }}
        >
          设为默认
        </a>
        <a
          onClick={async () => {
            try {
              let res = await deleteAddress(record.id);
              if (res.status === 'success') {
                // 刷新页面
                window.location.reload();
              } else {
                notification.error({
                  message: '操作失败',
                  description: res.msg,
                });
              }
            } catch (e) {
              notification.error({
                message: '操作失败',
                description: e.message,
              });
            }
          }}
        >
          删除
        </a>
      </span>
    ),
  },
];
const data = [
  {
    id: 1, //address id
    lat: 123.111,
    lng: 39.123,
    province: '河南省',
    city: '三门峡市',
    area: '湖滨区',
    detail: '六峰路绿江中央广场2号楼3单元109',
    is_default: true,
  },
  {
    id: 2, //address id
    lat: 123.111,
    lng: 39.123,
    province: '河南省',
    city: '三门峡市',
    area: '湖滨区',
    detail: '六峰路绿江中央广场2号楼3单元109',
    is_default: false,
  },
];
export default () => {
  const {
    initialState: { currentUser: currentUser },
    loading,
    refresh,
    setInitialState,
  } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Modal
        visible={visible}
        title="新建地址"
        okText="创建"
        cancelText="取消"
        onCancel={() => setVisible(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              let v = {
                province: values.address[0],
                city: values.address[1],
                area: values.address[2],
                details: values.address_detail,
                is_default: values.is_default,
              };
              console.log(v);
              return newAddress(v);
            })
            .then((r) => {
              message.success('创建成功');
              refresh();
            })
            .catch((info) => {
              notification.error({
                message: '创建失败',
                description: info.msg,
              });
            });
        }}
      >
        <Form form={form} layout="vertical" name="form_in_modal" initialValues={{}}>
          <Form.Item
            name="address"
            label="地址选择"
            rules={[
              {
                type: 'array',
                required: true,
                message: 'Please select your habitual residence!',
              },
            ]}
          >
            <Cascader options={MapOptions} />
          </Form.Item>
          <Form.Item
            name="address_detail"
            label="详细地址"
            rules={[
              {
                required: true,
                message: '请输入详细地址!',
              },
              {
                max: '60',
                message: '详细不能超过60个字符',
              },
            ]}
          >
            <Input placeholder="详细地址" />
          </Form.Item>
          <Form.Item label="是否设置为默认" name="is_default">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      {!loading && (
        <div className={styles.container}>
          <div id="components-table-demo-basic">
            <Table
              columns={columns}
              dataSource={currentUser.user_address}
              footer={() => (
                <Button type="primary" block onClick={() => setVisible(true)}>
                  新增地址
                </Button>
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

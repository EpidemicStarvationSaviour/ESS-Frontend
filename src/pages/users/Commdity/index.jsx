import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Card,
  Col,
  Dropdown,
  Form,
  List,
  Menu,
  Row,
  Select,
  Tooltip,
  Button,
  message,
} from 'antd';
import numeral from 'numeral';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import { queryCommodityList, addCommodity } from './service';
import styles from './style.less';
import {
  ModalForm,
  ProForm,
  ProFormSelect,
  ProFormText,
  ProFormDigit,
} from '@ant-design/pro-components';

const { Option } = Select;

const formItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const CardInfo = ({ total, price }) => (
  <div className={styles.cardInfo}>
    <div>
      <p>商品总量</p>
      <p>{total}</p>
    </div>
    <div>
      <p>单价</p>
      <p>{price}</p>
    </div>
  </div>
);

export const Commdity = () => {
  const { data, loading, run } = useRequest((values) => {
    console.log('form data', values);
    return queryCommodityList({});
  });
  const list1 = data || [];
  const [type, setType] = useState([]);
  const commodities = list1
    ?.filter((r) => {
      if (!type || type.length === 0) {
        return true;
      }
      return type.indexOf(r.type_id) > -1;
    })
    .reduce((prev, curr) => prev.concat(curr.children), []);

  return (
    <div className={styles.filterCardList}>
      <Card
        bordered={false}
        extra={
          <ModalForm
            title="新建商品"
            trigger={
              <Button type="primary">
                <PlusOutlined />
                新建商品
              </Button>
            }
            autoFocusFirstInput
            modalProps={{
              onCancel: () => console.log('run'),
            }}
            onFinish={async (values) => {
              try {
                let res = await addCommodity(values);
                if (res.status === 'success') {
                  message.success('新建成功');
                  run();
                } else {
                  message.error('新建失败' + res.msg);
                }
              } catch (error) {
                message.error('新建失败');
              }
              run();
              return true;
            }}
          >
            <ProFormText
              width="md"
              name="name"
              label="商品名称"
              tooltip="请输入商品名称"
              placeholder="请输入名称"
            />

            <ProFormText
              width="md"
              name="avatar"
              label="请输入图片URL"
              placeholder="请输入图片URL"
            />
            <ProFormDigit width="md" label="单价" name="price" />
            <ProFormSelect
              request={async () =>
                list1.map((r) => {
                  return {
                    value: r.type_id,
                    label: r.type_name,
                  };
                })
              }
              width="xs"
              name="type_id"
              label="商品种类"
            />
          </ModalForm>
        }
      >
        <Form
          onValuesChange={(_, values) => {
            const { type } = values;
            setType(type);
          }}
        >
          <StandardFormRow
            title="所属类目"
            block
            style={{
              paddingBottom: 11,
            }}
          >
            <Form.Item name="type">
              <TagSelect expandable>
                {list1.map((r) => (
                  <TagSelect.Option key={r.type_id} value={r.type_id}>
                    {r.type_name}
                  </TagSelect.Option>
                ))}
              </TagSelect>
            </Form.Item>
          </StandardFormRow>
        </Form>
      </Card>
      <br />
      <List
        rowKey="id"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={commodities}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{
                paddingBottom: 20,
              }}
              actions={[
                <Tooltip key="delete" title="删除">
                  <DeleteOutlined />
                </Tooltip>,
              ]}
            >
              <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.name} />
              <div className={styles.cardItemContent}>
                <CardInfo total={item.total} price={item.price} />
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default Commdity;

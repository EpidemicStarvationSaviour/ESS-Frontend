import {
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Dropdown, Form, List, Menu, Row, Select, Tooltip } from 'antd';
import numeral from 'numeral';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import { queryList } from './service';
import styles from './style.less';
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
    return queryList({
      count: 8,
    });
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
      <Card bordered={false}>
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
        dataSource={list1}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{
                paddingBottom: 20,
              }}
              actions={[
                <Tooltip key="download" title="下载">
                  <DownloadOutlined />
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

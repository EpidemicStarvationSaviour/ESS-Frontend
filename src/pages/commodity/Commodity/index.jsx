import { EditOutlined } from '@ant-design/icons';
import {
  Avatar,
  Card,
  Form,
  List,
  Tooltip,
  message,
} from 'antd';
import React, { useState } from 'react';
import { useRequest } from 'umi';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import { queryCommodityList, myCommodityList, restockCommodity } from './service';
import styles from './style.less';
import {
  ModalForm,

  ProFormDigit,
} from '@ant-design/pro-components';


const CardInfo = ({ total, price }) => (
  <div className={styles.cardInfo}>
    <div>
      <p>商品库存</p>
      <p>{total}</p>
    </div>
    <div>
      <p>单价</p>
      <p>{price}</p>
    </div>
  </div>
);

export const Commodity = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [id, setId] = useState(0);
  const { data: data1, loading: loading1, run: run1 } = useRequest(queryCommodityList);
  const { data: data2, loading: loading2, run: run2 } = useRequest(myCommodityList);
  const list1 = data1 || [];
  const list2 = data2 || [];
  const [type, setType] = useState([]);
  const commodities1 = list1
    ?.filter((r) => {
      if (!type || type.length === 0) {
        return true;
      }
      return type.indexOf(r.type_id) > -1;
    })
    .reduce((prev, curr) => prev.concat(curr.children), []);
  const commodities2 = list2
    ?.filter((r) => {
      if (!type || type.length === 0) {
        return true;
      }
      return type.indexOf(r.type_id) > -1;
    })
    .reduce((prev, curr) => prev.concat(curr.children), []);
  const myItems =
    commodities2.reduce((total, item) => {
      total[item.id] = item.total;
      return total;
    }, {}) || {};
  const commodities = commodities1.map((item) => {
    if (item.id in myItems) {
      // item in my commodities
      item.total = myItems[item.id];
      return item;
    } else {
      // item not in my commodities
      let newItem = item;
      newItem.total = 0;
      return newItem;
    }
  });
  return (
    <div className={styles.filterCardList}>
      <ModalForm
        title="修改数量"
        visible={modalVisit}
        onVisibleChange={setModalVisit}
        autoFocusFirstInput
        modalProps={{
          onCancel: () => console.log('run'),
        }}
        onFinish={async (values) => {
          try {
            let v = {
              id: { id }.id,
              number: values.number,
            };
            let res = await restockCommodity(v);
            if (res.status === 'success') {
              message.success('修改成功');
            } else {
              message.error('修改失败' + res.msg);
            }
          } catch (error) {
            message.error('修改失败');
          }
          run1();
          run2();
          return true;
        }}
      >
        <ProFormDigit width="md" label="数量" name="number" />
      </ModalForm>
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
        loading={loading1 || loading2}
        dataSource={commodities}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              bodyStyle={{
                paddingBottom: 20,
              }}
              actions={[
                <Tooltip key="edit" title="修改">
                  <EditOutlined
                    onClick={() => {
                      setModalVisit(true);
                      setId(item.id);
                    }}
                  />
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
export default Commodity;

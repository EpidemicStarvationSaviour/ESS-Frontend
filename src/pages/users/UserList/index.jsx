import React, { useState } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Dropdown,
  Input,
  List,
  Menu,
  Modal,
  notification,
  Progress,
  Radio,
  Row,
  Tag,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest } from 'umi';
import moment from 'moment';
import OperationModal from './components/OperationModal';
import { Register, ListUser, DeleteUser, ChangeRole, QueryNum } from './service';
import styles from './style.less';
import { queryWorkinfo } from '@/pages/dashboard/workplace/service';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Search } = Input;

const Info = ({ title, value, bordered }) => (
  <div className={styles.headerInfo}>
    <span>{title}</span>
    <p>{value}</p>
    {bordered && <em />}
  </div>
);

const ListContent = ({ data: { user_role, user_phone } }) => (
  <div className={styles.listContent}>
    <div className={styles.listContentItem}>
      {user_role == 1 ? (
        <Tag color="blue">商家</Tag>
      ) : user_role == 2 ? (
        <Tag color="green">骑手</Tag>
      ) : user_role == 3 ? (
        <Tag color="blue">居民</Tag>
      ) : user_role == 4 ? (
        <Tag color="green">团长</Tag>
      ) : user_role == 5 ? (
        <Tag color="blue">管理员用户</Tag>
      ) : (
        <Tag color="green">未知</Tag>
      )}
    </div>
    <div className={styles.listContentItem}>
      <span>手机号</span>
      <p>{user_phone}</p>
    </div>
  </div>
);

export const UserList = () => {
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(undefined);
  const [type, setType] = useState(0);
  const {
    data: listData,
    run: refreshList,
    loading: listLoading,
    mutate,
  } = useRequest(() => {
    return ListUser({
      page_size: 9999,
      page_num: 1,
      type: type,
    });
  });

  const list = listData?.data || [];
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: 10,
    total: list.length,
  };

  const showEditModal = (item) => {
    setVisible(true);
    setCurrent(item);
  };

  const deleteItem = async (id) => {
    try {
      let msg = await DeleteUser({ user_id: id });
      if (msg.status == 'success') {
        notification.success({
          duration: 4,
          message: '删除成功',
          description: '删除成功',
        });
      } else {
        notification.error({
          duration: 4,
          message: '删除失败',
          description: '用户已经参与了项目，不可进行删除',
        });
      }
      await refreshList();
      await refreshNum();
    } catch (error) {
      notification.error({
        duration: 4,
        message: '删除失败',
        description: msg.msg,
      });
    }
  };

  const {
    data: currentNum,
    run: refreshNum,
    loading: loadingNum,
  } = useRequest(() => {
    return queryWorkinfo();
  });

  const extraContent = (
    <div className={styles.extraContent}>
      <RadioGroup
        defaultValue={0}
        onChange={(e) => {
          setType(e.target.value);
          refreshList();
        }}
      >
        <RadioButton value={0}>全部</RadioButton>
        <RadioButton value={1}>商家</RadioButton>
        <RadioButton value={2}>骑手</RadioButton>
        <RadioButton value={3}>居民</RadioButton>
        <RadioButton value={4}>团长</RadioButton>
      </RadioGroup>
      <Search className={styles.extraContentSearch} placeholder="请输入" onSearch={() => ({})} />
    </div>
  );

  return (
    <div>
      <PageContainer>
        <div className={styles.standardList}>
          {loadingNum ? null : (
            <Card bordered={false}>
              <Row>
                <Col sm={8} xs={24}>
                  <Info title="总用户" value={currentNum.total_users} bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="总拼团量" value={currentNum.total_groups} bordered />
                </Col>
                <Col sm={8} xs={24}>
                  <Info title="总商品种类" value={currentNum.total_commodities} />
                </Col>
              </Row>
            </Card>
          )}

          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={listLoading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a
                      key="edit"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteItem(item.user_id || -1);
                      }}
                    >
                      删除
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src="https://joeschmoe.io/api/v1/random"
                        shape="square"
                        size="large"
                      />
                    }
                    title={item.user_name}
                    description={'id:' + item.user_id}
                  />
                  <ListContent data={item} />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageContainer>
      <Button
        type="dashed"
        onClick={() => {
          setVisible(true);
        }}
        style={{
          width: '100%',
          marginBottom: 8,
        }}
      >
        <PlusOutlined />
        添加
      </Button>
    </div>
  );
};
export default UserList;

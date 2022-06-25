import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  List,
  Typography,
  Row,
  Col,
  message,
  Tag,
  Form,
  Image,
  InputNumber,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { useRequest, useAccess, history } from 'umi';
import { queryList, queryOwn, joinGroup } from './service';
import styles from './style.less';
const { Paragraph } = Typography;
import { ModalForm } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
const ListCardList = (props) => {
  const [editNeedVisible, setEditNeedVisible] = useState(false);
  const [group, setGroup] = useState({});
  const [formRef] = Form.useForm();
  const access = useAccess();
  const {
    data: listData,
    loading,
    run: runListData,
  } = useRequest(() => {
    return props.match.path != '/mygroup'
      ? queryOwn({
        type: 0,
        page_size: 10000,
        page_num: 1,
      })
      : queryList({
        page_size: 10000,
        page_num: 1,
      });
  });

  const ProjectType = (type) => {
    if (!type) {
      return <Tag color="red">未知类型</Tag>;
    }
    switch (type) {
      case 1:
        return <Tag color="green">已经创建</Tag>;
      case 2:
        return <Tag color="blue">正在规划配送方案</Tag>;
      case 3:
        return <Tag color="purple">正在配送</Tag>;
      case 4:
        return <Tag color="gold">已经完成</Tag>;
      default:
        return <Tag color="blue">未使用</Tag>;
    }
  };

  const list = listData?.data || [];
  const participateNum = listData?.count || 0;
  const Info = ({ title, value, bordered }) => (
    <div className={styles.headerInfo}>
      <span>{title}</span>
      <p>{value}</p>
      {bordered && <em />}
    </div>
  );
  const DetailNum = (
    <Card bordered={false}>
      <Row>
        <Col sm={8} xs={24}>
          <Info title="我参与的团购数" value={participateNum} bordered />
        </Col>
      </Row>
    </Card>
  );
  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        这里是您参与/管理的团，如果您的身份已经是团长，那么可以在该页面可以选择任务并查看详情；若您是买方，也可以在此处修改对商品的需求量。
      </p>
      {loading ? null : DetailNum}
    </div>
  );
  const extraContent = (
    <div className={styles.extraImg}>
      <img
        alt="这是一个标题"
        src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
      />
    </div>
  );
  const nullData = {};
  return (
    <PageContainer content={content} extraContent={extraContent}>
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 4,
            xxl: 4,
          }}
          dataSource={props.match.path != '/mygroup' ? [nullData, ...list] : [...list]}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <Button
                        danger={item.type === 1}
                        key="toDetail"
                        type="link"
                        onClick={(e) => {
                          history.push('/group/detail/' + item.id);
                        }}
                      >
                        查看详情
                      </Button>,
                      <Button
                        danger={item.type === 1}
                        key="changeNeed"
                        type="link"
                        onClick={(e) => {
                          setGroup(item);
                          setEditNeedVisible(true);
                        }}
                      >
                        修改需求
                      </Button>,
                      <Button
                        key="wait"
                        type="text"
                        onClick={(e) => {
                          message.info('团长电话: ' + item.creator_phone);
                        }}
                      >
                        联系团长
                      </Button>,
                    ].slice(
                      props.match.path != '/mygroup' ? 0 : 1,
                      props.match.path != '/mygroup' ? 2 : 3,
                    )}
                  >
                    <Card.Meta
                      avatar={
                        <img
                          alt=""
                          className={styles.cardAvatar}
                          src="https://i.loli.net/2021/10/27/kJWcOx3RA6GwFEV.jpg"
                        />
                      }
                      title={
                        <>
                          <a href={'/group/detail/' + item.id}>{item.name} </a>
                          {'   '}
                          {ProjectType(item.type)}
                        </>
                      }
                      description={
                        <>
                          <div className={styles.cardInfo}>
                            <div>
                              <p>团长</p>
                              <p>{item.creator_name}</p>
                            </div>
                            <div>
                              <p>我的金额</p>
                              <p>{item.total_my_price}</p>
                            </div>
                            <div>
                              <p>总金额</p>
                              <p>{item.total_price}</p>
                            </div>
                            <div>
                              <p>参与人数</p>
                              <p>{item.user_number}</p>
                            </div>
                          </div>
                          <Paragraph
                            className={styles.item}
                            ellipsis={{
                              rows: 3,
                            }}
                          >
                            {item.description}
                          </Paragraph>
                        </>
                      }
                    />
                  </Card>
                </List.Item>
              );
            }

            return (
              <List.Item>
                <Button
                  type="dashed"
                  className={styles.newButton}
                  onClick={(e) => {
                    if (access.canAgent) {
                      history.push(`/group/create`);
                      return;
                    }
                    message.error('对不起，您没有相应的权限');
                  }}
                >
                  <PlusOutlined /> 创建团购
                </Button>
              </List.Item>
            );
          }}
        />
        <ModalForm
          title="修改需求"
          visible={editNeedVisible}
          onVisibleChange={(visible) => {
            if (visible) {
              formRef.setFieldsValue({
                table: group.commodity_detail,
              });
            }
            setEditNeedVisible(visible);
          }}
          onFinish={async (values) => {
            console.info(values);
            var req = {
              id: group.id,
              data: values.table.map((e) => ({ commodity_id: e.id, number: e.number })),
            };
            try {
              await joinGroup(req);
              message.success('修改成功');
              runListData();
              setEditNeedVisible(false);
            } catch (error) {
              notification.error({
                duration: 4,
                message: '修改需求失败，请刷新重试',
                content: error.message,
              });
            }

            return true;
          }}
          form={formRef}
        >
          <EditableProTable
            rowKey="id"
            name="table"
            headerTitle="购物车"
            columns={[
              {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                readonly: true,
              },
              {
                title: '图片',
                dataIndex: 'avatar',
                key: 'avatar',
                readonly: true,
                renderFormItem: (text, row) => {
                  console.info(text, row);
                  return <Image src={text.entry.avatar} alt={text.entry.name} height={80} />;
                },
                render: (text, record, index) => <Image src={text} alt={record.name} height={80} />,
              },
              {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                readonly: true,
              },
              {
                title: '购入量',
                dataIndex: 'number',
                key: 'number',
                renderFormItem: (_, row) => <InputNumber defaultValue={row.number} />,
              },
              {
                title: '操作',
                valueType: 'option',
                width: 200,
                render: (text, record, _, action) => [
                  <a
                    key="editable"
                    onClick={() => {
                      action?.startEditable?.(record.id);
                    }}
                  >
                    编辑
                  </a>,
                ],
              },
            ]}
            recordCreatorProps={false}
            editable={{
              type: 'multiple',
              actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
            }}
          />
        </ModalForm>
      </div>
    </PageContainer>
  );
};

export default ListCardList;

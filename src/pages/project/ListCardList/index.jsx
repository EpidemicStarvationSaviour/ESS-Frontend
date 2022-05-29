import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, Row, Col, message, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useAccess, Access, history } from 'umi';
import { queryList, queryOwn } from './service';
import styles from './style.less';
const { Paragraph } = Typography;

const ListCardList = () => {
  const access = useAccess();
  // const { data: listData, loading } = useRequest(() => {
  //     return access.canAgent?
  //       queryOwn({
  //         pageSize: 10000,
  //         current: 0,
  //       }):
  //       queryList({
  //         pageSize: 10000,
  //         current: 0,
  //       })
  // })
  const { data: listData, loading } = {
      data:{
        count:10,
        data:[
            {
                id: 1, //团的id
                name: "32舍鸡蛋冲冲冲",//团的名字
                type: 1, //订单状态，看上面
                creator_id: 10,
                creator_name: "cxz",
                creator_phone: "13333333333",
                creator_address: {
                    id: 1, //address的id
                    lat: 123.213,
                    lng: 31.31,
                    province:"河南省",
                    city:"三门峡市",
                    area:"湖滨区",
                    detail:"六峰路绿江中央广场2号楼3单元109"
                },
                user_number: 10, //一共多少人参加
                total_price: 123.6, //总计多少钱
                total_my_price: 12, //我要付多少钱
                commodity_detail:[
                    {
                        type_id: 12,
                        id: 10,
                        name:"苹果",
                        avatar: "https://sdf.sdf",
                        price: 10, //单价
                        number: 12.5, //我买了多少斤
                        total_number: 125.5,// 整个团买了多少斤
                    },
                    {
                        type_id: 12,
                        id: 11,
                        name:"香蕉",
                        avatar: "https://sdf.sdf",
                        price: 11, //单价
                        number: 13.5, //我买了多少斤
                        total_number: 135.5,// 整个团买了多少斤
                    }
                ],
                description: "截止时间这周五老铁们，开冲", //额外描述，给成员看的
                remark:"放到门口就行，不用打电话", //给商家和骑手看的备注
            },
            {
                id: 2, //团的id
                name: "31舍啥都买啊冲冲冲",//团的名字
                type: 2, //订单状态，看上面
                creator_id: 12,
                creator_name: "ccc",
                creator_phone: "14444444444",
                creator_address: {
                    id: 1, //address的id
                    lat: 123.213,
                    lng: 31.31,
                    province:"河南省",
                    city:"三门峡市",
                    area:"湖滨区",
                    detail:"六峰路绿江中央广场2号楼3单元109"
                },
                user_number: 10, //一共多少人参加
                total_price: 123.6, //总计多少钱
                total_my_price: 12, //我要付多少钱
                commodity_detail:[
                    {
                        type_id: 12,
                        id: 10,
                        name:"苹果",
                        avatar: "https://sdf.sdf",
                        price: 10, //单价
                        number: 12.5, //我买了多少斤
                        total_number: 125.5,// 整个团买了多少斤
                    },
                    {
                        type_id: 12,
                        id: 11,
                        name:"香蕉",
                        avatar: "https://sdf.sdf",
                        price: 11, //单价
                        number: 13.5, //我买了多少斤
                        total_number: 135.5,// 整个团买了多少斤
                    }
                ],
                description: "截止时间这周五老铁们，开冲", //额外描述，给成员看的
                remark:"放到门口就行，不用打电话", //给商家和骑手看的备注            
            }
        ]
    },
    loading: false
  }
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
  const participateNum = listData?.count || 0;;
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
          dataSource={access.canAgent ? [nullData, ...list]:[...list]}
          renderItem={
            (item) => {
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
                            history.push('/project/detail/' + item.id);
                          }}
                        >
                          查看详情
                        </Button>,
                        <Button
                          danger={item.type === 1}
                          key="changeNeed"
                          type="link"
                          onClick={(e) => {
                            if (item.type === 1 && !access.canAgent) {
                              message.error('该项目暂未开放，请联系团长开放该项目');
                              return;
                            }
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
                      ].slice(access.canAgent ? 0 : 1, access.canAgent ? 2 : 3)}
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
                            <a href={'/project/detail/' + item.id}>{item.name} </a>
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
                        history.push(`/project/create`);
                        return;
                      }
                      message.error('对不起，您没有相应的权限');
                    }}
                  >
                    <PlusOutlined /> 创建团购
                  </Button>
                </List.Item>
              );
            }
          }
        />
      </div>
    </PageContainer>
  );
};

export default ListCardList;

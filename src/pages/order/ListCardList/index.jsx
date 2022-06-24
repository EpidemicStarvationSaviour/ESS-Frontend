import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, Row, Col, message, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useAccess, Access, history } from 'umi';
import { queryList } from './service';
import styles from './style.less';
const { Paragraph } = Typography;

const ListCardList = () => {
  const access = useAccess();
  const { data: listData, loading } = useRequest(() => {
    queryList({
      type: 0,
      page_size: 10000,
      page_num: 1,
    })
  })

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
          <Info title="我参与的订单数" value={participateNum} bordered />
        </Col>
      </Row>
    </Card>
  );
  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        这里是您的订单记录。
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
          dataSource={access.canAgent ? [nullData, ...list] : [...list]}
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
                          key="wait"
                          type="text"
                          onClick={(e) => {
                            message.info('骑手电话: ' + item.courier_phone);
                          }}
                        >
                          联系骑手
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
                                <p>骑手</p>
                                <p>{item.courier_name}</p>
                              </div>
                              <div>
                                <p>到达时间</p>
                                <p>{item.arrive_time}</p>
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

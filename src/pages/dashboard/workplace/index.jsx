import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import { Radar } from '@ant-design/charts';
import { Link, useRequest, useModel } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import { queryGroup, queryActivities, fakeChartData, queryWorkinfo } from './service';
const links = [
  //TODO FIXME!!
  {
    title: '创建tag',
    href: '/tag/tag-list',
  },
  {
    title: '上传图片',
    href: '/upload/image',
  },
];

const PageHeaderContent = ({ currentUser }) => {
  const loading = currentUser && Object.keys(currentUser).length;

  if (!loading) {
    return (
      <Skeleton
        avatar
        paragraph={{
          rows: 1,
        }}
        active
      />
    );
  }

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar
          size="large"
          src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          早安，
          {currentUser.user_name}
          ，祝你满绩每一天！
        </div>
        <div>
          {currentUser.user_phone} |{'id:' + currentUser.user_id}
        </div>
      </div>
    </div>
  );
};

const ExtraContent = (props) => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="用户总数" value={props.total_users || 0} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="开团数量" value={props.total_groups || 0} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="上架种类" value={props.total_commodities || 0} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="完成订单" value={props.finished_groups || 0} />
    </div>
  </div>
);
//给用户的render
const renderGroupList1 = (item) => (
  <Card.Grid className={styles.projectGrid} key={item.id}>
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
    >
      <Card.Meta
        title={
          <div className={styles.cardTitle}>
            <Avatar
              size="small"
              src={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
            />
            <Link to={'/project/detail/' + item.id}>{item.name}</Link>
          </div>
        }
        description={item.description}
      />
      <div className={styles.projectItemContent}>
        <Link to={'/project/detail/' + item.id}>{'参团人数' + item.user_number}</Link>
        {item.createdTime && (
          <span className={styles.datetime} title={item.createdTime}>
            {moment(item.created_time).fromNow()}
          </span>
        )}
      </div>
    </Card>
  </Card.Grid>
);

//给商家的render
const renderGroupList2 = (item) => (
  <Card.Grid className={styles.projectGrid} key={item.id}>
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
    >
      <Card.Meta
        title={
          <div className={styles.cardTitle}>
            <Avatar
              size="small"
              src={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
            />
            <Link to={'/project/list/'}>{item.name}</Link>
          </div>
        }
        description={item.remark}
      />
      <div className={styles.projectItemContent}>
        <Link to={'/project/list/'}>{'收益总数' + item.total_price}</Link>
        {<span className={styles.datetime}>{'商品种类:' + item.commodity_detail.length}</span>}
      </div>
    </Card>
  </Card.Grid>
);

//给骑手的render
const renderGroupList3 = (item) => (
  <Card.Grid className={styles.projectGrid} key={item.id}>
    <Card
      bodyStyle={{
        padding: 0,
      }}
      bordered={false}
    >
      <Card.Meta
        title={
          <div className={styles.cardTitle}>
            <Avatar
              size="small"
              src={'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'}
            />
            <Link to={'/project/list/'}>{item.name}</Link>
          </div>
        }
        description={item.remark + ' ' + item.creator_address.detail}
      />
      <div className={styles.projectItemContent}>
        <Link to={'/project/list/'}>{'收益总数' + item.reward}</Link>
      </div>
    </Card>
  </Card.Grid>
);

const Workplace = () => {
  const {
    initialState: { currentUser: currentUser },
    loading,
    refresh,
    setInitialState,
  } = useModel('@@initialState');

  const { loading: groupLoading, data: groupList = {} } = useRequest(() =>
    queryGroup({
      type: 1,
      page_num: 1,
      page_size: 10,
    }),
  );
  const { loading: workinfoLoading, data: workinfoData } = useRequest(queryWorkinfo);

  const { loading: activitiesLoading, data: activities = [] } = queryActivities();

  const data = fakeChartData();
  const renderActivities = (item) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }

      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar} />}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  return (
    <>
      {loading || groupLoading || workinfoLoading ? null : (
        <PageContainer
          content={<PageHeaderContent currentUser={currentUser} />}
          extraContent={<ExtraContent data={workinfoData} />}
        >
          <Row gutter={24}>
            <Col xl={16} lg={24} md={24} sm={24} xs={24}>
              <Card
                className={styles.projectList}
                style={{
                  marginBottom: 24,
                }}
                title="进行中的团购"
                bordered={false}
                //TODO FIXME!
                extra={<Link to="/project/list">全部项目</Link>}
                loading={groupLoading}
                bodyStyle={{
                  padding: 0,
                }}
              >
                {groupList.data.map((item) => {
                  switch (currentUser.user_role) {
                    case 1:
                      return renderGroupList2(item);
                    case 2:
                      return renderGroupList3(item);
                    default:
                      return renderGroupList1(item);
                  }
                })}
              </Card>
              <Card
                bodyStyle={{
                  padding: 0,
                }}
                bordered={false}
                className={styles.activeCard}
                title="动态"
                loading={activitiesLoading}
              >
                <List
                  loading={activitiesLoading}
                  renderItem={(item) => renderActivities(item)}
                  dataSource={activities}
                  className={styles.activitiesList}
                  size="large"
                />
              </Card>
            </Col>
            <Col xl={8} lg={24} md={24} sm={24} xs={24}>
              <Card
                style={{
                  marginBottom: 24,
                }}
                title="快速开始 / 便捷导航"
                bordered={false}
                bodyStyle={{
                  padding: 0,
                }}
              >
                <EditableLinkGroup links={links} />
              </Card>
              <Card
                style={{
                  marginBottom: 24,
                }}
                bordered={false}
                title="工作指数（静态数据）"
                loading={data?.radarData?.length === 0}
              >
                <div className={styles.chart}>
                  <Radar
                    height={343}
                    data={data?.radarData || []}
                    angleField="label"
                    seriesField="name"
                    radiusField="value"
                    area={{
                      visible: false,
                    }}
                    point={{
                      visible: true,
                    }}
                    legend={{
                      position: 'bottom-center',
                    }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </PageContainer>
      )}
    </>
  );
};

export default Workplace;

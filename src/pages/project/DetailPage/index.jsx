import {
  DingdingOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  Button,
  Card,
  Statistic,
  Descriptions,
  Divider,
  Dropdown,
  Menu,
  Steps,
  Modal,
  Select,
  message,
  notification,
} from 'antd';
import { GridContent, PageContainer, RouteContext } from '@ant-design/pro-layout';
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useAccess, history } from 'umi';
import {
  EditDetail,
  DeleteProject,
} from './service';
import moment from 'moment';
import styles from './style.less';
const { Step } = Steps;
const ProjectStatus = {
  1: '已经创建',
  2: '正在规划配送方案',
  3: '正在配送',
  4: '已经完成',
};
const ButtonGroup = Button.Group;
const mobileMenu = (dispatch) => (
  <Menu
    onClick={(item) => {
      console.log(item);
      dispatch(parseInt(item.key));
    }}
  >
    <Menu.Item key="1">
      <SyncOutlined spin />
      刷新
    </Menu.Item>
    <Menu.Item key="2">修改</Menu.Item>
    <Menu.Item key="3">变更</Menu.Item>
    <Menu.Item key="4">删除</Menu.Item>
  </Menu>
);
const action = (dispatch) => (
  <RouteContext.Consumer>
    {({ isMobile }) => {
      if (isMobile) {
        return (
          <Dropdown.Button
            type="primary"
            icon={<DownOutlined />}
            overlay={mobileMenu(dispatch)}
            placement="bottomRight"
          >
            选择操作
          </Dropdown.Button>
        );
      }

      return (
        <Fragment>
          <ButtonGroup>
            <Button
              icon={<SyncOutlined spin />}
              onClick={(e) => {
                dispatch(1);
              }}
            >
              刷新
            </Button>
            <Button
              onClick={(e) => {
                dispatch(2);
              }}
            >
              修改信息
            </Button>
            <Button
              onClick={(e) => {
                dispatch(3);
              }}
            >
              改变状态
            </Button>
            <Button 
              onClick={(e) => {
                dispatch(4);
              }}
            >
              删除
            </Button>
          </ButtonGroup>
        </Fragment>
      );
    }}
  </RouteContext.Consumer>
);

const extra = (project) => (
  <div className={styles.moreInfo}>
    <Statistic title="状态" value={ProjectStatus[project?.type]} />
  </div>
);

const description = (project) => (
  <RouteContext.Consumer>
    {({ isMobile }) => (
      <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 2}>
        <Descriptions.Item label="团体ID">{project?.id}</Descriptions.Item>
        <Descriptions.Item label="创建人">{project?.creator_name}</Descriptions.Item>
        <Descriptions.Item label="地址">
          {[project?.creator_address?.province, project?.creator_address?.city, 
          project?.creator_address?.area, project?.creator_address?.detail].join(" ")}
        </Descriptions.Item>
        <Descriptions.Item label="团体简介">{project?.description}</Descriptions.Item>
        <Descriptions.Item label="订单备注">{project?.remark}</Descriptions.Item>
        <Descriptions.Item label="参与者数">{project?.user_number}</Descriptions.Item>
        <Descriptions.Item label="商品种数">{project?.commodity_detail.length}</Descriptions.Item>
        <Descriptions.Item label="骑手姓名">{project?.rider_name}</Descriptions.Item>
        <Descriptions.Item label="骑手手机号">{project?.rider_phone}</Descriptions.Item>
        <Descriptions.Item label="骑手位置">
          {'纬度: ' + (project?.rider_pos?.lat||0) + ' 经度: '+ (project?.rider_pos?.lng||0)}
        </Descriptions.Item>
        <Descriptions.Item label="骑手位置上次更新于">
          {moment(project?.rider_pos?.update_time).format('llll')}
        </Descriptions.Item>
        <Descriptions.Item label="骑手预计送达时间">{project?.rider_pos?.eta||0} 分钟</Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {moment(project?.created_time).format('llll')}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {moment(project?.updated_time).format('llll')}
        </Descriptions.Item>
      </Descriptions>
    )}
  </RouteContext.Consumer>
);

const desc1 = (project) => (
  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
    <Fragment>
      {project?.creator_name}
      <DingdingOutlined
        style={{
          marginLeft: 8,
        }}
      />
    </Fragment>
    <div>{moment(project?.createdTime).format('ll')}</div>
  </div>
);

const desc2 = (project) => (
  <div className={styles.stepDescription}>
    <Fragment>
      {project?.creator_name}
      <DingdingOutlined
        style={{
          color: '#00A0E9',
          marginLeft: 8,
        }}
      />
    </Fragment>
  </div>
);

const DetailPage = (props) => {
  const [tabStatus, seTabStatus] = useState({
    tabActiveKey: 'detail',
  });
  const [projectStatus, changeProjectStatus] = useState(1);
  const [changeStatusVisible, setChangeStatusVisible] = useState(false);
  const access = useAccess();
  // const {
  //   data: currentProject,
  //   run: runProject,
  //   loading: loadingProject,
  // } = useRequest(
  //   () => {
  //     return QueryProject(props.match.params.id);
  //   },
  //   {
  //     onSuccess: (data, parma) => {
  //       if (!data) {
  //         message.error({
  //           duration: 4,
  //           content: '获取团体详情失败，请稍后重试',
  //         });
  //         return;
  //       }
  //       //注意修改当前的status状态
  //       changeProjectStatus(data.type);
  //     },
  //     onError: (error, parma) => {
  //       message.error({
  //         duration: 4,
  //         content: '获取团体详情失败，请稍后重试',
  //       });
  //     },
  //   },
  // );
  const {currentProject, runProject, loadingProject} = {
    currentProject: {
      id: 1,
      name: "32舍鸡蛋冲冲冲",//团的名字
      type: 1, //订单状态，看上面
      creator_id: 10,
      creator_name: "cxz",
      creator_phone: "13333333333",
      user_number: 10, //一共多少人参加
      total_price: 123.6, //总计多少钱
      description: "截止时间这周五老铁们，开冲", //额外描述，给成员看的
      remark:"放到门口就行，不用打电话", //给商家和骑手看的备注
      creator_address: {
          id: 1, //address的id
          lat: 123.213,
          lng: 31.31,
          province:"河南省",
          city:"三门峡市",
          area:"湖滨区",
          detail:"六峰路绿江中央广场2号楼3单元109"
      },
      commodity_detail:[
          {
              type_id: 12,
              id: 10,
              name:"苹果",
              avatar: "https://sdf.sdf",
              price: 10, //单价
              total_number: 125.5,// 整个团买了多少斤
              users: [ //每个人买了多少斤
                  {
                      user_id: 1,
                      user_name: "cxz666",
                      user_phone: "13333333333",
                      number: 10, //这个逼买了多少斤
                  },
                  {
                      user_id: 2,
                      user_name: "cxz6666",
                      user_phone: "13333333334",
                      number: 12, //这个逼买了多少斤 
                  },
  //如果一个逼没买这个玩意/这个商品他买了0，那就不在这里显示
              ]
          },
          {
              type_id: 12,
              id: 11,
              name:"香蕉",
              avatar: "https://sdf.sdf",
              price: 11, //单价
              number: 13.5, //我买了多少斤
              total_number: 135.5,// 整个团买了多少斤
              users: [ //每个人买了多少斤
                  {
                      user_id: 1,
                      user_name: "cxz666",
                      user_phone: "13333333333",
                      number: 10, //这个逼买了多少斤
                  },
                  {
                      user_id: 2,
                      user_name: "cxz6666",
                      user_phone: "13333333334",
                      number: 12, //这个逼买了多少斤 
                  },
              ]
          }
      ],
      created_time: 0,
      updated_time: 0,
      rider_phone: "13333333333", //骑手手机号，如果还没分配就是空
      rider_name: "dzp", // 同上
      rider_pos: { //如果还没分配骑手就是空
          lat: 123.123,
          lng: 31.123,
          update_time: 0,
          eta: 12.5, //预计送到小区的到达时间，单位为分钟
    }
  },
  runProject: () => {},
  loadingProject: false,
  }

  const dispatch = (type) => {
    switch (type) {
      case 1:
        message.info('刷新ing');
        runProject();
        break;
      case 2:
        if (!access.canAgent) {
          message.error('您没有相应的权限');
          return;
        }
        setChangeStatusVisible(true);
        break;
      case 3:
        if (!access.canAgent) {
          message.error('您没有相应的权限');
          return;
        }
        setChangeStatusVisible(true);
        break;
      case 4:
        if (!access.canAgent) {
          message.error('您没有相应的权限');
          return;
        }
        //delete this project
        confirmDelete();
        break;

    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '您确认要删除该任务吗，该操作不可逆',
      okText: '确认',
      cancelText: '取消',
      onOk: async (e) => {
        try {
          let res = await DeleteProject(props.match.params.id);
          console.log(res);

          if (res.status != 'success') {
            notification.error({
              duration: 4,
              message: '删除失败',
              description: '任务删除失败，请查看控制台获取报错信息',
            });
          } else {
            notification.success({
              duration: 4,
              message: '删除成功',
            });
            history.push(`/project/list`);
            return;
          }
        } catch (error) {
          notification.error({
            duration: 4,
            message: '删除失败',
            description: error.message,
          });
        }
      },
    });
  };

  const onTabChange = (tabActiveKey) => {
    seTabStatus({ ...tabStatus, tabActiveKey });
  };

  const onCsModalOk = async () => {
    if (loadingProject || !currentProject) {
      message.error({
        duration: 4,
        content: '团体内容获取失败，请刷新重试',
      });
      return;
    }
    if (currentProject.type == projectStatus) {
      message.warn({
        duration: 4,
        content: '目前状态已经最新，无需更改',
      });
      return;
    }
    try {
      let res = await EditDetail(currentProject.id, { type: projectStatus });
      if (res.status == 'success') {
        notification.success({
          duration: 4,
          message: '修改成功',
          content: '修改成功',
        });
      } else {
        notification.error({
          duration: 4,
          message: '团体内容获取失败，请刷新重试',
          content: '',
        });
      }
      setChangeStatusVisible(false);
      runProject();
    } catch (error) {
      notification.error({
        duration: 4,
        message: '团体内容获取失败，请刷新重试',
        content: error.message,
      });
    }
  };

  const onCsModalCancel = () => {
    setChangeStatusVisible(false);
  };

  const detail = (
    <div className={styles.main}>
      <GridContent>
        <Card
          title="流程进度"
          style={{
            marginBottom: 24,
          }}
        >
          <RouteContext.Consumer>
            {({ isMobile }) => (
              <Steps
                direction={isMobile ? 'vertical' : 'horizontal'}
                current={(currentProject?.type - 1) | 0}
              >
                <Step title="已经创建" description={desc1(currentProject)} />
                <Step title="正在规划配送方案" description={desc2(currentProject)} />
                <Step title="正在配送" />
                <Step title="已经完成" />
              </Steps>
            )}
          </RouteContext.Consumer>
        </Card>
        <Card
          title="参与者信息"
          style={{
            marginBottom: 24,
          }}
          bordered={false}
        >
          <Descriptions
            style={{
              marginBottom: 24,
            }}
          >
            <Descriptions.Item label="商品种类总数">
              {currentProject?.commodity_detail.length}
            </Descriptions.Item>
          </Descriptions>
          <Card type="inner" title="协作者完成情况">
            {currentProject?.workers ? (
              <>
                {currentProject.workers.map((r) => {
                  return (
                    <>
                      <Descriptions
                        style={{
                          marginBottom: 16,
                        }}
                        title={r.UserName}
                      >
                        <Descriptions.Item label="ID">{r.UserId}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{r.UserEmail}</Descriptions.Item>
                        <Descriptions.Item label="手机号">{r.UserPhone}</Descriptions.Item>
                        <Descriptions.Item label="提交标记数量">
                          {currentProject.annotations.reduce(
                            (a, v) => (v.workerId === r.UserId ? a + 1 : a),
                            0,
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider
                        style={{
                          margin: '16px 0',
                        }}
                      />
                    </>
                  );
                })}
              </>
            ) : null}
          </Card>
        </Card>
      </GridContent>
    </div>
  );

  const content = {
    detail: detail,
  };

  return (
    <>
      {loadingProject ? null : (
        <PageContainer
          title={'团体名称：' + currentProject?.name}
          extra={action(dispatch)}
          className={styles.pageHeader}
          content={description(currentProject)}
          extraContent={extra(currentProject)}
          tabActiveKey={tabStatus.tabActiveKey}
          onTabChange={onTabChange}
          tabList={[
            {
              key: 'detail',
              tab: '详情',
            },
            {
              key: 'commodity',
              tab: '商品管理',
            },
            {
              key: 'purchaser',
              tab: '成员管理',
            },
          ]}
        >
          {content[tabStatus.tabActiveKey]}
        </PageContainer>
      )}

      {!loadingProject && changeStatusVisible && (
        <Modal
          title="改变状态"
          visible={changeStatusVisible}
          onOk={onCsModalOk}
          onCancel={onCsModalCancel}
        >
          <Select
            value={projectStatus}
            onChange={(e) => changeProjectStatus(e)}
            style={{ width: 150 }}
          >
            <Select.Option value={1}>已经创建</Select.Option>
            <Select.Option value={2}>正在规划配送方案</Select.Option>
            <Select.Option value={3}>正在配送</Select.Option>
            <Select.Option value={4}>已经完成</Select.Option>
          </Select>
        </Modal>
      )}
    </>
  );
};

export default DetailPage;

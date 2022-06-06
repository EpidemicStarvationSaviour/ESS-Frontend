import {
  DingdingOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  PlusCircleTwoTone,
  MinusCircleTwoTone,
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import {
  Image,
  Table,
  Form,
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
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import { useRequest, useAccess, history } from 'umi';
import {
  EditDetail,
  DeleteProject,
  queryProject,
  queryCurrent,
  GetCommodityList
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
  const [groupNumbers, setGroupNumbers] = useState( 
    [{
      key: 1,
      id: 1,
      name: "cxz666",
      phone: "13333333333",
    },
    {
      key: 2,
      id: 2,
      name: "cxz6666",
      phone: "13333333334",
    }]
  );
  const [changeStatusVisible, setChangeStatusVisible] = useState(false);
  const [editDetailVisible, setEditDetailVisible] = useState(false);
  const access = useAccess();
  const [editDetailForm] = Form.useForm();

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
  )
  // const {
  //   data: currentProject,
  //   run: runProject,
  //   loading: loadingProject,
  // } = useRequest(
  //   () => {
  //     return queryProject(props.match.params.id);
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
  //       if (data.code === 0) {
  //         var numbers = new Set()
  //         data.commodity_detail.forEach(e => {
  //           e.users.forEach(u => {
  //             numbers.add({
  //               key: u.user_id,
  //               id: u.user_id,
  //               name: u.user_name,
  //               phone: u.user_phone
  //             })
  //           })
  //         })
  //         setGroupNumbers(Array.from(numbers))
  //         changeProjectStatus(data.type);
  //       }
  //     },
  //     onError: (error, parma) => {
  //       message.error({
  //         duration: 4,
  //         content: '获取团体详情失败，请稍后重试',
  //       });
  //     },
  //   },
  // );
  // const { data : addressList} = useRequest(
  //       () => {
  //         return queryCurrent().user_address;
  //       },
  //       {onSuccess: (data, parma) => {
  //         if (!data) {
  //           message.error({
  //             duration: 4,
  //             content: '获取个人信息失败，请稍后重试',
  //           });
  //           return;
  //         }
  //       },
  //       onError: (error, parma) => {
  //         message.error({
  //           duration: 4,
  //           content: '获取个人信息失败，请稍后重试',
  //         });
  //       },
  //     },
  //   )
  // }
  // const { data : commodity_list} = useRequest(
  //     () => {
  //       return GetCommodityList()
  //     },
  //     {onSuccess: (data, parma) => {
  //       if (!data) {
  //         message.error({
  //           duration: 4,
  //           content: '获取商品种类失败，请稍后重试',
  //         });
  //         return;
  //       }
  //     },
  //     onError: (error, parma) => {
  //       message.error({
  //         duration: 4,
  //         content: '获取商品种类失败，请稍后重试',
  //       });
  //     },
  //   },
  // )
  const commodity_list = [
    //返回的是表示第一大类的数组
    {
        type_id:1,
        type_name:"水果",
        type_number: 10, //该大类下有10种商品
        type_avatar: "https://a.b.c", //大类的图片
        children:[
            {
            id: 1, //这是db的id
            name: "苹果",
            avatar:"https://a.b.c",//图片url
            total: 2000, //数量为斤，是所有商店 全部加起来 整个地区一共有这么多
            price: 10.1, //单价
            },
            {
             id: 2,
             name: "香蕉",
             avatar:"https://a.b.c",//图片url
             total: 150, 
             price: 10.1, //单价        
            }
        ]
    },
    {
        type_id:2,
        type_name:"海鲜",
        type_number: 10, //该大类下有10种商品
        type_avatar: "https://a.b.c", //大类的图片    
        children:[
            {
            id: 10, //这是db的id
            avatar:"https://a.b.c",//图片url
            name: "澳洲龙虾",
            total: 2000, //数量为斤，是所有商店 全部加起来 整个地区一共有这么多
            price: 10.1, //单价
            },
            {
             id: 20,
             name: "美国鱿鱼",
             avatar:"https://a.b.c",//图片url
             total: 1000, 
             price: 10.1, //单价
            }
        ]
    }
  ]

  const {addressList} = {
    addressList:[
      {
          id: 1, //address id
          lat: 123.111,
          lng: 39.123,
          province:"河南省",
          city:"三门峡市",
          area:"湖滨区",
          detail:"六峰路绿江中央广场2号楼3单元109",
          is_default: true,
      },
      {
          id: 2, //address id
          lat: 123.111,
          lng: 39.123,
          province:"河南省",
          city:"三门峡市",
          area:"湖滨区",
          detail:"六峰路绿江中央广场2号楼3单元109",
          is_default: false,
      }
     ]
  }

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
              id: 1,
              name:"苹果",
              avatar: "https://imgservice.suning.cn/uimg1/b2c/image/YKuZCrn257W0MBexrPNgKg.png_800w_800h_4e",
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
              id: 2,
              name:"香蕉",
              avatar: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.pddpic.com%2Fmms-material-img%2F2020-06-08%2F29e482ca-6796-450c-b422-13cd9a6f4fd1.jpeg&refer=http%3A%2F%2Fimg.pddpic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1656593460&t=c3599c4788adf587e6687b1b1783c99e",
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
                      number: 22, //这个逼买了多少斤 
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
  runProject: ()=>{},
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
        setEditDetailVisible(true);
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
          message: '团体信息修改失败，请刷新重试',
          content: '',
        });
      }
      setChangeStatusVisible(false);
      runProject();
    } catch (error) {
      notification.error({
        duration: 4,
        message: '团体信息修改失败，请刷新重试',
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
          title="订单信息"
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
          <Card type="inner" title="商品详情">
            {currentProject?.commodity_detail ? (
              <>
                {currentProject.commodity_detail.map((r) => {
                  return (
                    <div key={r.id}>
                      <Descriptions
                        style={{
                          marginBottom: 16,
                        }}
                        title={r.name}
                        column={{ xs: 1, sm: 2, md: 5}}
                      >
                        <Descriptions.Item>
                          <Image src={r.avatar} height={80} alt={r.name}/>  
                        </Descriptions.Item>
                        <Descriptions.Item label="单价">{r.price}</Descriptions.Item>
                        <Descriptions.Item label="总量">{r.total_number}</Descriptions.Item>
                        <Descriptions.Item label="购买人数">{r.users.length}</Descriptions.Item>
                        <Descriptions.Item>
                          <Button type="link" onClick={
                            ()=>{
                              Modal.info({
                                title:"购买人列表",
                                content: <Table 
                                  columns={[
                                    {    
                                      title: '姓名',
                                      dataIndex: 'user_name',
                                      key: 'name',
                                    },{
                                        title: '电话',
                                        dataIndex: 'user_phone',
                                        key: 'phone',
                                    },{
                                      title: '数量',
                                      dataIndex: 'number',
                                      key: 'number',
                                    }]} 
                                    pagination={false}
                                    size={"small"}
                                    bordered={true}
                                    dataSource={r.users} />
                              })
                            }
                          }>
                            查看明细
                          </Button>
                        </Descriptions.Item>
                      </Descriptions>
                      <Divider
                        style={{
                          margin: '16px 0',
                        }}
                      />
                    </div>
                  );
                })}
              </>
            ) : null}
          </Card>
        </Card>
      </GridContent>
    </div>
  );

  const commodity = (
    <div className={styles.main}>
      <GridContent>
        <Card
          title="商品种类"
          style={{
            marginBottom: 24,
          }}
          bordered={false}
        >
        <Table
          columns={
            [{
              title: '种类',
              dataIndex: 'type_name',
              key: 'type_name'
            },
            {
              title: '图片',
              dataIndex: 'type_avatar',
              key: 'type_avatar'
            }]
          }
          dataSource={
            commodity_list.map(
              (e)=>{
                return {
                  key: e.type_id,
                  type_name: e.type_name,
                  type_avatar: <Image src={e.type_avatar} height={80} alt={e.type_name}/>,
                  subcommodity: e.children
                }
              }
            )
          }
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender: (record) => (
                <Table columns={           
                  [{
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name'
                    
                  },
                  {
                    title: '图片',
                    dataIndex: 'avatar',
                    key: 'avatar',
                    render: (text, record, index) => (
                      <Image src={text} alt={record.name} height={80}/>
                    )
                  },
                  {
                    title: '单价',
                    dataIndex: 'price',
                    key: 'price'
                  },
                  {
                    title: '库存',
                    dataIndex: 'total',
                    key: 'total'
                  },
                  {
                    title: '操作',
                    key: 'operation',
                    render: (text, record, index)=>(
                      currentProject.commodity_detail.find(({id})=>(id==record.id)) ?  
                        <Button danger size="large" shape="circle" icon={<MinusOutlined/>}></Button>:
                        <Button type="primary" size="large" shape="circle" icon={<PlusOutlined/>}></Button>
                    )
                  },
                ]} 
                dataSource={record.subcommodity.map((e)=>(e.key=e.id, e))} 
                pagination={false} 
                /> 
            )
          }}
        >
        </Table>
        </Card>
      </GridContent>
    </div>
  )

  const purchaser =(
    <div className={styles.main}>
      <GridContent>
        <Card
          title="成员详情"
          style={{
            marginBottom: 24,
          }}
          bordered={false}
        >
        <Table
          columns={
              [{
                title: 'ID',
                dataIndex: 'id',
                key: 'id'
              },
              {
                title: '用户名',
                dataIndex: 'name',
                key: 'name'
              },
              {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone'
              },
              {
                title: '操作',
                key: 'operation',
                render: (text, record, index)=>(
                    <Button danger size="large">移除</Button>
                )
              }
              ]
            }
            dataSource = {
              groupNumbers
            }
        >
        </Table>
      </Card>
      </GridContent>
    </div>
  )

  const content = {
    detail: detail,
    commodity: !loadingProject && currentProject.type === 1 ? commodity: undefined,
    purchaser: !loadingProject && currentProject.type === 1 ? purchaser: undefined,
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
      <ModalForm
        title="修改信息"
        onFinish={
          async (values) => {
            try {
              let res = await EditDetail(currentProject.id, values);
              if (res.status == 'success') {
                notification.success({
                  duration: 4,
                  message: '修改成功',
                  content: '修改成功',
                });
              } else {
                notification.error({
                  duration: 4,
                  message: '团体信息修改失败，请刷新重试',
                  content: '',
                });
              }
              setEditDetailVisible(false);
              runProject();
            } catch (error) {
              notification.error({
                duration: 4,
                message: '团体信息修改失败，请刷新重试',
                content: error.message,
              })
            }
            return true
          }
        }
        visible={editDetailVisible}
        onVisibleChange={(visible)=>{
          if(visible){
            var {...group} = currentProject
            group.address_id = group.creator_address.id;
            editDetailForm.setFieldsValue(group)
          }
          setEditDetailVisible(visible)
        }}
        form={editDetailForm}
      >
        <ProFormText
          label="团体名称"
          name="name"
          rules={[
            {
              required: true,
              max: 20,
              message: '请输入',
            },
          ]}
        />
        <ProFormText
          label="团体描述"
          name="description"
          rules={[
            {
              required: true,
              max: 50,
              message: '请输入',
            },
          ]}
        />
        <ProFormText
          label="订单备注"
          name="remark"
          rules={[
            {
              required: true,
              max: 50,
              message: '请输入',
            },
          ]}
        />
        <ProFormSelect
          label="派送地址"
          name="address_id"
          options={addressList.map(
            (e) => {return {
              label:[e.province, e.city, e.area, e.detail].join(" "), 
              value: e.id
            }}
          )}
        >
        </ ProFormSelect>
      </ ModalForm>
    </>
  );
};

export default DetailPage;

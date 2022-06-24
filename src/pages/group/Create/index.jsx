import { CloseCircleOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Card, Col, Popover, Row, message, Table, notification, Image, Button } from 'antd';
import { useState, useRef, useEffect } from 'react';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { GridContent, PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { submitForm, queryOwn, queryCurrent, queryCommodityList } from './service';
import { useRequest, history } from 'umi';

import styles from './style.less';
const fieldLabels = {
  name: '团体名称',
  description: '详细描述',
  remark: '备注',
  address_id: '派送地址',
  id: '一键导入过往团的成员',
};

const Create = () => {
  const [error, setError] = useState([]);
  const [userData, setUserData] = useState([]);
  const [commidityData, setCommidityData] = useState([]);

  const { data: commodityList, loading: loadingCommodityList } = useRequest(
    () => {
      return queryCommodityList();
    },
    {
      onSuccess: (data, parma) => {
        if (!data) {
          message.error({
            duration: 4,
            content: '获取商品种类失败，请稍后重试',
          });
          return;
        }
      },
      onError: (error, parma) => {
        message.error({
          duration: 4,
          content: '获取商品种类失败，请稍后重试',
        });
      },
    },
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
            columns={[
              {
                title: '种类',
                dataIndex: 'type_name',
                key: 'type_name',
              },
              {
                title: '图片',
                dataIndex: 'type_avatar',
                key: 'type_avatar',
              },
            ]}
            dataSource={
              loadingCommodityList
                ? []
                : commodityList.map((e) => {
                    return {
                      key: e.type_id,
                      type_name: e.type_name,
                      type_avatar: <Image src={e.type_avatar} height={80} alt={e.type_name} />,
                      subcommodity: e.children,
                    };
                  })
            }
            expandable={{
              defaultExpandAllRows: true,
              expandedRowRender: (record) => (
                <Table
                  columns={[
                    {
                      title: '名称',
                      dataIndex: 'name',
                      key: 'name',
                    },
                    {
                      title: '图片',
                      dataIndex: 'avatar',
                      key: 'avatar',
                      render: (text, record, index) => (
                        <Image src={text} alt={record.name} height={80} />
                      ),
                    },
                    {
                      title: '单价',
                      dataIndex: 'price',
                      key: 'price',
                    },
                    {
                      title: '库存',
                      dataIndex: 'total',
                      key: 'total',
                    },
                    {
                      title: '操作',
                      key: 'operation',
                      render: (text, record, index) =>
                        commidityData.includes(record.id) ? (
                          <Button
                            danger
                            size="large"
                            shape="circle"
                            icon={<MinusOutlined />}
                            onClick={() => {
                              var copy = [...commidityData];
                              copy.splice(commidityData.indexOf(record.id), 1);
                              setCommidityData(copy);
                            }}
                          ></Button>
                        ) : (
                          <Button
                            type="primary"
                            size="large"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={() => {
                              setCommidityData([...commidityData, record.id]);
                            }}
                          ></Button>
                        ),
                    },
                  ]}
                  dataSource={record.subcommodity.map((e) => ((e.key = e.id), e))}
                  pagination={false}
                />
              ),
            }}
          ></Table>
        </Card>
      </GridContent>
    </div>
  );

  useEffect(() => {
    ref.current?.reload();
  }, [userData]);
  const getErrorInfo = (errors) => {
    const errorCount = errors.filter((item) => item.errors.length > 0).length;

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = (fieldKey) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      const key = err.name[0];
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={styles.errorIcon} />
          <div className={styles.errorMessage}>{err.errors[0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });

    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={(trigger) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };

  const onFinish = async (values) => {
    console.log(values);
    setError([]);
    if (commidityData.length == 0) {
      notification.error({
        duration: 4,
        message: '创建错误, 请至少选择一项商品',
      });
      return;
    }

    try {
      values['commodities'] = commidityData;
      let res = await submitForm(values);
      if (res.status != 'success') {
        notification.error({
          duration: 4,
          message: '创建错误',
          content: '创建任务失败，请联系系统管理员',
        });
        return;
      }

      //submit success
      message.success('提交成功,跳转中');
      history.push('/group/detail/' + res.data.id);
    } catch (error) {
      notification.error({
        duration: 4,
        message: '创建错误',
        content: error,
      });
    }
  };

  const { data: User, loading: loadingUser } = useRequest(() => {
    return queryCurrent();
  });

  const { data: Groups, loading: loadingGroups } = useRequest(() => {
    return queryOwn();
  });

  const onFinishFailed = (errorInfo) => {
    setError(errorInfo.errorFields);
  };

  const ref = useRef();
  const columns = [
    {
      title: '团体名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '创建人',
      dataIndex: 'creator_name',
      key: 'creator_name',
      width: '40%',
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, record, index, action) => {
        return [
          <a
            key="delete"
            onClick={() => {
              setUserData(userData.filter((r) => r.id != record.id));
            }}
          >
            删除
          </a>,
        ];
      },
    },
  ];
  return (
    <>
      {loadingUser | loadingGroups ? null : (
        <ProForm
          layout="vertical"
          hideRequiredMark
          submitter={{
            render: (props, dom) => {
              return (
                <FooterToolbar>
                  {getErrorInfo(error)}
                  {dom}
                </FooterToolbar>
              );
            },
          }}
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <PageContainer content="从这里开始创建一个团体">
            <Card title="团体管理" className={styles.card} bordered={false}>
              <Row gutter={16}>
                <Col lg={3} md={12} sm={24}>
                  <ProFormText
                    label={fieldLabels.name}
                    name="name"
                    rules={[
                      {
                        required: true,
                        max: 20,
                        message: '请输入',
                      },
                    ]}
                  />
                </Col>
                <Col
                  xl={{
                    span: 5,
                    offset: 1,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <ProFormText
                    label={fieldLabels.description}
                    name="description"
                    rules={[
                      {
                        required: true,
                        max: 50,
                        message: '请输入',
                      },
                    ]}
                  />
                </Col>
                <Col
                  xl={{
                    span: 5,
                    offset: 1,
                  }}
                  lg={{
                    span: 8,
                  }}
                  md={{
                    span: 12,
                  }}
                  sm={24}
                >
                  <ProFormText
                    label={fieldLabels.remark}
                    name="remark"
                    rules={[
                      {
                        required: true,
                        max: 50,
                        message: '请输入',
                      },
                    ]}
                  />
                </Col>
                <Col
                  xl={{
                    span: 7,
                    offset: 1,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <ProFormSelect
                    label="派送地址"
                    name="address_id"
                    options={
                      !User
                        ? []
                        : User.user_address.map((e) => {
                            return {
                              label: [e.province, e.city, e.area, e.detail].join(' '),
                              value: e.id,
                            };
                          })
                    }
                  ></ProFormSelect>
                </Col>
              </Row>
            </Card>
            <Card title="成员管理" bordered={false}>
              <Row gutter={16}>
                <Col
                  xl={{
                    span: 8,
                  }}
                  lg={{
                    span: 10,
                  }}
                  md={{
                    span: 24,
                  }}
                  sm={24}
                >
                  <ProFormSelect
                    label={fieldLabels.id}
                    allowClear={true}
                    autoClearSearchValue={true}
                    mode="tags"
                    options={
                      Groups.data
                        ? Groups.data.map((r) => {
                            return {
                              label: r.name,
                              value: JSON.stringify(r),
                            };
                          })
                        : [
                            {
                              label: '未找到团体',
                              value: null,
                            },
                          ]
                    }
                    onChange={(e) => {
                      let t = e.map((r) => {
                        return JSON.parse(r);
                      });
                      setUserData(t);
                    }}
                  />
                </Col>
              </Row>
              <ProTable
                search={false}
                request={(params, sorter, filter) => {
                  // 表单搜索项会从 params 传入，传递给后端接口。
                  return Promise.resolve({
                    data: userData,
                    success: true,
                  });
                }}
                actionRef={ref}
                columns={columns}
                rowKey="key"
              />
            </Card>
            <Card title="商品管理" bordered={false}>
              {commodity}
            </Card>
          </PageContainer>
        </ProForm>
      )}
    </>
  );
};

export default Create;

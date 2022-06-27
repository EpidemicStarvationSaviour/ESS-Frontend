import {
  Button,
  Card,
  Image,
  Row,
  Col,
  List,
  Typography,
  message,
  Tag,
  notification,
  Modal,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest, history } from 'umi';
import { queryList, queryNext, reportPos, riderStart, riderStop } from './service';
import styles from './style.less';
const { Paragraph } = Typography;
const Home = () => {
  const { data: listData, loading } = useRequest(() => {
    return queryList({
      page_num: 1,
      page_size: 10000,
    });
  });
  let timer = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [polling, setPolling] = useState(false);
  const [next, setNext] = useState(null);
  console.log(listData);
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
          <Info title="我接到的订单数" value={listData?.count || 0} bordered />
        </Col>
      </Row>
    </Card>
  );

  const poll = async () => {
    window.navigator.geolocation.getCurrentPosition(async function (position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      let res = await reportPos(pos);
      if (res.status != 'success') {
        notification.error({
          message: '上传位置信息失败',
          description: res.msg,
        });
      }
    });
    let res = await queryNext();
    if (res?.data) {
      setNext(res.data);
      setModalVisible(true);
      console.info(res.data);
    }
  };

  const actionButton = (
    <Row justify="center">
      <Col>
        {polling ? (
          <Image
            src="/stop.png"
            preview={false}
            height={'25vh'}
            width={'25vh'}
            onClick={() => {
              riderStop();
              clearInterval(timer.current);
              setPolling(false);
            }}
          />
        ) : (
          <Image
            src="/start.png"
            preview={false}
            height={'25vh'}
            width={'25vh'}
            onClick={async () => {
              window.navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                riderStart(pos);
                timer.current = setInterval(poll, 1000);
              });
              setPolling(true);
            }}
          />
        )}
      </Col>
    </Row>
  );
  const handleOk = () => {
    history.push('/rider/detail/' + next.id);
    clearInterval(timer.current);
    setPolling(false);
    setModalVisible(false);
  };

  const handleCancel = () => {
    clearInterval(timer.current);
    setPolling(false);
    setModalVisible(false);
  };

  const content = (
    <div className={styles.pageHeaderContent}>
      <p>
        这里是您负责配送的团购，如果您已有订单，那么在本页面可以通过电话联系团长，也可以通过点击订单名进入详情页汇报进度；否则，单击下方按钮以开始接单！
      </p>
      {loading ? null : DetailNum}
    </div>
  );

  const ProjectType = (type) => {
    if (!type) {
      return <Tag color="red">未知类型</Tag>;
    }
    switch (type) {
      case 2:
        return <Tag color="green">待配送</Tag>;
      case 3:
        return <Tag color="blue">配送中</Tag>;
      case 4:
        return <Tag color="purple">已经完成</Tag>;
      default:
        return <Tag color="blue">未使用</Tag>;
    }
  };

  return (
    <PageContainer content={content} extraContent={actionButton}>
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 16,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 3,
            xxl: 4,
          }}
          dataSource={listData?.data || []}
          renderItem={(item) => {
            return (
              <List.Item key={item.id}>
                <Card
                  hoverable
                  className={styles.card}
                  actions={[
                    <Button
                      key="wait"
                      type="text"
                      onClick={(e) => {
                        message.info('团长电话: ' + item.creator_phone);
                      }}
                    >
                      联系团长
                    </Button>,
                  ]}
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
                        <a href={'/rider/detail/' + item.id}>{item.name} </a>
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
                            <p>备注</p>
                            <p>{item.remark}</p>
                          </div>
                          <div>
                            <p>报酬</p>
                            <p>{item.reward}</p>
                          </div>
                        </div>
                        <Paragraph
                          className={styles.item}
                          ellipsis={{
                            rows: 3,
                          }}
                        >
                          {[
                            item.creator_address.province +
                            item.creator_address.city +
                            item.creator_address.area +
                            item.creator_address.detail,
                          ].join(' ')}
                        </Paragraph>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
      <Modal
        title="一笔新订单来啦！"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText={'取消'}
        okText={'确认接单'}
      >
        <Card
          hoverable
          className={styles.card}
          actions={[
            <Button
              key="wait"
              type="text"
              onClick={(e) => {
                message.info('团长电话: ' + next?.creator_phone);
              }}
            >
              联系团长
            </Button>,
          ]}
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
                <a href={'/group/detail/' + next?.id}>{next?.name} </a>
                {'   '}
                {<Tag color="green">待配送</Tag>}
              </>
            }
            description={
              <>
                <div className={styles.cardInfo}>
                  <div>
                    <p>团长</p>
                    <p>{next?.creator_name}</p>
                  </div>
                  <div>
                    <p>备注</p>
                    <p>{next?.remark}</p>
                  </div>
                  <div>
                    <p>预计时间</p>
                    <p>{next?.expected_time}分钟</p>
                  </div>
                  <div>
                    <p>报酬</p>
                    <p>{next?.reward}￥</p>
                  </div>
                </div>
                <Paragraph
                  className={styles.item}
                  ellipsis={{
                    rows: 3,
                  }}
                >
                  {[
                    next?.creator_address.AddressProvince,
                    next?.creator_address.AddressCity,
                    next?.creator_address.AddressArea,
                    next?.creator_address.AddressDetail,
                  ].join(' ')}
                </Paragraph>
              </>
            }
          />
        </Card>
      </Modal>
    </PageContainer>
  );
};

export default Home;

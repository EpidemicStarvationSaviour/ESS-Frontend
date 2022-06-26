import React from 'react';
import styles from './index.less';
import { Steps, Divider, Row, Col, message, Button, notification } from 'antd';
import { useRequest, history } from 'umi';
import { queryOrder, groupfd } from './service';
const { Step } = Steps;
const StepsProgress = (props) => {
  const {
    data: currentOrder,
    run: runOrder,
    loading: loadingOrder,
  } = useRequest(
    () => {
      console.log(props);
      return queryOrder(props.id);
    },
    {
      onSuccess: (data, parma) => {
        if (!data) {
          message.error({
            duration: 4,
            content: '获取详情失败，请稍后重试',
          });
          return;
        }
        return data;
      },
      onError: (error, parma) => {
        message.error({
          duration: 4,
          content: '获取团体详情失败，请稍后重试',
        });
      },
    },
  );
  const paths =
    currentOrder?.route_detail?.map((r) => ({
      ...r,
      is_store: true,
    })) || [];
  paths.push({
    is_store: false,
    store_id: currentOrder?.creator_id || 0,
    store_phone: currentOrder?.creator_phone || '',
    store_pos: {
      lat: currentOrder?.creator_address?.lat,
      lng: currentOrder?.creator_address?.lng,
    },
    visited: false,
  });
  const current = paths.findIndex((p) => p.visited == false);
  return (
    <>
      {loadingOrder ? null : (
        <Row>
          <Col span={10}>
            {' '}
            <div className={styles.container}>
              <div id="components-steps-demo-progress-dot">
                <div>
                  <Steps current={current} direction="vertical">
                    {paths.map((p, index) => {
                      return (
                        <Step
                          key={index}
                          title={'第' + (index + 1) + '站'}
                          description={
                            p.store_pos.lat +
                            ',' +
                            p.store_pos.lng +
                            '\n' +
                            '联系方式：' +
                            p.store_phone
                          }
                          status={p.visited ? 'finish' : 'process'}
                          style={{ whiteSpace: 'pre-wrap' }}
                          subTitle={
                            <Button
                              disabled={p.visited}
                              onClick={async (e) => {
                                window.navigator.geolocation.getCurrentPosition(async function (
                                  position,
                                ) {
                                  let lat = 30.2701331;
                                  let lng = 120.1186127;
                                  try {
                                    let res = await groupfd({
                                      group_id: parseInt(props.id),
                                      store_id: p.store_id,
                                      lat,
                                      lng,
                                    });
                                    if (!p.is_store) {
                                      notification.success({
                                        message: '本次订单已经完成，即将为您跳转到列表页',
                                        description: res.msg,
                                      });
                                      history.push('/rider/list');
                                      return;
                                    }
                                    notification.success({
                                      message: '汇报进度成功',
                                      description: '页面即将刷新',
                                    });
                                    runOrder();
                                  } catch (e) {
                                    notification.error({
                                      message: '提交失败，请重试',
                                      description: e,
                                    });
                                  }
                                });
                              }}
                            >
                              {p.visited ? '已经到达' : '我已到店'}
                            </Button>
                          }
                        />
                      );
                    })}
                  </Steps>
                </div>
              </div>
            </div>
          </Col>
          <Col span={14}>一个地图</Col>
        </Row>
      )}
    </>
  );
};
export default StepsProgress;

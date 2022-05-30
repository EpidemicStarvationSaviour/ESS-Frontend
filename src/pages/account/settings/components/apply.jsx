import { List, Button, notification, message } from 'antd';
import React, { Fragment } from 'react';
import { updateInfo } from '../service';
const Apply = () => {
  const getData = () => {
    const Action = (
      <Button
        onClick={async (e) => {
          try {
            const res = await updateInfo({ user_role: 4 });
            if (res.status === 'success') {
              message.success('提交成功');
            } else {
              notification.error({
                message: '提交失败',
                description: res.msg,
              });
            }
          } catch (e) {
            notification.error({
              message: '提交失败',
              description: e.message,
            });
          }
        }}
      >
        申请
      </Button>
    );
    return [
      {
        title: '申请团长',
        description: '团长可以发起拼团，开启一次采购任务',
        actions: [Action],
      },
    ];
  };

  const data = getData();
  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default Apply;

import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message, notification, Form, Cascader } from 'antd';
import ProForm, {
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent } from '../service';
import { queryProvince, queryCity, updateInfo } from '../service';
import styles from './BaseView.less';
import { MapOptions } from '../../../../utils/map';

const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView = () => {
  const {
    data: currentUser,
    run: refreshCurrent,
    loading,
  } = useRequest(() => {
    return queryCurrent();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://i.loli.net/2021/10/27/kJWcOx3RA6GwFEV.jpg';
      return url;
    }

    return '';
  };

  const handleFinish = async (values) => {
    console.log(values);
    try {
      const msg = await updateInfo(values);
      if (msg.status === 'success') {
        notification.success({
          duration: 4,
          description: '个人信息更新成功',
          message: '更新成功',
        });
      } else {
        notification.error({
          duration: 4,
          message: '更新失败',
          description: msg.msg || '更新错误，未知错误类型',
        });
      }
      await refreshCurrent();
    } catch (error) {
      notification.error({
        duration: 4,
        message: '更新失败',
        description: '请求失败，请稍后重新尝试',
      });
    }
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{ ...currentUser }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="user_name"
                label="用户名"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
              <ProFormText
                name="user_phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                ]}
              >
                <Input className={styles.phone_number} />
              </ProFormText>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;

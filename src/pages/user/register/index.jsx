import { useState, useEffect, useRef } from 'react';
import React from 'react';
import {
  Form,
  Button,
  Col,
  Input,
  Popover,
  Progress,
  Row,
  Select,
  message,
  notification,
  Image,
  Typography,
  Cascader,
  Radio,
} from 'antd';
import { Link, useRequest, history, useModel } from 'umi';

import { fakeRegister } from './service';
import styles from './style.less';
import ProForm, { LoginForm, ProFormInstance } from '@ant-design/pro-form';
import { MapOptions } from '../../../utils/map';
const { Title } = Typography;

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};

const Register = () => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;
  const { initialState, setInitialState } = useModel('@@initialState');
  const [role, setRole] = useState(-1);
  let interval;
  const [form] = Form.useForm();

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };
  const onGetCaptcha = () => {
    notification.success({
      duration: 5,
      message: '获取成功',
      description: '您的验证码是: 1234',
    });
    let counts = 59;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);

      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const getPasswordStatus = () => {
    const value = form.getFieldValue('user_secret');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const { loading: submitting, run: register } = useRequest(fakeRegister, {
    formatResult: (d) => d,
    manual: true,
    onSuccess: async (data, params) => {
      console.log(data, params);
      if (!data) {
        notification.error({
          duration: 4,
          description: '未获取到返回值，请稍后再试',
          message: '注册失败',
        });
        return;
      }
      if (data.status && data.status === 'success') {
        message.success('注册成功！');
        await fetchUserInfo();
        history.push({
          pathname: '/user/register-result',
        });
      } else {
        notification.error({
          duration: 5,
          message: '注册失败',
          description: '请联系管理员或请自行排查http请求',
        });
      }
    },
    onError: (error, params) => {
      notification.error({
        duration: 4,
        description: '未获取到返回值，请稍后再试',
        message: '注册失败',
      });
      return;
    },
  });

  const onFinish = (values) => {
    if (values.user_role != 2) {
      values.user_address = {
        province: values.address[0],
        city: values.address[1],
        area: values.address[2],
        detail: values.address_detail,
      };
    } else {
      values.user_address = {
        province: '浙江省',
        city: '杭州市',
        area: '西湖区',
        detail: '浙江大学玉泉校区32舍',
      };
    }

    register(values);
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;
    console.log(value, form.getFieldsValue(true));
    if (value && value !== form.getFieldValue('user_secret')) {
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };

  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况

    if (!value) {
      setVisible(!!value);
      return promise.reject('请输入密码!');
    } // 有值的情况

    if (!visible) {
      setVisible(!!value);
    }

    setPopover(!popover);

    if (value.length < 6) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('user_secret');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Image height={100} width={100} src="https://s2.loli.net/2022/05/15/f2a8D7eS6gt1xBh.png" />
        <Title> EpidemicStarvationSaviour</Title>
      </div>
      <Form
        className={styles.main}
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        initialValues={{
          prefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item
          name="user_name"
          label="昵称"
          rules={[
            {
              required: true,
              message: '请输入昵称!',
            },
            {
              max: '30',
              message: '昵称不能超过30个字符',
            },
          ]}
        >
          <Input size="large" placeholder="昵称" />
        </Form.Item>
        <Popover
          getPopupContainer={(node) => {
            if (node && node.parentNode) {
              return node.parentNode;
            }

            return node;
          }}
          content={
            visible && (
              <div
                style={{
                  padding: '4px 0',
                }}
              >
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress()}
                <div
                  style={{
                    marginTop: 10,
                  }}
                >
                  <span>请至少输入 6 个字符，同时包含数字和字母。请不要使用容易被猜到的密码。</span>
                </div>
              </div>
            )
          }
          overlayStyle={{
            width: 240,
          }}
          placement="right"
          visible={visible}
        >
          <Form.Item
            name="user_secret"
            label="密码"
            className={
              form.getFieldValue('user_secret') &&
              form.getFieldValue('user_secret').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input
              size="large"
              type="password"
              placeholder="至少6位密码，区分大小写，同时包含数字和字母"
            />
          </Form.Item>
        </Popover>
        <Form.Item
          name="confirm"
          label="确认密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input size="large" type="password" placeholder="确认密码" />
        </Form.Item>
        <Form.Item
          name="user_phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              type: '',
            },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="验证码">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                name="captcha"
                noStyle
                rules={[
                  { required: true, message: 'Please input the captcha you got!' },
                  {
                    pattern: /^1234$/,
                    message: '验证码输入错误',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Button
                size="large"
                disabled={!!count}
                className={styles.getCaptcha}
                onClick={onGetCaptcha}
              >
                {count ? `${count} s` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label="身份选择"
          name="user_role"
          rules={[{ required: true, message: '请选择你的身份' }]}
        >
          <Radio.Group onChange={(e) => setRole(e.target.value)}>
            <Radio.Button value={1}>商家</Radio.Button>
            <Radio.Button value={2}>骑手</Radio.Button>
            <Radio.Button value={3}>用户</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {(role == 1 || role == 3) && (
          <>
            <Form.Item
              name="address"
              label="地址选择"
              rules={[
                {
                  type: 'array',
                  required: true,
                  message: 'Please select your habitual residence!',
                },
              ]}
            >
              <Cascader options={MapOptions} />
            </Form.Item>
            <Form.Item
              name="address_detail"
              label="详细地址"
              rules={[
                {
                  required: true,
                  message: '请输入详细地址!',
                },
                {
                  max: '60',
                  message: '详细不能超过60个字符',
                },
              ]}
            >
              <Input placeholder="详细地址" />
            </Form.Item>
          </>
        )}

        <Form.Item {...tailFormItemLayout}>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            <span>注册</span>
          </Button>
          <Link className={styles.login} to="/user/login">
            <span>使用已有账户登录</span>
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;

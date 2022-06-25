import { PlusOutlined, HomeOutlined, ContactsOutlined, ClusterOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Input, Row, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Link, useRequest } from 'umi';
import Projects from './components/Projects';
import Articles from './components/Articles';
import Applications from './components/Applications';
import { queryCurrent, queryOwnGroup } from './service';
import styles from './Center.less';
import { fakeUserNotice } from './_mock.js';
import { queryList } from '@/pages/group/ListCardList/service';
import { queryGroup } from '@/pages/dashboard/workplace/service';
const fakeTag = [
  {
    key: '0',
    label: '很有想法的',
  },
  {
    key: '1',
    label: '专注设计',
  },
  {
    key: '2',
    label: '辣~',
  },
  {
    key: '3',
    label: '大长腿',
  },
  {
    key: '4',
    label: '川妹子',
  },
  {
    key: '5',
    label: '海纳百川',
  },
];
const operationTabList = [
  {
    key: 'articles',
    tab: (
      <span>
        文章{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
  {
    key: 'applications',
    tab: (
      <span>
        应用{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
  {
    key: 'projects',
    tab: (
      <span>
        项目{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          (8)
        </span>
      </span>
    ),
  },
];

const TagList = ({ ownGroup }) => {
  const ref = useRef(null);
  const [newTags, setNewTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const showInput = () => {
    setInputVisible(true);

    if (ref.current) {
      // eslint-disable-next-line no-unused-expressions
      ref.current?.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    let tempsTags = [...newTags];

    if (inputValue && tempsTags.filter((tag) => tag.label === inputValue).length === 0) {
      tempsTags = [
        ...tempsTags,
        {
          id: `new-${tempsTags.length}`,
          name: inputValue,
        },
      ];
    }

    setNewTags(tempsTags);
    setInputVisible(false);
    setInputValue('');
  };

  return (
    <div className={styles.tags}>
      <div className={styles.tagsTitle}>创建的团</div>
      {(ownGroup || []).concat(newTags).map((item) => (
        <Tag key={item.id}>{item.name}</Tag>
      ))}
      {inputVisible && (
        <Input
          ref={ref}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag
          onClick={showInput}
          style={{
            borderStyle: 'dashed',
          }}
        >
          <PlusOutlined />
        </Tag>
      )}
    </div>
  );
};

const Center = () => {
  const [tabKey, setTabKey] = useState('articles'); //  获取用户信息

  const { data: currentUser, loading } = useRequest(queryCurrent, {
    // formatResult: (e) => {
    //   console.log(e);
    //   return e.data;
    // },
  }); //

  const { data: ownGroup = {}, loading: ownGroupLoading } = useRequest(() =>
    queryOwnGroup({ type: 0, page_num: 1, page_size: 10 }),
  );

  const { data: groupList = {}, loading: groupLoading } = useRequest(() =>
    queryGroup({ type: 0, page_num: 1, page_size: 10 }),
  );
  const renderUserInfo = ({ user_id, user_name, user_phone, user_address }) => {
    let default_address = user_address.find((item) => item.is_default === true);
    if (!default_address) {
      default_address = user_address[0];
    }
    default_address = default_address || {};
    return (
      <div className={styles.detail}>
        <p>
          <ContactsOutlined
            style={{
              marginRight: 8,
            }}
          />
          {user_id}
        </p>
        <p>
          <ClusterOutlined
            style={{
              marginRight: 8,
            }}
          />
          {user_phone}
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {default_address.province}
          {default_address.city}
          {default_address.area}
        </p>
        <p>
          <HomeOutlined
            style={{
              marginRight: 8,
            }}
          />
          {default_address.detail}
        </p>
      </div>
    );
  }; // 渲染tab切换

  const renderChildrenByTabKey = (tabValue) => {
    if (tabValue === 'projects') {
      return <Projects />;
    }

    if (tabValue === 'applications') {
      return <Applications />;
    }

    if (tabValue === 'articles') {
      return <Articles />;
    }

    return null;
  };

  return (
    <GridContent>
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card
            bordered={false}
            style={{
              marginBottom: 24,
            }}
            loading={loading}
          >
            {!loading && !groupLoading && !ownGroupLoading && currentUser && (
              <div>
                <div className={styles.avatarHolder}>
                  <img alt="" src={'https://i.loli.net/2021/10/27/kJWcOx3RA6GwFEV.jpg'} />
                  <div className={styles.name}>{currentUser.user_name}</div>
                  <div>{'Zero is start'}</div>
                </div>
                {renderUserInfo(currentUser)}
                <Divider dashed />
                <TagList ownGroup={ownGroup?.data || []} />
                <Divider
                  style={{
                    marginTop: 16,
                  }}
                  dashed
                />
                <div className={styles.team}>
                  <div className={styles.teamTitle}>参加的团</div>
                  <Row gutter={36}>
                    {groupList &&
                      groupList.data?.map((item) => (
                        <Col key={item.id} lg={24} xl={12}>
                          <Link>{item.name}</Link>
                        </Col>
                      ))}
                  </Row>
                </div>
              </div>
            )}
          </Card>
        </Col>
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={(_tabKey) => {
              setTabKey(_tabKey);
            }}
          >
            {renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </Row>
    </GridContent>
  );
};

export default Center;

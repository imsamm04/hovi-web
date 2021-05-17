import React from 'react';
import {Layout} from 'antd';
import {CardSearch, HomeHeader} from 'components';
import styles from './HomeLayout.less';

const {Content} = Layout;

export default ({children, history}) => {
  return (
    <Layout>
      <HomeHeader history={history}/>
      <Content>
        <div className={styles.cover}>
          <CardSearch/>
        </div>
        {children}
      </Content>
    </Layout>
  );
}

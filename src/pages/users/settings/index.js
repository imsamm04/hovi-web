import React, {Component} from 'react'
import styles from './index.less';
import {Menu, PageHeader} from 'antd';
import BasicInformation from '../../../components/AccountSetting/BasicInformation';
import SecurityComponent from '../../../components/AccountSetting/SecurityComponent';
import ChangePassword from '../../../components/AccountSetting/ChangePassword';

const {Item} = Menu;

class AccountSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      mode: 'inline',
      selectKey: 'base',
    };
  }

  selectKey = key => {
    this.setState({
      selectKey: key,
    });
  };

  render() {
    const {mode, selectKey} = this.state;

    const renderChildren = () => {
      switch (selectKey) {
        case 'base':
          return <BasicInformation/>;
        //case 'binding':
        // return <TranferHistory />;
        case 'security':
          return <SecurityComponent/>;
        case 'changePassword':
          return <ChangePassword/>;
        default:
          break;
      }
      return null;
    };

    return (
      <PageHeader title='Quản lý tài khoản'>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu mode={mode} selectedKeys={[selectKey]} onClick={({key}) => this.selectKey(key)}>
              {Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>)}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{menuMap[selectKey]}</div>
            {renderChildren()}
          </div>
        </div>
      </PageHeader>
    );
  }
}

export default AccountSetting;

const menuMap = {
  base: 'Thông tin cơ bản',
  security: 'Xác thực tài khoản',
  changePassword: 'Đổi mật khẩu',
};

import React, {Component} from 'react';
import {Avatar, Button, Col, Icon, Layout, Menu, message, Modal, Row} from 'antd/lib/index';
import {CONST, FirebaseApp} from 'utils';
import * as DBFirebase from 'services/DBFirebase';
import {Auth} from 'services';
import Login from '../../Auth/Login';
import Register from '../../Auth/Register';
import ForgotPassword from '../../Auth/ForgotPassword';
import ResetPasswrod from '../../Auth/ResetPasswrod';
import LocationSearch from '../../ElasticSearch/LocationSearch';
import VerifyPhoneNumber from '../../Auth/VerifyPhoneNumber';
import HeaderDropdown from '../HeaderDropdown';
import NoticeIcon from '../NoticeIcon';
import ReportForm from '../../Form/ReportForm';
import Loader from '../Loader';
import router from 'umi/router';
import classNames from 'classnames';
import SvgLogo from '../../../assets/logo.svg';
import styles from './HomeHeader.less';

const {Header} = Layout;
const {SubMenu} = Menu;

const getNoticeData = (notices) => {
  if (!notices || notices.length === 0) return {};
  else return notices.reduce((pre, data) => {
    if (!pre[data.type]) {
      pre[data.type] = [];
    }
    pre[data.type].push(data);
    return pre;
  }, {});
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: 0,
      isVisible: false, // is showing modal to login or register
      isReportModalOpen: false,
      reportData: {},
      verification: {}, // check phone number is verify
      isLoading: true,
      currentUser: null,
      notification: [],
      query: {}
    };

    this.notice = React.createRef();
  }

  componentWillMount() {
    /**
     * Listen changed from url
     * Open the login view modal when needed.
     **/
    this.unlisten = this.props.history.listen((location) => {
      const {login, mode, oobCode} = location.query;
      if (login) this.onChangeCurrentView(CONST.LOGIN_VIEW_CODE);
      else if (mode === 'verifyEmail' && oobCode) this.verifyEmail(oobCode);
      else if (mode === 'resetPassword') {
        this.setState({query: location.query});
        this.onChangeCurrentView(CONST.RESET_PASSWORD_VIEW_CODE)
      }
    });
  }

  componentDidMount() {
    /**
     * Listen auth state
     * Set current user when auth changed.
     **/
    this.unsubscribe = FirebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        const {displayName, uid} = user;
        this.setState({
          isLoading: false,
          currentUser: {
            ...user,
            firstName: !!displayName ? displayName.split(',')[0] : '',
            lastName: !!displayName ? displayName.split(',')[1] : '',
          }
        }, () => this.onListenNoticeMessages(uid));
      } else this.setState({isLoading: false});
    });
  }

  componentWillUnmount() {
    /**
     * Turn off listen event when this component destroy.
     **/
    const {currentUser} = this.state;
    if (this.unsubscribe) this.unsubscribe();
    if (this.unlisten) this.unlisten();
    if (currentUser) DBFirebase.offNoticeListen(currentUser.uid, this.noticeMessages);
  }

  verifyEmail = (oobCode) => {
    const hide = message.loading('Đang xác thực email..', 0);
    new Auth().verifyEmail({oobCode}).then(() => {
      hide();
      message.success('Xác thực email thành công!');
      router.replace('/');
    }).catch(error => {
      hide();
      const {data} = error.response;
      router.replace('/');
      if (data.message === 'INVALID_OOB_CODE' || data.message === 'EXPIRED_OOB_CODE')
        this.setState({isLoading: false}, () => {
          message.error('Đường dẫn xác thực email này đã hết hạn, hãy thử lại !');
        }); else this.setState({isLoading: false}, () => {
        message.error('Xác thực email thất bại, hãy thử lại sau!');
      });
    });
  };

  /**
   * When click cancel modal view
   **/
  handleCancel = () => this.setState({isVisible: false}, () => router.push(this.props.history.location.pathname));

  /**
   * When click menu item in header
   **/
  onMenuClick = (e) => {
    if (e.key === 'logout') FirebaseApp.auth().signOut().then(() => {
      console.debug('logout successfully !');
      window.location.reload();
    }); else if (e.key === 'profile') {
      const {currentUser} = this.state;
      router.push(`/users/show/${currentUser.uid}`);
    } else if (e.key === 'accountSettings') {
      router.push(`/users/settings`);
    } else if (e.key === 'myRoom') {
      router.push(`/my-rooms`);

    }
  };

  /**
   * Set state change view in modal
   * View can be: Login View, Register View, Verify Phone Number View
   **/
  onChangeCurrentView = (currentView, verification = {}) => this.setState({
    currentView,
    verification,
    isVisible: true,
  });

  /**
   * Listen notice messages
   **/
  onListenNoticeMessages = (uid) => {
    this.noticeMessages = DBFirebase.getNoticeMessages(uid, notice => {
      this.setState({notification: notice ? notice : {}});
    })
  };

  /**
   * On item notification click
   **/
  onItemClick = (item) => {
    const {uid} = this.state.currentUser;
    !item.read && DBFirebase.readNotification(uid, item.key);

    if (item.description.type === 'REPORT') this.setState({
      reportData: item,
      isReportModalOpen: true
    }, () => this.notice.current.onClose());
    else {
      if (this.props
        && this.props.history
        && this.props.history.location
        && this.props.history.location.pathname === `/transactions/${item.id}`)
        window.location.reload();
      else router.push(`/transactions/${item.id}`);
    }
  };

  render() {
    const {locationQuery, handleChangeLocation} = this.props;
    const {currentView, isVisible, verification, currentUser, isLoading, notification, query, isReportModalOpen, reportData} = this.state;

    const isHomepage = !handleChangeLocation;
    const menuItemClass = classNames(styles.baseMenuItem, {[styles.isHomepageMenuItem]: isHomepage});

    const titleViewModal = () => {
      switch (currentView) {
        case CONST.REGISTER_VIEW_CODE:
          return 'Đăng kí';
        case CONST.LOGIN_VIEW_CODE:
          return 'Đăng nhập';
        case CONST.VERIFY_VIEW_CODE:
          return 'Xác nhận số điện thoại';
        case CONST.FORGOT_PASSWORD_VIEW_CODE:
          return 'Quên mật khẩu';
        case CONST.RESET_PASSWORD_VIEW_CODE:
          return 'Đặt lại mật khẩu';
        default:
          return '';
      }
    };

    const currentViewComponent = () => {
      switch (currentView) {
        case CONST.REGISTER_VIEW_CODE:
          return <Register onChangeCurrentView={this.onChangeCurrentView}/>;
        case CONST.LOGIN_VIEW_CODE:
          return <Login onChangeCurrentView={this.onChangeCurrentView}/>;
        case CONST.VERIFY_VIEW_CODE:
          return <VerifyPhoneNumber verification={verification} onChangeCurrentView={this.onChangeCurrentView}/>;
        case CONST.FORGOT_PASSWORD_VIEW_CODE:
          return <ForgotPassword handleCancel={this.handleCancel}/>;
        case CONST.RESET_PASSWORD_VIEW_CODE:
          return <ResetPasswrod query={query} handleCancel={this.handleCancel}/>;
        default:
          return <div/>;
      }
    };

    const accountMenu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="myRoom">
          <Icon type="home"/>
          Phòng của tôi
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="profile">
          <Icon type="user"/>
          Trang cá nhân
        </Menu.Item>
        <Menu.Item key="accountSettings">
          <Icon type="setting"/>
          Quản lý tài khoản
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item key="logout">
          <Icon type="logout"/>
          Đăng xuất
        </Menu.Item>
      </Menu>
    );

    const noticeData = getNoticeData(Object.values(notification));
    const unreadCount = Object.values(notification).filter(value => value.read === false);
    const unreadTypeCount = (type) => {
      if (!noticeData || !noticeData[type]) return 0;
      else return noticeData[type].filter(value => value.read === false).length;
    };

    if (isLoading) return <Loader fullScreen={true}/>;
    return (
      <Header className={classNames(styles.baseHeader, {[styles.isHomepageHeader]: isHomepage})}>
        <a className={classNames(styles.baseLogo, {[styles.isHomepageLogo]: isHomepage})} href='/'>
          <img src={SvgLogo} alt='logo'/>
        </a>
        <Row type="flex" justify="space-between" align="middle" style={{width: '100%', paddingRight: '24px'}}>
          <Col span={12}>
            {!isHomepage && <div className={styles.rowSearchContainer}>
              <LocationSearch
                locationQuery={locationQuery}
                placeholder='Nơi bạn muốn tìm phòng'
                className={styles.searchContainer}
                handleChangeLocation={handleChangeLocation}/>
              <Button
                size='large'
                type='link'
                className={styles.searchBtn}
                onClick={() => this.props.handleSearch()}>Tìm kiếm</Button>
            </div>}
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            <Menu mode="horizontal" theme='light' selectedKeys={['0']}
                  className={classNames(styles.baseMenu, {[styles.isHomepageMenu]: isHomepage})}>
              {!isLoading && currentUser ? <SubMenu
                style={{zIndex: 1100}}
                className={menuItemClass}
                onTitleClick={() => {
                  if (currentUser) router.push('/become-a-host');
                  else this.onChangeCurrentView(CONST.LOGIN_VIEW_CODE);
                }}
                title={<a className={classNames({}, {[styles.isHomepageBorder]: !isHomepage})}>Trở thành chủ nhà</a>}>
                <Menu.Item
                  style={{zIndex: 1100}}
                  key="createRoom"
                  onClick={() => {
                    if (currentUser) router.push('/become-a-host');
                    else this.onChangeCurrentView(CONST.LOGIN_VIEW_CODE);
                  }}>
                  <Icon type="plus"/>
                  Tạo phòng cho thuê mới
                </Menu.Item>
                <Menu.Item
                  style={{zIndex: 1100}}
                  key="managementRoom"
                  onClick={() => router.push('/host/management')}>
                  <Icon type="home"/>
                  Phòng cho thuê của tôi
                </Menu.Item>
              </SubMenu> : <Menu.Item key="1" className={menuItemClass}>
                <a className={classNames({}, {[styles.isHomepageBorder]: isHomepage})}
                   onClick={() => this.onChangeCurrentView(CONST.LOGIN_VIEW_CODE)}>Trở thành chủ nhà</a>
              </Menu.Item>}
              {!isLoading && !currentUser && <Menu.Item
                key="2" className={menuItemClass}
                onClick={() => this.onChangeCurrentView(CONST.REGISTER_VIEW_CODE)}>Đăng kí</Menu.Item>}
              {!isLoading && !currentUser && <Menu.Item
                key="3" className={menuItemClass}
                onClick={() => this.onChangeCurrentView(CONST.LOGIN_VIEW_CODE)}>Đăng nhập</Menu.Item>}
              {!isLoading && currentUser && <NoticeIcon
                ref={this.notice}
                className={styles.action}
                count={unreadCount.length}
                onItemClick={this.onItemClick}
                onViewMore={() => router.push('/notification')}
                clearClose>
                <NoticeIcon.Tab
                  title="Thông báo"
                  count={unreadTypeCount('notification')}
                  list={noticeData.notification && noticeData.notification.reverse()}
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  title="Tin nhắn"
                  count={unreadTypeCount('message')}
                  list={noticeData.message && noticeData.message.reverse()}
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
              </NoticeIcon>}
              {!isLoading && currentUser && <HeaderDropdown overlay={accountMenu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar className={styles.avatar} src={currentUser.photoURL}/>
                    <span className={styles.name}>{currentUser.phoneNumber}</span>
                  </span>
              </HeaderDropdown>}
            </Menu>
          </Col>
        </Row>
        {/* Modal form login or register*/}
        {!isLoading && !currentUser && <Modal
          centered
          title={titleViewModal()}
          width={500}
          footer={null}
          onCancel={this.handleCancel}
          visible={isVisible}>
          {currentViewComponent()}
        </Modal>}
        <ReportForm
          report={reportData}
          visible={isReportModalOpen}
          onClose={() => this.setState({isReportModalOpen: false})}/>
      </Header>
    );
  }
}

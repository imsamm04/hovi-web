import React, {Component} from 'react';
import Profile from '../../../components/DetailUser/Profile';
import router from 'umi/router';
import styles from './index.less';
import {Spin} from 'antd';
import {API} from 'services';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      currentUser: {},
      user_avatar: '',
      user_name: '',
      user_address: '',
      verification: [],
      canComment: '',
      userId:'',
    }
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (isNaN(Number(id))) router.push('/404');
    new API('userShow').get(Number(id)).then(response => {
      if (response.responseStatus === 200) {
        console.log(response);
        this.setState({
          user_name: response.user.user_name,
          user_avatar: response.user.user_avatar,
          user_address: response.user.user_address,
          verification: response.user.verification,
          canComment: response.canComment,
          isLoading: false,
          userId:id,
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const {isLoading, user_name, user_address, user_avatar, verification, canComment,userId} = this.state;

    if (isLoading) return <Spin spinning={true}/>
    return (
      <div className={styles.show}>
        <Profile
          dataLoading={isLoading}
          user_name={user_name}
          user_avatar={user_avatar}
          user_address={user_address}
          verification={verification}
          canComment={canComment}
          userId={userId}
        />
      </div>
    );
  }
}

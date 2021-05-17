import React, {Component} from 'react';
import {Button, Card, Col, Divider, message, Row, Typography, Modal} from 'antd';
import styles from './index.less';
import {formatterCurrency} from '../../../utils/index';
import {normalizePhoneNumber} from '../../../utils/index';
import router from 'umi/router';
import LocalStorage from 'utils/LocalStorage';
import {API} from 'services';

const {Title} = Typography;
const {confirm} = Modal;

class SideBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhone: false,
      isHost: false,
      chosenRoomId: '',
      key: '',
      isLoading: false
    };
    this.contact = this.contact.bind(this);
  }

  componentDidMount() {
    const {availableRooms, allRooms} = this.props;
    if (!!availableRooms && availableRooms.length > 0) {
      this.setState({chosenRoomId: availableRooms[0].roomId})
    } else {
      this.setState({chosenRoomId: allRooms[0].roomId});

    }
    LocalStorage.getCurrentUser().then(
      response => {
        const uid = !!response ? response.uid : '';
        if (uid == this.props.hostId) {
          this.setState({isHost: true});
        }
      })
  }

  doContact = () => {
    const {roomGroupId, hostId} = this.props;
    this.setState({isLoading: true});
    LocalStorage.getCurrentUser()
      .then(currentUser => {
        const uid = !!currentUser ? currentUser.uid : '';
        if (hostId == uid) this.setState({
          isLoading: false
        }, () => {
          message.error('Chủ trọ không thể tự thuê phòng');
          window.location.reload();
        }); else if (currentUser) {
          const chosenRoomId = Number(this.state.chosenRoomId);
          console.log(chosenRoomId);
          new API('transaction/' + chosenRoomId).create()
            .then(response => {
              this.setState({
                isLoading: false
              }, () => {
                const transactionId = response.transactionId;
                console.log('Current Uid: ' + currentUser.uid);
                router.push('/transactions/' + transactionId);
              })
            }).catch(error => {
            console.log(error);
            message.error('Có lỗi xảy ra ! Xin vui lòng thử lại sau.')
          });
        } else this.setState({
          isLoading: false
        }, () => {
          message.error('Bạn cần phải đăng nhập để tiếp tục !');
          router.push(`/room-detail/${roomGroupId}?login=true`)
        })
      }).catch(() => this.setState({
      isLoading: false
    }, () => router.push(`/room-detail/${roomGroupId}?login=true`)))
  };

  contact = () => {
    confirm({
      title: 'Lưu ý',
      content: 'Khi liên thuê phòng, chủ phòng có thể xem các thông tin cá nhân của bạn để quyết định thuê phòng !',
      okText: 'Đồng ý',
      cancelText: 'Không',
      onOk: () => this.doContact(),
      onCancel() {
        console.log('Cancel');
      },
    });
  };


  render() {
    const {phone, deposit, minDepositPeriod, hostName, avatar} = this.props;
    const {isLoading} = this.state;
    const phoneNumber = normalizePhoneNumber(phone);
    const showPhone = this.state.showPhone;

    const hidePhoneNumber = (
      <div>
        {phoneNumber.substr(0, phoneNumber.length - 3)}
        <a onClick={() => this.setState({showPhone: true})}>...hiển thị</a>
      </div>
    );

    return (
      <div>
        <Card className={styles.mainBox}>
          <div style={{textAlign: 'center'}}>
            <Row gutter={[5, 5]}>
              <div className={styles.avatarHolder}>
                <img alt=""
                     src={!avatar ? "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" : avatar}/>
                <Title className={styles.title} level={4}>{!!hostName ? hostName : 'Chủ nhà'}</Title>
                <div>{showPhone ? phoneNumber : hidePhoneNumber}</div>
              </div>
            </Row>
          </div>
          <Divider dashed/>
          <Row gutter={[8, 8]} className={styles.depositCost}>
            <Col span={24}>
              <Title level={4}>
                <div>Tiền cọc:</div>
                {formatterCurrency(deposit)} VNĐ ({minDepositPeriod} tháng)</Title>
            </Col>
            <Col>
              {!this.state.isHost &&
              <Button
                className={styles.buttonDeposit}
                size='large'
                loading={isLoading}
                onClick={this.contact}>Liên hệ chủ nhà</Button>
              }
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default SideBox;

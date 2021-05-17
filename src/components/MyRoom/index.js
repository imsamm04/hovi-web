import React, {Component} from "react";
import styles from './index.less';
import {List, Row, Col, Button, Typography, Empty, Tag} from 'antd';
import {formatterCurrency} from "../../utils";
import {API} from 'services';
import {timestampToDate} from '../../utils/index';
import LocalStorage from "../../utils/LocalStorage";
import {MyContactRoomStatus} from "../../utils/const";

const {Title} = Typography;

class MyRoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: '',
    }

  }

  componentDidMount() {
    LocalStorage.getCurrentUser()
      .then(currentUser => {
        if (currentUser) this.setState({currentUserId: currentUser.uid})
      }).catch(error => {
      console.log(error);
    })
  }

  moveToMessagePage = (transactionId) => {
    window.open('/transactions/' + transactionId);
  };

  contactHost = (roomId) => {
    new API('transaction/' + roomId).create()
      .then(response => {
        const transactionId = response.transactionId;
        window.open('/transactions/' + transactionId);
      }).catch(error => {
      console.log(error);
    })
  };

  removeDuplicates = (array, key) => {
    // if (!array.constructor.toString().indexOf("Array") != -1) return [];
    let lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
  };

  render() {
    const {listRoom, keySent} = this.props;
    const {currentUserId} = this.state;
    const uniqueListRoom = this.removeDuplicates(listRoom, 'roomGroupId');
    const generateRoomTransactionDetail = (item) => {
      console.log(item);
      return (
        <div>
          {keySent != 3 ?
            <div>
              <Col span={24}>Thời gian nhận phòng: {timestampToDate(item.receiveRoomTime)} </Col>
              <Col span={24} style={{textAlign: 'center'}}>
                <Button onClick={() => this.moveToMessagePage(item.transactionId)} type={"primary"}>Liên hệ với chủ
                  nhà</Button>
              </Col>
            </div>
            : currentUserId != item.host.userId ?
              <Col span={24} style={{textAlign: 'center'}}>
                <Button type={"primary"} onClick={() => this.contactHost(item.roomId)}>Liên hệ với chủ nhà</Button>
              </Col>
              : ''
          }
        </div>
      )
    };

    return (
      <div>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 5,
          }}

          locale={{emptyText: <Empty description='Không có thông tin phòng'/>}}
          dataSource={keySent != 3 && keySent != 4 ? listRoom : uniqueListRoom}
          renderItem={item => (
            <List.Item
              key={item.roomId}
            >
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <img
                    width={300}
                    height={150}
                    alt="logo"
                    src={item.image}
                  />
                </Col>
                <Col span={16} style={{paddingTop: '0 !important'}}>
                  <Col span={24}>
                    <a href={'/room-detail/' + item.roomGroupId} target={'_blank'} style={{color: 'black'}}>
                      <Title level={4} style={{marginBottom: 0}}>{item.title}</Title>
                    </a></Col>
                  <Col span={!!item.transactionId && item.buildingTypeId == 3 ? 12 : 24}>Địa
                    chỉ: {JSON.parse(item.address.ward)[0]
                    + ', ' + JSON.parse(item.address.district)[0] + ', ' + JSON.parse(item.address.province)[0]}</Col>
                  {!!item.transactionId && item.buildingTypeId == 3 &&
                  <Col span={12}>Tên phòng: <span className={styles.roomName}>{item.roomName}</span></Col>}
                  <Col span={12}>Tiền thuê: {formatterCurrency(item.price) + ' VNĐ'} </Col>
                  <Col span={12}>Tiền đặt cọc: {formatterCurrency(item.deposit) + ' VNĐ'} </Col>
                  {keySent == 3 &&
                  <Col span={24}>Trạng thái: {item.roomStatus == 1 ?
                    <Tag color="green">Còn phòng</Tag>
                    : <Tag color="red">Không còn phòng</Tag>}
                  </Col>
                  }
                  {
                    keySent == 4 && !!item.transactionStatus &&
                    <Col span={24}>Trạng thái phòng:
                      <Tag color={MyContactRoomStatus.find(obj => obj.code == item.transactionStatus).color}
                           style={{marginLeft: '10px'}}>
                        {' ' + MyContactRoomStatus.find(obj => obj.code == item.transactionStatus).name}
                      </Tag>
                    </Col>
                  }
                  <Col span={24}>Chủ phòng: {item.host.userName}</Col>
                  {
                    generateRoomTransactionDetail(item)
                  }
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default MyRoomList;

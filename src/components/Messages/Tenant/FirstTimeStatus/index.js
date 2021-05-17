import React, {Component} from 'react';
import {Row, Col, DatePicker, Radio, Button, message} from 'antd';
import styles from "../../../../pages/transactions/$id/index.less";
import {API} from 'services';
import router from "umi/router";
import {TransactionStatus} from "../../../../utils/const";

class FirstTimeStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenRoomId: props.transactionStatus.room_id,
      chosenDate: '',
      changeStatus: true,
      isAvailable: !!props.availableRooms.length
    };

    this.onDateOk = this.onDateOk.bind(this);
    this.onRoomChange = this.onRoomChange.bind(this);
    this.updateTransaction = this.updateTransaction.bind(this);
  }

  onDateOk = function (value) {
    this.setState({chosenDate: value});
  };

  onRoomChange = function (e) {
    this.setState({chosenRoomId: e.target.value});
  };

  updateTransaction() {
    if(!this.state.chosenDate){
      message.info('Chọn ngày nhận phòng');
      return;
    }
    const chosenRoomId = Number(this.state.chosenRoomId);
    const {transactionStatus, buildingTypeId} = this.props;
    const data = {
      userId: transactionStatus.user_id,
      roomId: chosenRoomId,
      startDate: this.state.chosenDate,
      transactionStatus: TransactionStatus.ACCEPT_WAITING,
    };

    this.props.handleUpdateStatus({
      isStatusLoading: true,
    });

    new API('transactionLockRoom').update({id: transactionStatus.transaction_id, data})
      .then(response => {
        console.log(response);
        if (response.status == 303) {
          if (buildingTypeId != 3) {
            message.error(buildingTypeId == 1 ? 'Căn chung cư hiện tại không còn trống' : 'Căn nhà hiện tại không còn trống');
            this.setState({isAvailable: false});
          } else {
            message.error(`Căn phòng bạn chọn không còn trống`);
            this.setState({isAvailable: false});
            this.setState({isAvailable: true});
          }
        }
        this.props.handleUpdateStatus({
          status: response.transactionStatus,
          isStatusLoading: false
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    const {isAvailable} = this.state;
    const {buildingTypeId, availableRooms, transactionStatus} = this.props;

    return (
      <Col>
        {isAvailable && <Row gutter={16}>
          <Col span={24} className={styles.highlightLabel}>Thời gian nhận phòng</Col>
          <Col span={24} style={{margin: '8px 0'}}>
            <DatePicker
              style={{width: '100%'}}
              placeholder="Chọn ngày"
              onChange={this.onDateOk}
              disabledDate={d => !d || d.isBefore(new Date(Date.now() - 24 * 60 * 60 * 1000))}/>
          </Col>
        </Row>
        }
        {buildingTypeId == 3 &&
        <Row gutter={16}>
          <Col span={24} className={styles.highlightLabel}>Chọn phòng</Col>
          <Radio.Group onChange={this.onRoomChange} defaultValue={transactionStatus.room_id}>
            {
              availableRooms.map((room) =>
                <Col span={8} key={room.roomId}>
                  <Radio value={room.roomId}>{room.roomName}</Radio>
                </Col>
              )
            }
          </Radio.Group>
        </Row>
        }
        <Col span={24}>
          {isAvailable ?
            <Button className={styles.actionBtn} size='large' type='primary' onClick={
              () => this.updateTransaction()
            }>Gửi yêu cầu thuê phòng</Button>
            :
            <Button
              className={styles.actionBtn}
              size='large'
              type='primary'
              disabled={true}>Hiện tại không còn
              phòng</Button>
          }
        </Col>
      </Col>
    )
  }

}

export default FirstTimeStatus;

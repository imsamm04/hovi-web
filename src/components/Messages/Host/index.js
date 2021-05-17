import React, {Component} from 'react';
import {Row, Col, Button, message} from 'antd';
import styles from "../../../pages/transactions/$id/index.less";
import {API} from 'services';
import {TransactionStatus} from '../../../utils/const';

class DisplayForHost extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.updateTransaction = this.updateTransaction.bind(this);
    this.rejectTransaction = this.rejectTransaction.bind(this);
  }

  updateTransaction(status) {
    const {transactionStatus} = this.props;
    const data = {
      userId: transactionStatus.user_id,
      roomId: transactionStatus.room_id,
      transactionStatus: status
    }

    this.props.handleUpdateStatus({
      isStatusLoading: true
    });
    new API('transaction').update({id: transactionStatus.transaction_id, data})
      .then(response => {
        console.log(response);
        this.props.handleUpdateStatus({
          status: response.transactionStatus,
          isStatusLoading: false
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  rejectTransaction(status) {
    const {transactionStatus} = this.props;
    const data = {
      userId: transactionStatus.user_id,
      roomId: transactionStatus.room_id,
      transactionStatus: status
    }

    this.props.handleUpdateStatus({
      isStatusLoading: true
    });
    new API('transactionReject').update({id: transactionStatus.transaction_id, data})
      .then(response => {
        console.log(response);
        this.props.handleUpdateStatus({
          status: response.transactionUpdate.transactionStatus,
          isStatusLoading: false
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    const {transactionStatus, status, buildingTypeId} = this.props;
    return (
      <div>
        {!!status &&
        !!transactionStatus &&
        <Row gutter={[16, 16]}>
          {/*<Col span={24}>Tên khách thuê: {transactionStatus.last_name} </Col>*/}
          {/*<Col span={24}>Số điện thoại: {transactionStatus.phone_number}</Col>*/}
          {status == TransactionStatus.ACCEPT_WAITING &&
          <div>
            {buildingTypeId == 3 && <Col span={24} className={styles.highlightLabel}>
              Khách muốn thuê phòng {transactionStatus.room_name}
            </Col>}
            <Col span={12} style={{padding: '0 5px'}}>
              <Button type="primary" className={styles.actionBtn} onClick={
                () => this.updateTransaction(TransactionStatus.NOT_ENOUGH_BALANCE)}>Đồng ý</Button>
            </Col>
            <Col span={12} style={{padding: '0 5px'}}>
              <Button type="danger" className={styles.actionBtn} onClick={
                () => this.rejectTransaction(TransactionStatus.HOST_REJECTED)}>Từ chối</Button>
            </Col>
          </div>
          }
          {status == TransactionStatus.NOT_ENOUGH_BALANCE &&
          <div>
            <Col span={24} className={styles.highlightSuccess}>Chờ khách thuê chuyển khoản</Col>
          </div>
          }
          {
            status == TransactionStatus.ENOUGH_BALANCE &&
            <div>
              <Col span={24} className={styles.highlightSuccess}>Khách thuê đã đặt cọc</Col>
            </div>
          }
          {
            status == TransactionStatus.HOST_DEPOSIT_TRANSFERRED &&
            <div>
              <Col span={24} className={styles.highlightSuccess}>Khách thuê đã nhận phòng</Col>
            </div>
          }
          {
            status == TransactionStatus.HOST_REJECTED &&
            <div>
              <Col span={24} className={styles.highlightFail}>Đã từ chối khách thuê này</Col>
            </div>
          }
        </Row>
        }
        {
          !status &&
          <div className={styles.highlightSuccess}>
            Khách thuê muốn liên hệ với bạn
          </div>
        }
      </div>
    );
  }

}

export default DisplayForHost;

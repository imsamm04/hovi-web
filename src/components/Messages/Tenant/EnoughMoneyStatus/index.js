import {Button, Col, Divider, message, Row} from "antd";
import styles from "../../../../pages/transactions/$id/index.less";
import React, {Component} from "react";
import {API} from 'services';
import {TransactionStatus} from '../../../../utils/const';

class EnoughMoneyStatus extends Component {
  constructor(props) {
    super(props);

  }

  moveInConfirm(transactionId, userId, roomId) {
    console.log(transactionId);
    const data = {
      userId: userId,
      roomId: roomId,
      transactionStatus: TransactionStatus.HOST_DEPOSIT_TRANSFERRED
    }
    this.props.handleUpdateStatus({
      isStatusLoading: true
    });
    new API('transactionCheckin').update({id: transactionId, data})
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
    const {transactionStatus, status} = this.props;

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24} className={styles.highlightSuccess}>
            Bạn đã đặt cọc thành công
          </Col>
          <Col span={24}>
            <Button type="primary" className={styles.actionBtn}
                    onClick={() => this.moveInConfirm(transactionStatus.transaction_id
                      , transactionStatus.userId, transactionStatus.roomId)}>Đã nhận phòng</Button>
          </Col>
        </Row>
        <Divider/>
      </div>
    )
      ;
  }

}

export default EnoughMoneyStatus;

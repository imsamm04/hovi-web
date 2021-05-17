import {Button, Col, Row} from "antd";
import styles from "../../../../pages/transactions/$id/index.less";
import React from "react";

class RejectStatus extends React.Component{
  constructor(props) {
    super(props);

  }
  render() {
    return(
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button disabled={true} className={styles.actionBtn}>
              Yêu cầu đặt cọc của bạn đã bị từ chối
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
export default RejectStatus;

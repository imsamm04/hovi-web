import React, {Component} from 'react';
import {Col, Row, Typography} from 'antd';
import styles from './index.less'
import {formatterCurrency} from '../../../utils/index';
import {GENDER_DEFINE, GENDER_DISPLAY} from "../../../utils/const";

const {Title} = Typography;


class BasicInformationKhuTro extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {buildingTypeId, gender} = this.props;

    return (
      <div className={styles.basicInfo}>
        <Title level={this.props.subTitle}>Thông tin phòng</Title>

        <Row gutter={[20, 20]}>
          <Col sm={{span: 12}} md={{span: 8}} lg={{span: 6}}>Loại phòng
            <div className={styles.infoDetail}> {buildingTypeId == 1 ?
              "Chung cư" : (buildingTypeId == 2 ? "Nhà nguyên căn" : "Nhà trọ")}</div>
          </Col>
          <Col sm={{span: 12}} md={{span: 8}} lg={{span: 6}}>Tiền phòng
            <div className={styles.infoDetail}>{formatterCurrency(this.props.roomCost.price)} VNĐ</div>
          </Col>
          <Col sm={{span: 12}} md={{span: 8}} lg={{span: 6}}>Diện tích
            <div className={styles.infoDetail}>{this.props.area} mét vuông</div>
          </Col>
          <Col sm={{span: 12}} md={{span: 8}} lg={{span: 6}}>
            Số người ở
            <div className={styles.infoDetail}>{this.props.capacity}
              {buildingTypeId == 3 && ' ' + GENDER_DISPLAY.find(x => x.code === gender).name}
              {buildingTypeId != 3 && ' người'}
            </div>
          </Col>
          <Col sm={{span: 12}} md={{span: 8}} lg={{span: 6}}>Trạng thái
            <div className={this.props.status== 'Còn phòng' ? styles.highlightAvailable:styles.highlightNotAvailable}>
              {this.props.status}</div>
          </Col>
          <Col sm={{span: 12}} md={{span: 8}}
               lg={{span: 6}}>{this.props.buildingTypeId == 1 ? 'Vị trí tầng' : 'Số tầng'}
            <div className={styles.infoDetail}>{this.props.floorQuantity}</div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BasicInformationKhuTro;

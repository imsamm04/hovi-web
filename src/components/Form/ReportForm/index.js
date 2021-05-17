import React, {Component} from 'react';
import {Modal, Col, Row, Typography, Divider, Tag, Input, Icon} from 'antd';
import {formatterCurrency} from 'utils';

const {Title} = Typography;
export default class extends Component {


  render() {
    const {visible, report, onClose} = this.props;
    return (
      <div>
        <Modal
          // title="Báo cáo vi phạm"
          visible={visible}
          okText='Xác nhận'
          onOk={onClose}
          closable={false}
          cancelButtonProps={{style: {display: 'none'}}}>
          {report.roomInfo && <Row>
            <Row type='flex'>
              <Col span={24}>
                <Title level={4} style={{color: '#f5222d'}}>
                  <Icon type="warning" />&nbsp;Báo cáo vi phạm
                </Title>
              </Col>
              <Col span={24}>
                <Col>
                  <a href={`https://homohouse.vn/room-detail/${report.notificationId}`}
                     target='_blank' rel="noopener noreferrer" style={{fontWeight: 'bold'}}>
                    {report.roomInfo.buildingName}
                  </a>
                </Col>
                <Col>{formatterCurrency(report.roomInfo.rentPrice)} VNĐ</Col>
              </Col>
              <Divider/>
              <Col span={24} style={{marginBottom: '15px'}}>
                <Tag style={{marginBottom: '5px'}}>Nội dung báo cáo:</Tag>
                <Input.TextArea
                  rows={4}
                  contentEditable={false}
                  value={report.reportContent}/>
              </Col>
              <Col span={24}>
                <Tag style={{marginBottom: '5px'}}>Phản hồi của quản trị viên:</Tag>
                <Input.TextArea
                  rows={4}
                  contentEditable={false}
                  value={report.feedbackContent}/>
              </Col>
            </Row>
          </Row>}
        </Modal>
      </div>
    )
  }
}

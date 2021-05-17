import React, {Component} from 'react';
import {Modal, Typography, message, Icon, Row, Col} from 'antd';
import {formatterCurrency} from 'utils';
import styles from './SavedList.less';
import {API} from 'services';
import NotFoundImage from '../../assets/not-found.png';

const {Title, Text, Paragraph} = Typography;
export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModal: false,
    }
  }

  handleToggle = () => this.setState(({isModal}) => ({isModal: !isModal}));
  handleSave = () => {
    const {roomGroupId, isSaved, onChange} = this.props;
    if (isSaved) {
      new API('saved-rooms').delete(roomGroupId)
        .then(data => {
          this.handleToggle();
          if (data.responseStatus === 200) {
            if (onChange) onChange(roomGroupId, true);
            message.success('Đã xóa phòng khỏi danh sách đã lưu của bạn !');
          }
        }).catch(err => {
        console.log(err);
        this.handleToggle();
        message.error('Xóa thất bại, hãy thử lại !');
      });
    } else new API('saved-rooms').create({roomGroupId})
      .then(data => {
        this.handleToggle();
        if (data.responseStatus === 200) {
          if (onChange) onChange(data.roomGroupId);
          message.success('Lưu thành công');
        }
      }).catch(err => {
        console.log(err);
        this.handleToggle();
        message.error('Lưu thất bại, hãy thử lại !');
      });
  };

  render() {
    const {isModal} = this.state;
    const {title, address, rentPrice, images, isSaved} = this.props;
    const imageUrl = images && images.length !== 0 ? images[0] : NotFoundImage;

    return (
      <div>
        <Modal
          centered
          visible={isModal}
          title={isSaved ? 'Xoá khỏi danh sách yêu thích' : 'Lưu vào danh sách yêu thích'}
          okText={isSaved ? 'Xóa' : 'Lưu'}
          cancelText='Thoát'
          okType={isSaved ? 'danger' : 'primary'}
          onOk={this.handleSave}
          onCancel={() => this.handleToggle(false)}>
          <div className={styles.content}>
            <div className={styles.left}>
              <img src={imageUrl} alt='review'/>
            </div>
            <div className={styles.right}>
              <Row type='flex' align="middle">
                <Col span={20}>
                  <Paragraph className={styles.title} ellipsis={{rows: 1}}>
                    <Title level={4} className={styles.title}>
                      {title}
                    </Title>
                  </Paragraph>
                </Col>
                <Col span={4}>
                  {isSaved && <Icon type="delete" className={styles.deleteIcon}/>}
                </Col>
              </Row>
              <Text>{address}</Text><br/>
              <Text strong>{formatterCurrency(rentPrice)} VNĐ</Text>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

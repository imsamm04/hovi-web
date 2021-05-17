import React from 'react';
import styles from './index.less';
import {Avatar, Card, Row, Col, Modal, Typography, Collapse, Icon} from "antd";
import {normalizePhoneNumber} from '../../../utils/index';

const {Panel} = Collapse;
const {Title} = Typography;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      licenseVisible: false,
      typeLicense: 'front'
    }
  }

  handleVisible = (typeLicense) => this.setState({
    typeLicense,
    licenseVisible: true,
  });

  render() {
    const {typeLicense, licenseVisible} = this.state;
    const {isHost, transactionData, host, user, userName, hostName} = this.props;
    const profileUrl = '/users/show/' + (isHost ? transactionData.user_id : transactionData.host_id);
    const idCard = !isHost ? {
      idCardBack: host.idCardBack,
      idCardFront: host.idCardFront
    } : {
      idCardBack: user.idCardBack,
      idCardFront: user.idCardFront
    };

    const getEmail = !isHost ? (host.email === `your_email_${host.id}@example.com` ? '' : host.email) :
      (user.email === `your_email_${user.id}@example.com` ? '' : user.email);

    return (
      <div>
        <Row className={styles.profileInfo}>
          <Card
            bodyStyle={bodyCardStyles}
            title={`Thông tin ${isHost ? 'khách thuê' : 'chủ trọ'}`}>
            <div className={styles.insideCard}>
              <Col span={24} style={{textAlign: 'center', padding: '24px'}}>
                <Avatar shape={"circle"} size={128} src={isHost? user.avatar: host.avatar}/>
                <Col span={24}><Title level={4} className={styles.title}>
                  <a href={profileUrl} target='_blank' rel='noopener noreferrer'>{isHost ? userName : hostName}</a>
                </Title></Col>
                <Col span={24}>{normalizePhoneNumber(isHost ? user.phoneNumber : host.phoneNumber)}</Col>
                <Col span={24}>{getEmail}</Col>
              </Col>
              <Col span={24}>
                <Collapse
                  bordered={false}
                  defaultActiveKey={["1"]}
                  expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}>
                  {[2, -2].includes(transactionData.transaction_status) &&
                  <Panel header="Ảnh chứng minh thư" key="1" className={styles.socialCard}>
                    {idCard.idCardFront &&
                    <img
                      id="myImg" style={{width: '100%', cursor: 'pointer', marginBottom: '10px'}}
                      onClick={() => this.handleVisible('font')}
                      src={idCard.idCardFront}/>}
                    {idCard.idCardBack &&
                    <img
                      id="myImg" style={{width: '100%', cursor: 'pointer'}}
                      onClick={() => this.handleVisible('back')}
                      src={idCard.idCardBack}/>}
                    <Modal
                      visible={licenseVisible}
                      onCancel={() => this.setState({licenseVisible: false})}
                      okButtonProps={{style: {display: 'none'}}}
                      cancelButtonProps={{style: {display: 'none'}}}
                      closable={false}
                      footer={null}>
                      <img
                        style={{width: '100%', height: '100%'}}
                        src={typeLicense === 'font' ? idCard.idCardFront : idCard.idCardBack}/>
                    </Modal>
                  </Panel>}
                </Collapse>
              </Col>
            </div>
          </Card>
        </Row>
      </div>
    );
  }
}

const bodyCardStyles = {
  padding: 0
};

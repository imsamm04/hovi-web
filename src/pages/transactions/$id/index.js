import React, {Component} from 'react';
import {
  Row,
  Typography,
  Col,
  Card,
  Spin,
  Steps,
  Button,
  Collapse,
  Icon,
  message,
  Modal,
  Alert,
  Input
} from 'antd/lib/index';
import {Loader, CarouselForMessage, Chatbox} from 'components';
import styles from './index.less';
import router from "umi/router";
import {API} from 'services';
import FirstTimeStatus from "../../../components/Messages/Tenant/FirstTimeStatus";
import WaitingAcceptStatus from "../../../components/Messages/Tenant/WaitingAcceptStatus";
import RejectStatus from "../../../components/Messages/Tenant/RejectStatus";
import NotEnoughMoneyStatus from "../../../components/Messages/Tenant/NotEnoughMoneyStatus";
import EnoughMoneyStatus from "../../../components/Messages/Tenant/EnoughMoneyStatus";
import HostDepositTransferStatus from "../../../components/Messages/Tenant/HostDepositTransferStatus";
import DisplayForHost from '../../../components/Messages/Host';
import BasicUserInfo from "../../../components/Messages/BasicUserInfo";
import LocalStorage from "../../../utils/LocalStorage";
import {TransactionStatus} from '../../../utils/const';
import {formatterCurrency} from '../../../utils/index';
import classNames from 'classnames';

const {Title, Paragraph} = Typography;
const {Step} = Steps;
const {Panel} = Collapse;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTransactionId: null,
      currentUser: null,
      isLoading: true,
      isStatusLoading: false,
      data: {},
      isHost: false,
      status: 0,
      licenseVisible: false,
      reportModalVisible: false,
      reportContent: ''
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {id} = nextProps.match.params;
    const {currentTransactionId} = this.state;
    if (Number(id) !== currentTransactionId) window.location.reload();
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    const currentTransactionId = Number(id);

    if (isNaN(currentTransactionId)) router.push('/404');
    else new API('transaction').get(currentTransactionId)
      .then(response => {
        if (response.responseStatus === 200) {
          LocalStorage.getCurrentUser().then(currentUser => {
            if (currentUser) this.setState({
              currentTransactionId,
              isLoading: false,
              data: response.data,
              status: response.data.status,
              isHost: Number(currentUser.uid) === response.data.host.id,
              currentUser: {
                uid: currentUser.uid,
                avatar: currentUser.photoURL,
                displayName: String(currentUser.displayName).replace(',', ' ')
              },
            });
          }).then(error => console.log(error))
        } else if (response.status === 401) {
          message.error('B???n kh??ng c?? quy???n truy c???p giao d???ch n??y !');
          router.push('/');
        } else router.push('/404');
      }).catch(error => console.log(error));
  }

  handleUpdateStatus = ({status, isStatusLoading}) => {
    if (status) this.setState({status, isStatusLoading});
    else this.setState({isStatusLoading});
  };

  handleCancelReport = () => this.setState({reportModalVisible: false});
  handleOkReport = () => {
    const {reportContent, data} = this.state;
    const roomGroupId = data.transactionStatus.room_group_id;
    if (reportContent) new API('reportedRoom').create({roomGroupId, reportContent})
      .then(response => {
        if (response.responseStatus === 200) message.success('G???i b??o th??nh c??ng !');
        else message.error('C?? l???i x???y ra ! Xin vui l??ng th??? l???i sau.')
      }).catch(err => {
        console.log(err);
        message.error('C?? l???i x???y ra ! Xin vui l??ng th??? l???i sau.')
      });
    this.setState({reportModalVisible: false, reportContent: ''});
  };

  render() {
    const {data, isLoading, isHost, status, isStatusLoading, currentTransactionId, currentUser, reportModalVisible, reportContent} = this.state;
    if (isLoading) return <Loader fullscreen={true}/>;
    const roomDetailLink = '/room-detail/' + data.transactionStatus.room_group_id;

    const renderSteps = () => {
      let currentStepValue = 0;
      let currentStatusValue = "process";
      let createRequestDescription = "";
      let hostAcceptDescription = "";
      let depositDescription = "";
      let moveInDescription = "";

      if (isHost) {
        switch (this.state.status) {
          case TransactionStatus.DUMMY_STATUS:
            currentStepValue = 0;
            currentStatusValue = "process";
            createRequestDescription = "Kh??ch quan t??m ph??ng";
            break;
          case TransactionStatus.ACCEPT_WAITING:
            currentStepValue = 1;
            currentStatusValue = "process";
            createRequestDescription = "Kh??ch ???? g???i y??u c???u thu?? ph??ng";
            hostAcceptDescription = "X??c nh???n cho thu??";
            break;
          case TransactionStatus.HOST_REJECTED:
            currentStepValue = 1;
            currentStatusValue = "error";
            createRequestDescription = "Kh??ch ???? g???i y??u c???u thu?? ph??ng";
            hostAcceptDescription = "Kh??ng ?????ng ?? cho thu??";
            break;
          case TransactionStatus.NOT_ENOUGH_BALANCE:
            currentStepValue = 2;
            currentStatusValue = "process";
            createRequestDescription = "Kh??ch ???? g???i y??u c???u thu?? ph??ng";
            hostAcceptDescription = "?????ng ?? cho thu??";
            depositDescription = "Ch??? kh??ch thu?? chuy???n kho???n ?????t c???c";
            break;
          case TransactionStatus.ENOUGH_BALANCE:
            currentStepValue = 3;
            currentStatusValue = "process";
            createRequestDescription = "Kh??ch ???? g???i y??u c???u thu?? ph??ng";
            hostAcceptDescription = "?????ng ?? cho thu??";
            depositDescription = "Kh??ch ???? chuy???n kho???n ?????t c???c";
            moveInDescription = "Ch??? kh??ch x??c nh???n nh???n ph??ng";
            break;
          case TransactionStatus.HOST_DEPOSIT_TRANSFERRED:
            currentStepValue = 3;
            currentStatusValue = "finish";
            createRequestDescription = "Kh??ch ???? g???i y??u c???u thu?? ph??ng";
            hostAcceptDescription = "?????ng ?? cho thu??";
            depositDescription = "Kh??ch ???? chuy???n kho???n ?????t c???c";
            moveInDescription = "Kh??ch ???? nh???n ph??ng";
            break;
          default:
            break;
        }
        return (
          <Steps size='small' current={currentStepValue} status={currentStatusValue}>
            <Step title="Y??u c???u ?????t ph??ng" description={createRequestDescription}/>
            <Step title="Ph???n h???i" description={hostAcceptDescription}/>
            <Step title="?????t c???c" description={depositDescription}/>
            <Step title="Nh???n ph??ng" description={moveInDescription}/>
          </Steps>
        )
      } else {
        switch (this.state.status) {
          case TransactionStatus.DUMMY_STATUS:
            currentStepValue = 0;
            currentStatusValue = "process";
            createRequestDescription = "G???i y??u c???u thu?? ph??ng";
            break;
          case TransactionStatus.ACCEPT_WAITING:
            currentStepValue = 1;
            currentStatusValue = "process";
            createRequestDescription = "Y??u c???u ???? ???????c g???i";
            hostAcceptDescription = "Ch??? ch??? nh?? ph???n h???i";
            break;
          case TransactionStatus.HOST_REJECTED:
            currentStepValue = 1;
            currentStatusValue = "error";
            createRequestDescription = "Y??u c???u ???? ???????c g???i";
            hostAcceptDescription = "Ch??? tr??? kh??ng ?????ng ?? cho thu??";
            break;
          case TransactionStatus.NOT_ENOUGH_BALANCE:
            currentStepValue = 2;
            currentStatusValue = "process";
            createRequestDescription = "Y??u c???u ???? ???????c g???i";
            hostAcceptDescription = "Ch??? tr??? ?????ng ?? cho thu??";
            depositDescription = "Chuy???n kho???n ????? thu?? ph??ng";
            break;
          case TransactionStatus.ENOUGH_BALANCE:
            currentStepValue = 3;
            currentStatusValue = "process";
            createRequestDescription = "Y??u c???u ???? ???????c g???i";
            hostAcceptDescription = "Ch??? tr??? ?????ng ?? cho thu??";
            depositDescription = "???? chuy???n kho???n ?????t c???c";
            moveInDescription = "Ch??? x??c nh???n nh???n ph??ng";
            break;
          case TransactionStatus.HOST_DEPOSIT_TRANSFERRED:
            currentStepValue = 3;
            currentStatusValue = "finish";
            createRequestDescription = "Y??u c???u ???? ???????c g???i";
            hostAcceptDescription = "Ch??? tr??? ?????ng ?? cho thu??";
            depositDescription = "???? chuy???n kho???n ?????t c???c";
            moveInDescription = "???? nh???n ph??ng";
            break;
          default:
            break;
        }
        return (
          <Steps size='small' current={currentStepValue} status={currentStatusValue}>
            <Step title="T???o giao d???ch" description={createRequestDescription}/>
            <Step title="Ch??? nh?? ph???n h???i" description={hostAcceptDescription}/>
            <Step title="?????t c???c" description={depositDescription}/>
            <Step title="Nh???n ph??ng" description={moveInDescription}/>
          </Steps>
        )
      }
    };

    const ReportButton = <Button
      type='danger'
      onClick={() => this.setState({reportModalVisible: true})}>
      B??o c??o
    </Button>;

    return (
      <Row className={styles.layout}>
        <Row className={styles.stepContainer}>
          <Col><Title level={4}>Tr???ng th??i giao d???ch</Title></Col>
          <Col>{renderSteps()}</Col>
        </Row>
        <Row gutter={8} className={styles.contentContainer}>
          <Col span={7} className={styles.imageCard}>
            <Card
              title='Th??ng tin ph??ng'
              extra={!isHost && ReportButton}
              bodyStyle={bodyCardStyles}>
              <div className={classNames(styles.bodyCard, {
                [styles.bodyCardHost]: isHost
              })}>
                <Collapse
                  bordered={false}
                  defaultActiveKey={["1", "2"]}
                  expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}>
                  <Panel header="Chi ti???t" key="1">
                    <a href={roomDetailLink} target={'_blank'} style={{color: 'black'}}>
                      <Paragraph ellipsis={{rows: 2, expandable: false}}>
                        <Title level={4} style={{marginBottom: 0}}>{data.title}</Title>
                      </Paragraph>
                    </a>
                    <Row>
                      <Col span={8}>Ti???n thu??: </Col><Col
                      span={16}>{formatterCurrency(data.transactionStatus.rent_price) + ' VN??'}</Col>
                      <Col span={8}>Ti???n c???c: </Col><Col
                      span={16}>{formatterCurrency(data.transactionStatus.deposit_price) + ' VN?? '
                    + '(' + data.minDepositPeriod + ' th??ng )'}</Col>
                      <Col/>
                    </Row>
                  </Panel>
                  <Panel header="X??? l?? giao d???ch" key="2">
                    <Spin spinning={isStatusLoading}>
                      {/*currentId != hostId, Tr?????ng h???p l?? kh??ch thu??*/}
                      {!isHost ?
                        <Row>
                          {/*Tr?????ng h???p l???n ?????u v??o page g???i y??u c???u ?????t ph??ng ho???c ch??a ?????t ph??ng*/}
                          {(!status || status == TransactionStatus.DUMMY_STATUS) &&
                          <FirstTimeStatus
                            buildingTypeId={data.buildingTypeId}
                            availableRooms={data.availableRooms}
                            transactionStatus={data.transactionStatus}
                            handleUpdateStatus={this.handleUpdateStatus}
                          />
                          }
                          {/*Tr?????ng h???p ?????ng ?? cho ?????t c???c nh??ng kh??ng ????? ti???n trong t??i kho???n, status = -2 */}
                          {status == TransactionStatus.NOT_ENOUGH_BALANCE &&
                          <NotEnoughMoneyStatus transactionStatus={data.transactionStatus} status={status}/>
                          }
                          {/*Tr?????ng h???p kh??ng ???????c ?????ng ?? cho ?????t c???c, status = -1 */}
                          {status == TransactionStatus.HOST_REJECTED &&
                          <RejectStatus/>
                          }
                          {/*Tr?????ng h???p ch??? accept, status = 1 */}
                          {status == TransactionStatus.ACCEPT_WAITING &&
                          <WaitingAcceptStatus transactionStatus={data.transactionStatus}/>
                          }
                          {/*Tr?????ng h???p ???? chuy???n ti???n v??o t??i kho???n, status = 2 */}
                          {status == TransactionStatus.ENOUGH_BALANCE &&
                          <EnoughMoneyStatus
                            status={status}
                            transactionStatus={data.transactionStatus}
                            handleUpdateStatus={this.handleUpdateStatus}
                          />
                          }
                          {/*Tr?????ng h???p x??c nh???n ???? chuy???n v??o, status = 3*/}
                          {status == TransactionStatus.HOST_DEPOSIT_TRANSFERRED &&
                          <HostDepositTransferStatus/>
                          }
                        </Row>
                        :
                        <div>
                          <DisplayForHost
                            status={status}
                            handleUpdateStatus={this.handleUpdateStatus}
                            transactionStatus={data.transactionStatus}
                            buildingTypeId={data.buildingTypeId}
                          />
                        </div>
                      }
                    </Spin>
                  </Panel>
                  <Panel header="H??nh ???nh" key="3" style={{userSelect: 'none'}}>
                    <CarouselForMessage images_url={data.images}/>
                  </Panel>
                </Collapse>
              </div>
            </Card>
          </Col>
          <Col span={11} className={styles.messagesContainer}>
            <div className={styles.messages}>
              <Chatbox
                isHost={isHost}
                title={data.buildingName}
                host={data.host}
                user={data.user}
                currentUser={currentUser}
                currentGroupId={currentTransactionId}/>
            </div>
          </Col>
          <Col span={6} className={styles.profile}>
            <BasicUserInfo
              isHost={isHost}
              transactionData={data.transactionStatus}
              host={data.host}
              user={data.user}
              userName={data.userName}
              hostName={data.hostName}
            />
          </Col>
        </Row>
        <Modal
          width='50%'
          title="G???i b??o c??o vi ph???m cho qu???n tr??? vi??n"
          visible={reportModalVisible}
          okText='G???i b??o c??o'
          cancelText='Tho??t'
          onOk={this.handleOkReport}
          onCancel={this.handleCancelReport}>
          <Alert
            showIcon
            type="warning"
            description={
              <div>
                1. Th???i gian x??? l?? c?? th??? m???t 1-2 ng??y l??m vi???c.<br/>
                2. N???i dung b??o c??o sai s??? th???t c?? th??? d???n t???i kh??a t??i kho???n c???a b???n !
              </div>
            }/>
          <Input.TextArea
            rows={5}
            style={{marginTop: 10}}
            value={reportContent}
            onChange={e => this.setState({reportContent: e.target.value})}
            placeholder='N???i dung b??o c??o vi ph???m'/>
        </Modal>
      </Row>
    );
  }
}

const bodyCardStyles = {
  padding: 0
};

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
          message.error('Bạn không có quyền truy cập giao dịch này !');
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
        if (response.responseStatus === 200) message.success('Gửi báo thành công !');
        else message.error('Có lỗi xảy ra ! Xin vui lòng thử lại sau.')
      }).catch(err => {
        console.log(err);
        message.error('Có lỗi xảy ra ! Xin vui lòng thử lại sau.')
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
            createRequestDescription = "Khách quan tâm phòng";
            break;
          case TransactionStatus.ACCEPT_WAITING:
            currentStepValue = 1;
            currentStatusValue = "process";
            createRequestDescription = "Khách đã gửi yêu cầu thuê phòng";
            hostAcceptDescription = "Xác nhận cho thuê";
            break;
          case TransactionStatus.HOST_REJECTED:
            currentStepValue = 1;
            currentStatusValue = "error";
            createRequestDescription = "Khách đã gửi yêu cầu thuê phòng";
            hostAcceptDescription = "Không đồng ý cho thuê";
            break;
          case TransactionStatus.NOT_ENOUGH_BALANCE:
            currentStepValue = 2;
            currentStatusValue = "process";
            createRequestDescription = "Khách đã gửi yêu cầu thuê phòng";
            hostAcceptDescription = "Đồng ý cho thuê";
            depositDescription = "Chờ khách thuê chuyển khoản đặt cọc";
            break;
          case TransactionStatus.ENOUGH_BALANCE:
            currentStepValue = 3;
            currentStatusValue = "process";
            createRequestDescription = "Khách đã gửi yêu cầu thuê phòng";
            hostAcceptDescription = "Đồng ý cho thuê";
            depositDescription = "Khách đã chuyển khoản đặt cọc";
            moveInDescription = "Chờ khách xác nhận nhận phòng";
            break;
          case TransactionStatus.HOST_DEPOSIT_TRANSFERRED:
            currentStepValue = 3;
            currentStatusValue = "finish";
            createRequestDescription = "Khách đã gửi yêu cầu thuê phòng";
            hostAcceptDescription = "Đồng ý cho thuê";
            depositDescription = "Khách đã chuyển khoản đặt cọc";
            moveInDescription = "Khách đã nhận phòng";
            break;
          default:
            break;
        }
        return (
          <Steps size='small' current={currentStepValue} status={currentStatusValue}>
            <Step title="Yêu cầu đặt phòng" description={createRequestDescription}/>
            <Step title="Phản hồi" description={hostAcceptDescription}/>
            <Step title="Đặt cọc" description={depositDescription}/>
            <Step title="Nhận phòng" description={moveInDescription}/>
          </Steps>
        )
      } else {
        switch (this.state.status) {
          case TransactionStatus.DUMMY_STATUS:
            currentStepValue = 0;
            currentStatusValue = "process";
            createRequestDescription = "Gửi yêu cầu thuê phòng";
            break;
          case TransactionStatus.ACCEPT_WAITING:
            currentStepValue = 1;
            currentStatusValue = "process";
            createRequestDescription = "Yêu cầu đã được gửi";
            hostAcceptDescription = "Chờ chủ nhà phản hồi";
            break;
          case TransactionStatus.HOST_REJECTED:
            currentStepValue = 1;
            currentStatusValue = "error";
            createRequestDescription = "Yêu cầu đã được gửi";
            hostAcceptDescription = "Chủ trọ không đồng ý cho thuê";
            break;
          case TransactionStatus.NOT_ENOUGH_BALANCE:
            currentStepValue = 2;
            currentStatusValue = "process";
            createRequestDescription = "Yêu cầu đã được gửi";
            hostAcceptDescription = "Chủ trọ đồng ý cho thuê";
            depositDescription = "Chuyển khoản để thuê phòng";
            break;
          case TransactionStatus.ENOUGH_BALANCE:
            currentStepValue = 3;
            currentStatusValue = "process";
            createRequestDescription = "Yêu cầu đã được gửi";
            hostAcceptDescription = "Chủ trọ đồng ý cho thuê";
            depositDescription = "Đã chuyển khoản đặt cọc";
            moveInDescription = "Chờ xác nhận nhận phòng";
            break;
          case TransactionStatus.HOST_DEPOSIT_TRANSFERRED:
            currentStepValue = 3;
            currentStatusValue = "finish";
            createRequestDescription = "Yêu cầu đã được gửi";
            hostAcceptDescription = "Chủ trọ đồng ý cho thuê";
            depositDescription = "Đã chuyển khoản đặt cọc";
            moveInDescription = "Đã nhận phòng";
            break;
          default:
            break;
        }
        return (
          <Steps size='small' current={currentStepValue} status={currentStatusValue}>
            <Step title="Tạo giao dịch" description={createRequestDescription}/>
            <Step title="Chủ nhà phản hồi" description={hostAcceptDescription}/>
            <Step title="Đặt cọc" description={depositDescription}/>
            <Step title="Nhận phòng" description={moveInDescription}/>
          </Steps>
        )
      }
    };

    const ReportButton = <Button
      type='danger'
      onClick={() => this.setState({reportModalVisible: true})}>
      Báo cáo
    </Button>;

    return (
      <Row className={styles.layout}>
        <Row className={styles.stepContainer}>
          <Col><Title level={4}>Trạng thái giao dịch</Title></Col>
          <Col>{renderSteps()}</Col>
        </Row>
        <Row gutter={8} className={styles.contentContainer}>
          <Col span={7} className={styles.imageCard}>
            <Card
              title='Thông tin phòng'
              extra={!isHost && ReportButton}
              bodyStyle={bodyCardStyles}>
              <div className={classNames(styles.bodyCard, {
                [styles.bodyCardHost]: isHost
              })}>
                <Collapse
                  bordered={false}
                  defaultActiveKey={["1", "2"]}
                  expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}>
                  <Panel header="Chi tiết" key="1">
                    <a href={roomDetailLink} target={'_blank'} style={{color: 'black'}}>
                      <Paragraph ellipsis={{rows: 2, expandable: false}}>
                        <Title level={4} style={{marginBottom: 0}}>{data.title}</Title>
                      </Paragraph>
                    </a>
                    <Row>
                      <Col span={8}>Tiền thuê: </Col><Col
                      span={16}>{formatterCurrency(data.transactionStatus.rent_price) + ' VNĐ'}</Col>
                      <Col span={8}>Tiền cọc: </Col><Col
                      span={16}>{formatterCurrency(data.transactionStatus.deposit_price) + ' VNĐ '
                    + '(' + data.minDepositPeriod + ' tháng )'}</Col>
                      <Col/>
                    </Row>
                  </Panel>
                  <Panel header="Xử lý giao dịch" key="2">
                    <Spin spinning={isStatusLoading}>
                      {/*currentId != hostId, Trường hợp là khách thuê*/}
                      {!isHost ?
                        <Row>
                          {/*Trường hợp lần đầu vào page gửi yêu cầu đặt phòng hoặc chưa đặt phòng*/}
                          {(!status || status == TransactionStatus.DUMMY_STATUS) &&
                          <FirstTimeStatus
                            buildingTypeId={data.buildingTypeId}
                            availableRooms={data.availableRooms}
                            transactionStatus={data.transactionStatus}
                            handleUpdateStatus={this.handleUpdateStatus}
                          />
                          }
                          {/*Trường hợp đồng ý cho đặt cọc nhưng không đủ tiền trong tài khoản, status = -2 */}
                          {status == TransactionStatus.NOT_ENOUGH_BALANCE &&
                          <NotEnoughMoneyStatus transactionStatus={data.transactionStatus} status={status}/>
                          }
                          {/*Trường hợp không được đồng ý cho đặt cọc, status = -1 */}
                          {status == TransactionStatus.HOST_REJECTED &&
                          <RejectStatus/>
                          }
                          {/*Trường hợp chờ accept, status = 1 */}
                          {status == TransactionStatus.ACCEPT_WAITING &&
                          <WaitingAcceptStatus transactionStatus={data.transactionStatus}/>
                          }
                          {/*Trường hợp đã chuyển tiền vào tài khoản, status = 2 */}
                          {status == TransactionStatus.ENOUGH_BALANCE &&
                          <EnoughMoneyStatus
                            status={status}
                            transactionStatus={data.transactionStatus}
                            handleUpdateStatus={this.handleUpdateStatus}
                          />
                          }
                          {/*Trường hợp xác nhận đã chuyển vào, status = 3*/}
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
                  <Panel header="Hình ảnh" key="3" style={{userSelect: 'none'}}>
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
          title="Gửi báo cáo vi phạm cho quản trị viên"
          visible={reportModalVisible}
          okText='Gửi báo cáo'
          cancelText='Thoát'
          onOk={this.handleOkReport}
          onCancel={this.handleCancelReport}>
          <Alert
            showIcon
            type="warning"
            description={
              <div>
                1. Thời gian xử lý có thể mất 1-2 ngày làm việc.<br/>
                2. Nội dung báo cáo sai sự thật có thể dẫn tới khóa tài khoản của bạn !
              </div>
            }/>
          <Input.TextArea
            rows={5}
            style={{marginTop: 10}}
            value={reportContent}
            onChange={e => this.setState({reportContent: e.target.value})}
            placeholder='Nội dung báo cáo vi phạm'/>
        </Modal>
      </Row>
    );
  }
}

const bodyCardStyles = {
  padding: 0
};

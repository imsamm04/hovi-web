import {Button, Col, Alert, Modal, Row, Select, Divider, Typography,Tag} from "antd";
import styles from "../../../../pages/transactions/$id/index.less";
import React, {Component} from "react";
import {TransactionStatus} from '../../../../utils/const';
import {API} from 'services'
import {formatterCurrency} from '../../../../utils/index';
import axios from 'axios';

const {Option} = Select;
const {Paragraph} = Typography;

class NotEnoughMoneyStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      bankInfo: '',
      deposit: '',
      content: '',
      bankList: [],
    }
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const transactionId = this.props.transactionStatus.transaction_id;
    new API('transactionGen').get(transactionId)
      .then(response => {
        this.setState({
          bankList: response,
          bankInfo: response[0]
        })
      }).catch(error => {
      console.log(error);
    })
  }

  showModal(transactionId) {

    new API('transactionGen').get(transactionId)
      .then(response => {
       console.log(response);
       this.setState({
         bankList: response,
         visible: true
       })
      }).catch(error => {
      console.log(error);
    })
  }

  handleOk = e => {
    this.setState({
      visible: false,
    });

  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onChange(value) {
    const bankList = this.state.bankList;
    const bankInfo = bankList.find(obj => obj.bank == value);
    this.setState({bankInfo: bankInfo});
  }


  render() {
    const {transactionStatus, status} = this.props;
    const {bankInfo, deposit, content, bankList} = this.state;
    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={24} className={styles.highlightSuccess}>
            Chủ nhà đã đồng ý cho thuê phòng
          </Col>
          <Col span={24}>
            <Button className={styles.actionBtn} onClick={() => this.showModal(transactionStatus.transaction_id)}>
             Hướng dẫn đặt cọc
            </Button>
          </Col>
          <Modal
            cancelButtonProps={{style: {display: 'none'}}}
            okButtonProps={{style: {width: 60}}}
            title="Thông tin chuyển khoản"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Alert
                  message="Bạn hãy chuyển khoản đặt cọc với các thông tin dưới đây để tiếp tục giao dịch"
                  type="info"
                  showIcon/>
              </Col>
              <Col span={12} style={{margin: '10px 0', paddingTop: '5px'}}>Chọn ngân hàng</Col>
              <Col span={12} style={{margin: '10px 0'}}>
                <Select
                  showSearch
                  style={{width: '100%'}}
                  placeholder="Chọn ngân hàng"
                  optionFilterProp="children"
                  dropdownStyle={{ zIndex: 2000 }}
                  onChange={this.onChange}
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  defaultValue={this.state.bankInfo.bank}
                >
                  {
                    bankList.map(item =>
                      <Option value={item.bank} key={item.bank}>{item.bank}</Option>
                    )
                  }
                </Select>
              </Col>
              <Divider/>
              <Col span={9}>Ngân hàng: </Col> <Col span={15}><Paragraph copyable>{bankInfo.bank}</Paragraph></Col>
              <Col span={9}>Số tài khoản: </Col><Col span={15}><Paragraph copyable>{bankInfo.accountNumber}</Paragraph></Col>
              <Col span={9}>Tên chủ tài khoản: </Col><Col span={15}><Paragraph
              copyable>{bankInfo.holderName}</Paragraph></Col>
              <Col span={9}>Số tiền đặt cọc: </Col><Col span={15}><Paragraph
              copyable>{formatterCurrency(bankInfo.moneyAmount)} VNĐ</Paragraph></Col>
              <Col span={9}>Nội dung chuyển khoản: </Col><Col span={15}><Paragraph copyable>{bankInfo.content}</Paragraph></Col>
            </Row>
          </Modal>
        </Row>
      </div>
    );
  }
}

export default NotEnoughMoneyStatus;

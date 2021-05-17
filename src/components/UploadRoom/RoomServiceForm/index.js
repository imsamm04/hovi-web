import React, {Component} from 'react';
import {Checkbox, Col, Collapse, Input, Row, Typography} from 'antd';
import {InputNumber} from 'antd/lib/index';
import {formatterCurrency, parserCurrency, CONST} from 'utils';
import styles from './index.less';

const {Title, Text} = Typography;
const {Panel} = Collapse;

export default class extends Component {
  constructor(props) {
    super(props);
    props.buildingServices.forEach(data => {
      this[`ref${data.id}`] = React.createRef();
    });
  }

  setValue = (index, changedValue) => {
    const {fields, handleFormChange} = this.props;
    handleFormChange({
      data: {
        ...fields.data,
        [index]: {
          ...fields.data[index],
          ...changedValue,
        },
      },
    }, 'buildingServicesFields');
  };

  handleChange = (data) => {
    const {fields, handleFormChange} = this.props;
    const changedField = data.find(serviceId => !fields.activeServices.includes(serviceId));
    setTimeout(() => {
      if (this[`ref${changedField}`] && this[`ref${changedField}`].current)
        this[`ref${changedField}`].current.focus();
    }, 10);

    handleFormChange({activeServices: data}, 'buildingServicesFields')
  };

  render() {
    const {fields, buildingServices} = this.props;
    const value = fields.data;

    return (
      <Row>
        <Col><Title level={4}>Nhập thông tin về dịch vụ.</Title></Col>
        <Col className={styles.description}><Text>Tích chọn và nhập thông tin dịch vụ mà bạn cung cấp.</Text></Col>
        <Row>
          <Collapse
            bordered={false}
            defaultActiveKey={fields.activeServices}
            onChange={this.handleChange}
            expandIcon={({isActive}) => <Checkbox checked={isActive}/>}>
            {buildingServices.map(data => {
              const index = data.id;
              return (
                <Panel
                  key={index}
                  className={styles.panelStyle}
                  header={`Dịch vụ ${data.name.toLowerCase()}`}>
                  <Row type="flex" justify="center" align="middle">
                    <Col span={5} className={styles.title}>Giá dịch vụ:</Col>
                    <Col span={8}>
                      <InputNumber
                        ref={this[`ref${data.id}`]}
                        value={value[index] ? value[index].servicePrice : ''}
                        step={1000}
                        min={CONST.MIN_SERVICE_PRICE}
                        max={CONST.MAX_SERVICE_PRICE}
                        className={styles.inputNumber}
                        onChange={servicePrice => this.setValue(index, {servicePrice, serviceId: data.id})}
                        formatter={servicePrice => formatterCurrency(servicePrice)}
                        parser={servicePrice => parserCurrency(servicePrice)}
                      />
                    </Col>
                    <Col span={11}/>
                  </Row>
                  <Row className={styles.marginItem}>
                    <Col span={5} className={styles.title}>Ghi chú:</Col>
                    <Col span={19}>
                      <Input.TextArea
                        rows={4}
                        maxLength={300}
                        value={value[index] ? value[index].note : ''}
                        onChange={e => this.setValue(index, {note: e.target.value, serviceId: data.id})}/>
                    </Col>
                  </Row>
                </Panel>
              );
            })}
          </Collapse>
        </Row>
      </Row>
    );
  }
}

import React, {Component} from 'react';
import {Checkbox, Col, Collapse, Input, message, Row, Typography} from 'antd';
import {InputNumber} from 'antd/lib/index';
import {formatterCurrency, parserCurrency, CONST} from 'utils';
import {API} from 'services';
import styles from './index.less';

const {Text} = Typography;
const {Panel} = Collapse;

export default class extends Component {
  constructor(props) {
    super(props);
    props.buildingServices.forEach(data => {
      this[`ref${data.id}`] = React.createRef();
    });

    this.state = {
      buildingServices: props.buildingServices,
      fields: this.formatData(props.fields)
    }
  }

  formatData = (fields) => {
    let data = {};
    const activeServices = fields.map(data => data.serviceId);
    fields.forEach(value => {
      data[value.serviceId] = value
    });

    return {data, activeServices};
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      buildingServices: nextProps.buildingServices,
      fields: this.formatData(nextProps.fields)
    })
  }

  setValue = (index, changedValue) => this.setState({
    fields: {
      ...this.state.fields,
      data: {
        ...this.state.fields.data,
        [index]: {
          ...this.state.fields.data[index],
          ...changedValue,
        },
      }
    }
  });

  handleChange = (data) => {
    const changedField = data.find(serviceId => !this.state.fields.activeServices.includes(serviceId));
    setTimeout(() => {
      if (this[`ref${changedField}`] && this[`ref${changedField}`].current)
        this[`ref${changedField}`].current.focus();
    }, 10);

    this.setState({
      fields: {
        ...this.state.fields,
        activeServices: data
      }
    });
  };

  handleSubmit = () => {
    const {fields} = this.state;
    const {buildingId} = this.props;
    // start to create building services
    const formatData = Object.values(fields.data).map(value => {
      const {activeServices} = fields;
      const isNotNull = !!value.servicePrice || !!value.note;
      const isIncludes = activeServices.includes(String(value.serviceId)) || activeServices.includes(value.serviceId);
      if (isIncludes && isNotNull) return value;
      else return {...value, isDelete: true};
    });

    console.log(formatData);

    if (formatData.length) {
      new API('buildingService').createMultiple({
        buildingId,
        data: formatData,
      }).then(() => {
        this.props.onClose();
        message.success('Cập nhật thành công');
      }).catch(err => {
        console.log(err.response);
      })
    } else this.props.onClose();
  };

  render() {
    const {buildingServices, fields} = this.state;

    return (
      <Row>
        <Col className={styles.description}><Text>Tích chọn và nhập thông tin dịch vụ mà bạn cung cấp.</Text></Col>
        <Row>
          <Collapse
            bordered={false}
            activeKey={fields.activeServices}
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
                        value={fields.data[index] ? fields.data[index].servicePrice : ''}
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
                        value={fields.data[index] ? fields.data[index].note : ''}
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

import React, {Component} from 'react';
import {Button, Col, Form, Icon, InputNumber, Row, Typography} from 'antd';
import {CONST, formatterCurrency, parserCurrency} from 'utils';
import styles from './index.less';

const {Title, Text} = Typography;

class DynamicFieldSet extends Component {
  componentDidMount() {
    this.props.form.setFieldsValue({
      keys: this.props.countId.countArr,
    });
  }

  remove = k => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    const nextKeys = keys.filter(key => key !== k);
    // can use data-binding to set
    form.setFieldsValue({
      keys: nextKeys,
    }, () => {
      this.props.handleFormChange({countArr: nextKeys}, 'countId');
      this.props.handleFormChangeV2(
        `roomGroupFieldsV2[${k}]`,
        {remove: true},
        'roomGroupFieldsV2',
      );
    });
  };

  add = () => {
    const {form, countId} = this.props;
    // can use data-binding to get
    const nextId = countId.currentCountId;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(nextId);
    this.props.handleFormChangeV2(
      `roomGroupFieldsV2[${nextId}]`,
      {
        id: {value: nextId},
        gender: {value: 2},
        area: {value: 100},
        capacity: {value: 2},
        rentPrice: {value: '1500000'},
        depositPrice: {value: '1500000'},
        minDepositPeriod: {value: 1},
        direction: {value: 'all'},
        bedroomQuantity: {value: 1},
        bathroomQuantity: {value: 1},
        roomNames: {value: []},
        description: {value: ''},
      },
      'roomGroupFieldsV2',
    );
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({keys: nextKeys},
      () => this.props.handleFormChange({
        countArr: nextKeys,
        currentCountId: nextId + 1,
      }, 'countId'));
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {keys, names} = values;
        console.log('Received values of form: ', values);
        console.log('Merged values:', keys.map(key => names[key]));
      }
    });
  };

  render() {
    const {roomGroupFieldsV2, countId} = this.props;
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: {span: 24, offset: 0},
        sm: {span: 20, offset: 4},
      },
    };

    getFieldDecorator('keys', {initialValue: countId.countArr});
    const keys = getFieldValue('keys');
    const formItems = keys.map(k => (
      <Form.Item
        key={k}
        label='Lo???i'
        colon={false}
        required={false}
        {...formItemLayout}>
        {getFieldDecorator(`roomGroupFieldsV2[${k}]rentPrice`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              message: ' '
            },
            {
              validator(rule, value, callback) {
                if (!value || !value.toString().trim()) callback('Th??ng tin n??y b???t bu???c.');
                else if (!/^\d+$/.test(value)) callback('S??? ti???n kh??ng h???p l???.');
                else if (value < CONST.MIN_PRICE) callback(`Ti???n thu?? nh?? kh??ng ???????c nh??? h??n ${formatterCurrency(CONST.MIN_PRICE)} VN??.`);
                else if (value > CONST.MAX_PRICE) callback(`Ti???n thu?? nh?? kh??ng ???????c l???n h??n ${formatterCurrency(CONST.MAX_PRICE)} VN??.`);
                else callback();
              }
            },
          ],
          normalize: value => value.toString().replace(/,/g, ''),
        })
        (<div>
          <InputNumber
            size='large'
            className={styles.inputPrice}
            placeholder='Gi?? lo???i ph??ng tr???'
            step={CONST.STEP}
            min={CONST.MIN_PRICE}
            max={CONST.MAX_PRICE}
            value={roomGroupFieldsV2[`roomGroupFieldsV2[${k}]`].rentPrice.value}
            formatter={price => formatterCurrency(price)}
            parser={price => parserCurrency(price)}/>
          <div className={styles.subInput}>VN??/Th??ng</div>
          {keys.length > 1 ? <Icon type="minus-circle-o" onClick={() => this.remove(k)}/> : null}
        </div>)}
      </Form.Item>
    ));
    return (
      <Row className={styles.masterContainer}>
        <Col>
          <Title level={4}>T???o c??c lo???i ph??ng tr???</Title>
        </Col>
        <Col className={styles.description}>
          <Text>Ph??n lo???i ph??ng tr??? c???a b???n theo gi?? ti???n cho thu?? v???i c??c ti???n nghi kh??c nhau.</Text>
        </Col>
        <Col>
          <Form onSubmit={this.handleSubmit}>
            {formItems}
            <Form.Item {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                <Icon type="plus"/> Th??m lo???i ph??ng
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Form.create({
  name: 'dynamic_form_item',
  onFieldsChange(props, changedFields) {
    const changed = changedFields['roomGroupFieldsV2'];
    if (!changed) return;
    props.handleFormChangeV2(
      `roomGroupFieldsV2[${changed.length - 1}]`,
      changed[changed.length - 1],
      'roomGroupFieldsV2');
  },
  mapPropsToFields(props) {
    let output = {};
    props.countId.countArr.forEach(id => {
      const roomGroupObj = props.roomGroupFieldsV2[`roomGroupFieldsV2[${id}]`];
      const nameField = `roomGroupFieldsV2[${id}]rentPrice`;
      output[nameField] = Form.createFormField({...roomGroupObj.rentPrice});
    });
    return output;
  },
})(DynamicFieldSet);

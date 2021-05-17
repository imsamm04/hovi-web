import React, {Component} from 'react';
import {Form, Input, InputNumber, message, Radio, Select, Typography} from 'antd';
import {CONST, formatterCurrency, parserCurrency} from 'utils';
import {API} from 'services';
import styles from './index.less';

const {Option} = Select;
const {Title} = Typography;

const CustomizedForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.handleFormChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      gender: Form.createFormField({...props.gender, value: props.gender.value}),
      area: Form.createFormField({...props.area, value: props.area.value}),
      capacity: Form.createFormField({...props.capacity, value: props.capacity.value}),
      rentPrice: Form.createFormField({...props.rentPrice, value: props.rentPrice.value}),
      depositPrice: Form.createFormField({...props.depositPrice, value: props.depositPrice.value}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (err) message.error('Lỗi dữ liệu nhập vào !');
      else props.onSubmit(values);
    });
  };

  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item label='Diện tích mỗi phòng trong nhóm phòng trọ này là bao nhiêu? (Đơn vị m²)'
                 colon={false} className={styles.customItemForm}>
        {getFieldDecorator('area', {
          rules: [{required: true, message: 'Vui lòng nhập diện tích phòng trọ!'}],
        })
        (<Input size='large'/>)}
      </Form.Item>
      <Form.Item label='Sức chứa tối đa mỗi phòng là bao nhiêu?'
                 colon={false} className={styles.customItemForm}>
        {getFieldDecorator('capacity', {
          rules: [{required: true, message: 'Vui lòng nhập sức chứa phòng trọ!'}],
        })
        (<InputNumber
          type='number'
          size='large'
          min={1}
          max={20}
        />)}
      </Form.Item>
      <Form.Item label='Giá thuê mỗi phòng là bao nhiêu nhỉ?'
                 colon={false} className={styles.customItemForm}>
        {getFieldDecorator('rentPrice', {
          rules: [{required: true, message: 'Vui lòng nhập giá thuê phòng trọ!'}],
        })
        (<InputNumber
          size='large'
          className={styles.inputPrice}
          step={CONST.STEP}
          min={CONST.MIN_PRICE}
          max={CONST.MAX_PRICE}
          formatter={price => formatterCurrency(price)}
          parser={price => parserCurrency(price)}
        />)}
      </Form.Item>
      <Form.Item label='Giá đặt cọc là bao nhiêu nhỉ?'
                 colon={false} className={styles.customItemForm}>
        {getFieldDecorator('depositPrice', {
          rules: [{required: true, message: 'Vui lòng nhập giá đặt cọc phòng trọ!'}],
        })
        (<InputNumber
          size='large'
          className={styles.inputPrice}
          step={CONST.STEP}
          min={CONST.MIN_PRICE}
          max={CONST.MAX_PRICE}
          formatter={price => formatterCurrency(price)}
          parser={price => parserCurrency(price)}
        />)}
      </Form.Item>
      <Form.Item label="Các phòng trọ này của bạn cho?" colon={false}>
        {getFieldDecorator('gender')
        (<Radio.Group>
          <Radio style={radioStyle} value={true}>
            Nam
          </Radio>
          <Radio style={radioStyle} value={false}>
            Nữ
          </Radio>
        </Radio.Group>)}
      </Form.Item>
    </Form>
  );
});

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildingTypes: [],
      fields: {
        gender: {value: ''},
        area: {value: ''},
        capacity: {value: 1},
        rentPrice: {value: ''},
        depositPrice: {value: ''},
      },
    };
  }

  componentDidMount() {
    new API('api/building-type').getAll()
      .then(buildingTypes => this.setState({buildingTypes}))
      .catch(err => console.log(err));
  }

  handleFormChange = changedFields => {
    console.log(changedFields);
    this.setState(({fields}) => ({
      fields: {...fields, ...changedFields},
    }));
  };

  render() {
    const {buildingTypes, fields} = this.state;
    return (
      <div>
        <Title level={4}>Tạo nhóm phòng trọ?</Title>
        <CustomizedForm
          handleFormChange={this.handleFormChange}
          buildingTypes={buildingTypes} {...fields}/>
      </div>
    );
  }
}

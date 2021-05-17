import React from 'react';
import {Form, Icon, Input, InputNumber, Select, Tooltip, Typography} from 'antd';
import {removeUnicode, CONST} from 'utils';

const {Option} = Select;
const {Title} = Typography;

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.handleFormChange(changedFields, 'buildingFields');
  },
  mapPropsToFields(props) {
    return {
      typeId: Form.createFormField({...props.typeId, value: props.typeId.value}),
      buildingName: Form.createFormField({...props.buildingName, value: props.buildingName.value}),
      floorQuantity: Form.createFormField({...props.floorQuantity, value: props.floorQuantity.value}),
      province: Form.createFormField({...props.province, value: props.province.value}),
      district: Form.createFormField({...props.district, value: props.district.value}),
      ward: Form.createFormField({...props.ward, value: props.ward.value}),
      detailedAddress: Form.createFormField({...props.detailedAddress, value: props.detailedAddress.value}),
      addressDescription: Form.createFormField({...props.addressDescription, value: props.addressDescription.value}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;
  const buildingName = props.typeId.value === 3 ? 'Tên nhà trọ' : 'Tiêu đề';
  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 7},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 17},
    },
  };

  return (
    <div>
      <Title level={4}>Bạn muốn thêm loại phòng cho thuê gì?</Title>
      <Form {...formItemLayout}>
        <Form.Item label="Loại phòng">
          {getFieldDecorator('typeId', {
            valuePropName: 'defaultValue',
            rules: [{required: true, message: 'Thông tin này bắt buộc.'}],
          })(
            <Select size='large' value={props.typeId.value}>
              {props.buildingTypes.map(buildingType =>
                <Option key={buildingType.id} value={buildingType.id}>{buildingType.type}</Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={buildingName}>
          {getFieldDecorator('buildingName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: 'Thông tin này bắt buộc.',
              },
              {
                max: 200,
                message: 'Không nhập quá 200 kí tự.'
              },
            ],
          })(<Input size='large'/>)}
        </Form.Item>
        <Form.Item label={props.typeId.value === 1 ? 'Tầng thứ' : 'Số tầng'}>
          {getFieldDecorator('floorQuantity', {
            initialValue: props.floorQuantity.value,
            type: 'number',
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số tầng không hợp lệ.');
                  else if (value < CONST.MIN_QUANTITY_FLOOR) callback(`Số tầng không được nhỏ hơn ${CONST.MIN_QUANTITY_FLOOR}.`);
                  else if (value > CONST.MAX_QUANTITY_FLOOR) callback(`Số tầng không được lớn hơn ${CONST.MAX_QUANTITY_FLOOR}.`);
                  else callback();
                }
              },
            ]
          })(<InputNumber type='number' size='large' min={CONST.MIN_QUANTITY_FLOOR} max={CONST.MAX_QUANTITY_FLOOR}/>)}
        </Form.Item>
        <Form.Item label="Tỉnh / Thành phố">
          {getFieldDecorator('province', {
            initialValue: [props.province.value],
            valuePropName: 'defaultValue',
            rules: [{required: true, message: 'Thông tin này bắt buộc.'}],
          })(
            <Select
              size='large'
              showSearch
              optionFilterProp="children"
              value={[props.province.value]}
              filterOption={(inputValue, option) => {
                const formatValue = removeUnicode(option.props.children.toLowerCase());
                const compareValue = removeUnicode(inputValue.toLowerCase());
                return formatValue.indexOf(compareValue) !== -1;
              }}>
              {props.provinces && props.provinces.map(province =>
                <Option key={province.id} value={[province.name, province.id]}>
                  {province.name}
                </Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Quận / Huyện">
          {getFieldDecorator('district', {
            initialValue: [props.district.value],
            valuePropName: 'defaultValue',
            rules: [{required: true, message: 'Thông tin này bắt buộc.'}],
          })(
            <Select
              size='large'
              showSearch
              value={[props.district.value]}
              disabled={!props.province.value}
              optionFilterProp="children"
              filterOption={(inputValue, option) => {
                const formatValue = removeUnicode(option.props.children.toLowerCase());
                const compareValue = removeUnicode(inputValue.toLowerCase());
                return formatValue.indexOf(compareValue) !== -1;
              }}>
              {props.districts && props.districts.map(district =>
                <Option key={district.id} value={[district.name, district.id]}>
                  {district.name}
                </Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Phường / Xã">
          {getFieldDecorator('ward', {
            initialValue: [props.ward.value],
            valuePropName: 'defaultValue',
            rules: [{required: true, message: 'Thông tin này bắt buộc.'}],
          })(
            <Select
              size='large'
              showSearch
              value={[props.ward.value]}
              disabled={!props.district.value}
              optionFilterProp="children"
              filterOption={(inputValue, option) => {
                const formatValue = removeUnicode(option.props.children.toLowerCase());
                const compareValue = removeUnicode(inputValue.toLowerCase());
                return formatValue.indexOf(compareValue) !== -1;
              }}>
              {props.wards && props.wards.map(ward =>
                <Option key={ward.id} value={[ward.name, ward.id]}>
                  {ward.name}
                </Option>)}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={<Tooltip placement="topLeft" title="Sử dụng Google Map để dò tìm địa chỉ của bạn">
          <Icon type="question-circle"/>&nbsp;Dò tìm địa chỉ
        </Tooltip>}>
          {getFieldDecorator('detailedAddress', {
            rules: [
              {
                required: true, whitespace: true, message: 'Thông tin này bắt buộc.'
              },
              {
                max: 50,
                message: 'Không nhập quá 50 kí tự.'
              },
            ],
          })(<Input placeholder='số nhà, ngách, ngõ, đường,...' size='large'/>)}
        </Form.Item>
        <Form.Item label="Dẫn đường">
          {getFieldDecorator('addressDescription', {
            rules: [
              {
                max: 255,
                message: 'Không nhập quá 255 kí tự.'
              },
            ]
          })(<Input.TextArea rows={4} size='large'/>)}
        </Form.Item>
      </Form>
    </div>
  );
});

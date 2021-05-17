import React, {Component} from 'react';
import {Card, Form, Icon, InputNumber, notification, Radio, Select, Tag} from 'antd';
import {CONST, formatterCurrency, getDuplicate, isObject} from 'utils';
import styles from './index.less';
import {Editor} from "react-draft-wysiwyg";

class DynamicFieldSet extends Component {
  render() {
    const {roomGroupFieldsV2, countId} = this.props;
    const {getFieldDecorator} = this.props.form;
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
      <div className={styles.masterContainer}>
        <Form {...formItemLayout}>
          {countId.countArr.map(key => {
            const keyName = `roomGroupFieldsV2[${key}]`;
            const value = roomGroupFieldsV2[keyName];
            return (
              <Card key={key} size='small' style={{marginBottom: '10px'}} bordered={false}
                    title={`Loại ${formatterCurrency(value.rentPrice.value)} VNĐ`}>
                <Form.Item label='Diện tích'>
                  {getFieldDecorator(`${keyName}area`, {
                    initialValue: value.area.value,
                    rules: [
                      {
                        required: true,
                        message: ' '
                      },
                      {
                        validator(rule, value, callback) {
                          if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                          else if (value < CONST.MIN_AREA) callback(`Diện tích không được nhỏ hơn ${CONST.MIN_AREA}m².`);
                          else if (value > CONST.MAX_AREA) callback(`Diện tích không được lớn hơn ${CONST.MAX_AREA}m².`);
                          else callback();
                        }
                      },
                    ],
                  })(<div>
                    <InputNumber
                      type='number'
                      size='large'
                      min={CONST.MIN_AREA}
                      max={CONST.MAX_AREA}
                      value={value.area.value}/>
                    <div className={styles.subInput}>m²</div>
                  </div>)}
                </Form.Item>
                <Form.Item label='Số người ở'>
                  {getFieldDecorator(`${keyName}capacity`, {
                    initialValue: value.capacity.value,
                    rules: [
                      {
                        required: true,
                        message: ' '
                      },
                      {
                        validator(rule, value, callback) {
                          if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                          else if (!/^\d+$/.test(value)) callback('Số lượng không hợp lệ.');
                          else if (value < CONST.MIN_CAPACITY) callback(`Số người ở không được nhỏ hơn ${CONST.MIN_CAPACITY}.`);
                          else if (value > CONST.MAX_CAPACITY) callback(`Số người ở không được lớn hơn ${CONST.MAX_CAPACITY}.`);
                          else callback();
                        }
                      },
                    ],
                  })(<div>
                    <InputNumber
                      type='number'
                      size='large'
                      min={CONST.MIN_CAPACITY}
                      max={CONST.MAX_CAPACITY}
                      value={value.capacity.value}/>
                    <div className={styles.subInput}>người</div>
                  </div>)}
                </Form.Item>
                <Form.Item label='Giới tính'>
                  {getFieldDecorator(`${keyName}gender`, {
                    initialValue: value.gender.value,
                    rules: [
                      {
                        required: true,
                        message: 'Thông tin này bắt buộc.'
                      }
                    ],
                  })(<Radio.Group size='large'>
                    <Radio value={2}>Tất cả</Radio>
                    <Radio value={0}>Nam</Radio>
                    <Radio value={1}>Nữ</Radio>
                  </Radio.Group>)}
                </Form.Item>
                <Form.Item label='Tiền đặt cọc' colon={false}>
                  {getFieldDecorator(`${keyName}depositPrice`, {
                    initialValue: value.depositPrice.value,
                    rules: [
                      {
                        required: true,
                        message: ' '
                      },
                      {
                        validator(rule, value, callback) {
                          if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                          else if (!/^\d+$/.test(value)) callback('Số tiền không hợp lệ.');
                          else if (value < CONST.MIN_PRICE) callback(`Tiền đặt cọc không được nhỏ hơn ${formatterCurrency(CONST.MIN_PRICE)} VNĐ.`);
                          else if (value > CONST.MAX_PRICE) callback(`Tiền đặt cọc không được lớn hơn ${formatterCurrency(CONST.MAX_PRICE)} VNĐ.`);
                          else callback();
                        }
                      },
                    ],
                    normalize: value => value.toString().replace(/,/g, ''),
                  })(<div>
                    <InputNumber
                      size='large'
                      className={styles.inputPrice}
                      step={CONST.STEP}
                      min={CONST.MIN_PRICE}
                      max={CONST.MAX_PRICE}
                      value={value.depositPrice.value}
                      formatter={price => formatterCurrency(price)}
                    />
                    <div className={styles.subInput}>VNĐ</div>
                  </div>)}
                </Form.Item>
                <Form.Item label='Số tháng đặt cọc'>
                  {getFieldDecorator(`${keyName}minDepositPeriod`, {
                    initialValue: value.minDepositPeriod.value,
                    rules: [
                      {
                        required: true,
                        message: ' '
                      },
                      {
                        validator(rule, value, callback) {
                          if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                          else if (!/^\d+$/.test(value)) callback('Số tháng không hợp lệ.');
                          else if (value < CONST.MIN_DEPOSIT_PERIOD) callback(`Số tháng cọc không được nhỏ hơn ${CONST.MIN_DEPOSIT_PERIOD}.`);
                          else if (value > CONST.MAX_DEPOSIT_PERIOD) callback(`Số tháng cọc không được lớn hơn ${CONST.MAX_DEPOSIT_PERIOD}.`);
                          else callback();
                        }
                      },
                    ],
                  })(<div>
                    <InputNumber
                      type='number'
                      size='large'
                      min={CONST.MIN_DEPOSIT_PERIOD}
                      max={CONST.MAX_DEPOSIT_PERIOD}
                      value={value.minDepositPeriod.value}/>
                    <div className={styles.subInput}>Tháng</div>
                  </div>)}
                </Form.Item>
                <Form.Item label='Danh sách phòng'>
                  {getFieldDecorator(`${keyName}roomNames`, {
                    initialValue: value.roomNames.value.map(roomName => roomName[0] || roomName),
                    rules: [
                      {
                        required: true,
                        message: 'Trường này là bắt buộc!!'
                      },
                    ],
                  })(<Select
                    mode="tags"
                    size='large'
                    placeholder='Ví dụ: Phòng 201, Phòng 302'
                    maxTagCount={CONST.MAX_ROOMS_IN_ROOM_GROUP}
                    maxTagTextLength={20}
                    dropdownStyle={{display: 'none'}}/>)}
                </Form.Item>
                <Form.Item label="Mô tả">
                  {getFieldDecorator(`${keyName}description`, {
                    initialValue: value.description.value,
                  })(
                    <Editor
                      initialContentState={value.description.value}
                      editorStyle={editorStyles.editorClassName}
                      toolbar={toolbar}/>
                  )}
                </Form.Item>
              </Card>
            );
          })}
        </Form>
      </div>
    );
  }
}

const editorStyles = {
  editorClassName: {
    maxWidth: '100%',
    minHeight: '150px',
    border: '1px solid #e5e5e5',
    padding: '6px 11px',
    lineHeight: '20px'
  }
};
const toolbar = {
  options: ['inline', 'blockType', 'list'],
  inline: {options: ['bold', 'italic', 'underline', 'strikethrough']},
  list: {options: ['unordered', 'ordered']}
};

export default Form.create({
  name: 'dynamic_form_item',
  onFieldsChange(props, changedFields, allValues) {
    const {allRoomExists} = props;
    console.log(allRoomExists);
    const changed = changedFields['roomGroupFieldsV2'];
    if (!changed) return;

    if (Object.values(changed).length === 1 && Object.values(changed)[0].roomNames) {
      const formatData = allValues.roomGroupFieldsV2.map(data => data.roomNames.value);
      const allRoomNames = [].concat.apply([], allRoomExists ? [...allRoomExists, ...formatData] : formatData);

      const duplicateRoomNames = getDuplicate(allRoomNames);

      if (duplicateRoomNames[0]) {
        let newArr = [];
        notification.open({
          message: 'Lỗi thêm phòng',
          description: <div>Phòng <Tag style={{margin: 0}} color="green">{duplicateRoomNames[0]}</Tag> đã tồn tại ở
            nhóm phòng khác !</div>,
          icon: <Icon type="frown" style={{color: '#108ee9'}}/>,
        });
        changedFields.roomGroupFieldsV2.forEach((data, index) => {
          newArr = data.roomNames.value.filter(room => room !== duplicateRoomNames[0]);
          newArr = newArr.map(data => String(data).toLowerCase());

          props.form.setFields({
            [`roomGroupFieldsV2[${index}]roomNames`]: {
              ...data.roomNames,
              value: newArr,
            },
          });
        });
      } else props.handleFormChangeV2(`roomGroupFieldsV2[${changed.length - 1}]`, changed[changed.length - 1], 'roomGroupFieldsV2');
    } else props.handleFormChangeV2(`roomGroupFieldsV2[${changed.length - 1}]`, changed[changed.length - 1], 'roomGroupFieldsV2');
  },
  mapPropsToFields(props) {
    let output = {};
    props.countId.countArr.forEach(id => {
      const roomGroupObj = props.roomGroupFieldsV2[`roomGroupFieldsV2[${id}]`];
      Object.keys(roomGroupObj).map(key => {
        const nameField = `roomGroupFieldsV2[${id}]${key}`;
        if (key === 'roomNames') roomGroupObj[key].value = roomGroupObj[key].value.filter(room => !isObject(room));
        return output[nameField] = Form.createFormField({...roomGroupObj[key]});
      });
    });
    return output;
  },
})(DynamicFieldSet);

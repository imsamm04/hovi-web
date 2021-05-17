import React, {Component} from 'react';
import {Form, Input, Icon, Button, Divider, Switch, Alert} from 'antd';

class DynamicFieldSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentKey: 0,
      roomNameDrawerId: props.roomNameDrawerId
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {roomNameDrawerId} = this.state;
    if (roomNameDrawerId !== nextProps.roomNameDrawerId) this.setState({
      currentKey: 0,
      roomNameDrawerId: nextProps.roomNameDrawerId,
    }, () => this.props.form.setFieldsValue({keys: []}))
  }

  remove = k => {
    const {form} = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 0) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const {currentKey} = this.state;
    const {form} = this.props;

    const newKey = currentKey + 1;

    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(newKey);
    // can use data-binding to set
    // important! notify form to detect changes
    this.setState({currentKey: newKey}, () => {
      form.setFieldsValue({
        keys: nextKeys,
      });
    });
  };

  render() {
    const {getFieldDecorator, getFieldValue} = this.props.form;
    const {rooms, roomNameDrawerId} = this.props;

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

    const listRooms = rooms && [].concat.apply([], rooms) || [];
    const filterRooms = listRooms.filter(lr => String(lr.roomGroupId) === String(roomNameDrawerId));
    const existsFormItems = filterRooms.map(k => {
        return (
          <Form.Item
            {...formItemLayout}
            required={false}
            key={k.roomId}
          >
            {getFieldDecorator(`existRooms[${k.roomId}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              initialValue: k.roomName,
              rules: [
                {
                  max: 20,
                  message: "Tên phòng không quá 20 kí tự"
                },
                {
                  required: true,
                  whitespace: true,
                  message: "Tên phòng không được bỏ trống!",
                },
              ],
            })(<Input size='large' placeholder="Nhập tên phòng" style={{width: '60%', marginRight: 8}}/>)}
            &nbsp;&nbsp;{getFieldDecorator(`deleteRooms[${k.roomId}]`, {
              initialValue: k.roomStatus !== -1,
              valuePropName: 'checked',
            })(<Switch
              checkedChildren={<Icon type="check"/>}
              unCheckedChildren={<Icon type="close"/>}
            />)}&nbsp;{getFieldValue(`deleteRooms[${k.roomId}]`) ? 'Khóa phòng' : 'Mở khóa phòng'}
          </Form.Item>
        )
      }
    );

    getFieldDecorator('keys', {initialValue: []});
    const keys = getFieldValue('keys');
    const formItems = keys.map(k => (
      <Form.Item
        {...formItemLayout}
        required={false}
        key={k}
      >
        {getFieldDecorator(`newRooms[${k}]`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              required: true,
              whitespace: true,
              message: "Tên phòng không được bỏ trống!",
            },
            {
              max: 20,
              message: "Tên phòng không quá 20 kí tự"
            },
            {
              validator: (rule, value, callback) => {
                try {
                  const newRooms = this.props.form.getFieldValue('newRooms');
                  const existRoom = listRooms.map(r => r.roomName);
                  const check = find_duplicate_in_array(newRooms.concat(existRoom));
                  if (check.length) callback('Tên phòng đã tồn tại ở nhóm phòng này hoặc nhóm phòng khác !');
                  else callback();
                } catch (err) {
                  callback(err);
                }
              },
            },
          ],
        })(<Input size='large' placeholder="Nhập tên phòng" style={{width: '60%', marginRight: 8}}/>)}
        {keys.length > 0 ? (
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => this.remove(k)}
          />
        ) : null}
      </Form.Item>
    ));

    return (
      <Form>
        <Form.Item>Danh sách phòng hiện tại</Form.Item>
        <Form.Item>
          <Alert message="Phòng bị khóa sẽ không còn được hiển thị khi khách chọn phòng để thuê !" type="warning"
                 showIcon/>
        </Form.Item>
        {existsFormItems}
        <Divider/>
        {formItems}
        <Form.Item {...formItemLayout}>
          <Button type="dashed" size='large' onClick={this.add} style={{width: '60%'}}>
            <Icon type="plus"/> Thêm phòng mới
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({name: 'dynamic_form_item'})(DynamicFieldSet);

const find_duplicate_in_array = (arra1) => {
  const object = {};
  const result = [];

  arra1.forEach(item => {
    if (!object[item])
      object[item] = 0;
    object[item] += 1;
  });

  for (const prop in object) {
    if (object[prop] >= 2) {
      result.push(prop);
    }
  }
  return result;
};


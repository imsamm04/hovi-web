import React, {Component} from 'react';
import CustomForm1 from './CustomForm1';
import CustomForm2 from './CustomForm2';
import {formatForm, CONST} from 'utils';
import {EditorState, ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import {message} from "antd";
import draftToHtml from 'draftjs-to-html';
import {API} from 'services';

const roomGroupFields = {
  area: {value: 100},
  capacity: {value: 2},
  rentPrice: {value: '1500000'},
  depositPrice: {value: '1500000'},
  minDepositPeriod: {value: 1},
  direction: {value: ''},
  bedroomQuantity: {value: 1},
  bathroomQuantity: {value: 1},
  description: {value: ''},
  gender: {value: null},
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      roomGroupFields: this.formatRoomGroupForm(props.roomGroup),
    };

    this.roomGroupForm = React.createRef();
  }

  formatRoomGroupForm = (roomGroup) => {
    if (roomGroup) {
      const {
        area,
        bathroomQuantity,
        bedroomQuantity,
        capacity,
        rentPrice,
        depositPrice,
        minDepositPeriod,
        description,
        direction,
        gender
      } = roomGroup;

      const editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(description))
      );

      return formatForm({
        area,
        bathroomQuantity,
        bedroomQuantity,
        capacity,
        rentPrice,
        depositPrice,
        minDepositPeriod,
        description: editorState,
        direction,
        gender,
      })
    } else return roomGroupFields;
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({roomGroupFields: this.formatRoomGroupForm(nextProps.roomGroup)});
  }

  handleFormChange = (changedFields, nameFields) => this.setState({
    [nameFields]: {...this.state[nameFields], ...changedFields},
  });

  handleSubmit = () => {
    this.roomGroupForm.current.validateFields((err, values) => {
      if (err) this.setState({isLoading: false}, () => message.error('Lỗi dữ liệu nhập vào !'));
      else {
        const {description} = this.state.roomGroupFields;
        const {id} = this.props.roomGroup;
        new API('roomGroup').update({
          id,
          data: {
            ...values,
            description: draftToHtml(convertToRaw(description.value.getCurrentContent()))
          }
        }).then(() => {
          this.props.onClose();
          message.success('Cập nhật thành công');
        }).catch(err => {
          console.log(err);
        })
      }
    });
  };

  render() {
    const {roomGroupFields} = this.state;
    const {typeId} = this.props.roomGroup.building;

    return (
      <div>
        {typeId === CONST.NHATRO ? (
          <CustomForm2
            ref={this.roomGroupForm}
            {...roomGroupFields}
            handleFormChange={this.handleFormChange}/>
        ) : (
          <CustomForm1
            ref={this.roomGroupForm}
            {...roomGroupFields}
            handleFormChange={this.handleFormChange}/>
        )}
      </div>
    )
  }
}

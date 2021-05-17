import React, {Component} from 'react';
import {Select} from 'antd';
import LocalStorage from 'utils/LocalStorage';

const {Option} = Select;

export default class extends Component {
  state = {roomTypes: []};

  componentDidMount() {
    LocalStorage.getRoomTypes().then(roomTypes => this.setState({roomTypes}));
  }

  render() {
    const {style, handleChange} = this.props;
    const {roomTypes} = this.state;

    return (
      <Select
        size='large'
        style={style}
        allowClear
        placeholder='Chọn loại phòng'
        onChange={handleChange}>
        {roomTypes.map(roomType => {
          return <Option key={roomType.id} value={roomType.id}>{roomType.type}</Option>;
        })}
      </Select>
    );
  }
}

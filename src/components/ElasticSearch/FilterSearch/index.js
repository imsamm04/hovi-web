import React from 'react';
import {Badge, Button, Collapse} from 'antd/lib/index';
import {CONST} from 'utils';
import RangePrice from '../common/RangePrice';
import Amenities from '../common/Amenities';
import RoomType from '../common/RoomTypeCheckbox';
import Gender from '../common/Gender';

const {Panel} = Collapse;

const checkCompare = (value, type) => {
  const defaultState = {
    price: [CONST.MIN_PRICE, CONST.MAX_PRICE],
    amenities: [],
    roomType: [],
    gender: 2,
  };
  return JSON.stringify(value) !== JSON.stringify(defaultState[type]);
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      price: [CONST.MIN_PRICE, CONST.MAX_PRICE],
      amenities: [],
      roomType: [],
      gender: 2,
      activeKey: [],
    };
  }

  onChangeActiveKey = (value) => this.setState({activeKey: [value[value.length - 1]]});

  onChangeAmenities = (amenities) => this.setState({amenities});
  onChangeRoomType = (roomType) => this.setState({roomType});
  onChangeGender = (gender) => this.setState({gender});
  onChangePrice = (input, index = null) => {
    if (index !== null && typeof input !== 'number') return;
    const {price} = this.state;
    this.setState({price: index === null ? input : index ? [price[0], input] : [input, price[1]]});
  };

  render() {
    const {handleChangeOptionSearch} = this.props;
    const {price, amenities, roomType, gender, activeKey} = this.state;
    const btnChangeOptionSearch = <Button
      type='link'
      onClick={() => handleChangeOptionSearch({
        price,
        amenities,
        roomType,
        gender,
      })}>Áp dụng</Button>;

    return (
      <Collapse bordered={false} activeKey={activeKey} onChange={this.onChangeActiveKey}>
        <Panel header="Giá" style={{userSelect: 'none'}}
               extra={checkCompare(price, 'price') ? <Badge color="#f50"/> : ''} key="1">
          <RangePrice value={price} onChangePrice={this.onChangePrice}/>
        </Panel>
        <Panel header="Tiện ích" style={{userSelect: 'none'}}
               extra={checkCompare(amenities, 'amenities') ? <Badge color="#f50"/> : ''} key="2">
          <Amenities value={amenities} onChangeAmenities={this.onChangeAmenities}/>
        </Panel>
        <Panel header="Loại phòng" style={{userSelect: 'none'}}
               extra={checkCompare(roomType, 'roomType') ? <Badge color="#f50"/> : ''} key="3">
          <RoomType onChangeRoomType={this.onChangeRoomType}/>
        </Panel>
        <Panel header="Giới tính" style={{userSelect: 'none'}}
               extra={checkCompare(gender, 'gender') ? <Badge color="#f50"/> : ''} key="4">
          <Gender value={gender} onChangeGender={this.onChangeGender}/>
        </Panel>
      </Collapse>
    );
  }
}

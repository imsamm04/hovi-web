import React, {Component} from 'react';
import {Card, Checkbox, Col, Row, Typography} from 'antd';
import {formatterCurrency} from 'utils';
import styles from './index.less';

const {Title, Text} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    const list = Object.values(props.roomGroupFieldsV2)
      .map(() => ({
        indeterminate: true,
        checkAll: false,
      }));

    this.state = {list}
  }

  onChange = (index, checkList) => {
    const {amenities, handleFormChange} = this.props;
    this.setState(({list}) => ({
      list: {
        ...list,
        [index]: {
          indeterminate: !!checkList.length && checkList.length < amenities.length,
          checkAll: checkList.length === amenities.length,
        }
      }
    }), () => handleFormChange({[index]: checkList}, 'roomAmenitiesFieldsV2'));
  };

  onCheckAllChange = (checked, index) => {
    const {amenities, handleFormChange} = this.props;
    const checkList = checked ? amenities.map(data => data.id) : [];
    this.setState(({list}) => ({
      list: {
        ...list,
        [index]: {
          indeterminate: false,
          checkAll: checked
        }
      }
    }), () => handleFormChange({[index]: checkList}, 'roomAmenitiesFieldsV2'));
  };

  render() {
    const {list} = this.state;
    const {amenities, roomAmenitiesFieldsV2, roomGroupFieldsV2} = this.props;
    const listAmenities = amenities.map((data, index) => {
      return <Col key={index} span={8}>
        <Checkbox style={{whiteSpace: 'pre'}} value={data.id}>
          {data.usableName}
        </Checkbox>
      </Col>;
    });

    return (
      <Row>
        <Col><Title level={4}>Tiện ích</Title></Col>
        <Col className={styles.description}><Text>
          Tích chọn những ô tiện ích mà khách thuê có thể sử dụng.
        </Text></Col>
        {Object.values(roomGroupFieldsV2).map((roomGroup, index) => {
          const roomAmenities = roomAmenitiesFieldsV2[index] || [];

          return (
            <Card key={index} size='small' style={{marginBottom: '10px'}} bordered={false}
                  title={`Loại ${formatterCurrency(roomGroup.rentPrice.value)} VNĐ`}>
              <Checkbox
                indeterminate={list[index].indeterminate}
                onChange={(e) => this.onCheckAllChange(e.target.checked, index)}
                checked={list[index].checkAll}>
                Chọn tất cả
              </Checkbox>
              <Checkbox.Group
                value={roomAmenities}
                onChange={checkList => this.onChange(index, checkList)}>
                <Row>
                  {listAmenities}
                </Row>
              </Checkbox.Group>
            </Card>
          );
        })}
      </Row>
    );
  }
}

// export default ({roomGroupFieldsV2, roomAmenitiesFieldsV2, amenities, handleFormChange}) => {
//   const roomGroups = Object.keys(roomGroupFieldsV2);
//   const listAmenities = amenities.map((data, index) => {
//     return <Col key={index} span={8}>
//       <Checkbox style={{whiteSpace: 'pre'}} value={data.id}>
//         {data.usableName}
//       </Checkbox>
//     </Col>;
//   });
//
//   const onChange = (roomGroupId, checkList) => {
//     handleFormChange({[roomGroupId]: {roomGroupId, data: checkList}}, 'roomAmenitiesFieldsV2');
//   };
//
//   return (
//     <Row>
//       <Col><Title level={4}>Tiện ích</Title></Col>
//       <Col className={styles.description}><Text>
//         Tích chọn những ô tiện ích mà khách thuê có thể sử dụng.
//       </Text></Col>
//       {roomGroups.map(key => {
//         const value = roomGroupFieldsV2[key];
//         const roomAmenities = roomAmenitiesFieldsV2[value.id.value] ?
//           roomAmenitiesFieldsV2[value.id.value].data : [];
//         return (
//           <Card key={key} size='small' style={{marginBottom: '10px'}} bordered={false}
//                 title={`Loại ${formatterCurrency(value.rentPrice.value)} VNĐ`}>
//             <Checkbox.Group
//               value={roomAmenities}
//               onChange={checkList => onChange(value.id.value, checkList)}>
//               <Row>
//                 {listAmenities}
//               </Row>
//             </Checkbox.Group>
//           </Card>
//         );
//       })}
//     </Row>
//   );
// }

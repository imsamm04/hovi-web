import React, {Component} from 'react';
import {formatterCurrency} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import {Table, Tag} from 'antd';

export default class extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {showDrawer, dataSource, isLoading} = this.props;

    const columns = [
      {
        title: 'Tên căn hộ',
        width: 200,
        dataIndex: 'building.buildingName',
        key: 'building.id',
        fixed: 'left',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Giá thuê',
        width: 150,
        dataIndex: 'rentPrice',
        key: 'rentPrice',
        render: text => <span>{formatterCurrency(text)}&nbsp;VNĐ</span>,
      },
      {
        title: 'Giá đặt cọc',
        width: 150,
        dataIndex: 'depositPrice',
        key: 'depositPrice',
        render: text => <span>{formatterCurrency(text)}&nbsp;VNĐ</span>,
      },
      {
        title: 'Diện tích',
        width: 100,
        dataIndex: 'area',
        key: 'area',
        render: text => <span>{text}&nbsp;m²</span>,
      },
      {
        title: 'Sức chứa',
        width: 100,
        dataIndex: 'capacity',
        key: 'capacity',
        render: (text, record) => {
          const gender = record.gender === null ? 'người' : record.gender === 0 ? 'Nam' : 'Nữ';
          return (<span>{text}&nbsp;{gender}</span>);
        },
      },
      {
        title: 'Tiện ích',
        width: 200,
        key: 'roomAmenities',
        dataIndex: 'roomAmenities',
        render: roomAmenities => (
          <span>
        {roomAmenities.map(value => {
          const amenities = LocalStorage.findRoomAmenities(value.amenitiesId);
          return (
            <Tag key={amenities.id}>
              {amenities.unusableName ? amenities.unusableName : amenities.usableName}
            </Tag>
          );
        })}
      </span>
        ),
      },
      {
        title: 'Dịch vụ',
        width: 200,
        key: 'buildingServices',
        dataIndex: 'buildingServices',
        render: buildingServices => (
          <span>
        {buildingServices.map(value => {
          const buildingService = LocalStorage.findBuildingService(value.serviceId);
          return (
            <Tag key={buildingService.id}>
              {buildingService.name}
            </Tag>
          );
        })}
      </span>
        ),
      },
      {
        title: 'Địa chỉ',
        width: 300,
        dataIndex: 'buildingName',
        key: 'buildingName',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Hành động',
        width: 100,
        key: 'action',
        fixed: 'right',
        render: (text, record) => (
          <span>
        <a onClick={() => showDrawer(record)}>Sửa</a>
      </span>
        ),
      },
    ];

    return (
      <Table
        loading={isLoading}
        bordered={true}
        tableLayout='fixed'
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{x: 1500}}/>
    );
  }
}

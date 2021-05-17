import React, { Component } from 'react'
import { Table, Divider, Tag } from 'antd';

const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'STK',
      dataIndex: 'numberCard',
      key: 'numberCard',
    },
    {
        title: 'Số tiền',
        dataIndex: 'amountOfMoney',
        key: 'amountOfMoney',
    },
    {
        title: 'Loại phòng',
        dataIndex: 'roomType',
        key: 'roomType',
    },
    {   title: 'Date',
        dataIndex: 'createdAt',
        key: 'createdAt', 
    },
    {
        
      title: 'Nội dung',
      dataIndex: 'contentTranfer',
      key: 'contentTranfer',
    },
    {
      title: 'Trang thái',
      key: 'status',
      dataIndex: 'status',
      render: status => (
        <span>
          {status.map(status => {
            let color = status.length > 15 ? 'red' : 'green';
            if (status === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={status}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },

    {
      title: 'Action',
      key: 'action',
      render: () => (
        <span>
          <a>Xem chi tiết</a>
          <Divider type="vertical" />
          <a>Xóa</a>
        </span>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      numberCard: 322343222342,
      amountOfMoney: '1.200.000',
      roomType:'Phòng trọ',
      contentTranfer: 'chuyển tiền đặt cọc trọ',
      createdAt: '2014-12-24 23:12:00',
      status: ['Đã chuyển khoản'],
    },
    {
      key: '2',
      name: 'John Brown',
      numberCard: 322343222342,
      amountOfMoney: '1.000.000',
      roomType:'Phòng trọ',
      contentTranfer: 'chuyển tiền đặt cọc trọ',
      createdAt: '2014-12-24 23:12:00',
      status: ['Đã chuyển khoản'],
    },
    {
      key: '3',
      name: 'John Brown',
      numberCard: 322343222342,
      amountOfMoney: '1.300.000',
      roomType:'Phòng trọ',
      contentTranfer: 'chuyển tiền đặt cọc trọ',
      createdAt: '2014-12-24 23:12:00',
      status: ['Chưa chuyển khoản'],
    },
  ];
  
export default class TranferHistory extends Component {
    render() {
        return (
            <div>
                <Table columns={columns} dataSource={data} />,
            </div>
        )
    }
}

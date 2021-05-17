import React from "react";
import styles from './index.less';
import {List, Row, Col, Button, Spin, Typography, Tag, Divider, PageHeader, Icon} from 'antd';
import {formatterCurrency} from '../../utils/index';
import {ManagementRoomStatus} from '../../utils/const';
import ImageNotFound from '../../assets/not-found.png';
import router from 'umi/router';

const {Title} = Typography;

export default ({listRoom, isLoading,currentKey}) => {
  if (isLoading) return <Spin spinning={true}/>;

  const generateRoomTransactionDetail = (item) => {
    return (
      <div>
        <Col span={24}>Khách thuê: {item.tenant.userName}</Col>
        {!!item.transactionId &&
        <Col span={24} style={{textAlign: 'center'}}>
          <Button onClick={() => router.push(`/transactions/${item.transactionId}`)} type={"primary"}>Trạng thái giao
            dịch</Button>
        </Col>}
      </div>
    )
  };

  return (
    <div>
      <Row>
        <Col span={12} className={styles.title}>
        {currentKey==1? 'Căn hộ chung cư': currentKey==2 ? 'Nhà nguyên căn':'Khu nhà trọ'}
        </Col>
        <Col span={12} style={{textAlign:'right'}}>
          <Button
            type='link'
            style={{padding: 0}}
            onClick={() =>onClickOpenUpdate(currentKey)}>
            <Icon type="plus-square"/>&nbsp;Cập nhật thông tin phòng
          </Button>
        </Col>
        <Divider/>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 5,
          }}
          dataSource={listRoom}
          renderItem={item => (
            <List.Item key={item.roomId}>
              <Row>
                <Col span={8}>
                  {item.image ?
                    <img
                      width={300}
                      height={150}
                      alt="logo"
                      src={item.image}
                    /> : <img
                      width={300}
                      height={150}
                      alt="logo"
                      src={ImageNotFound}
                    />}
                </Col>
                <Col span={16} style={{paddingTop: '0 !important'}}>
                  <Col span={24}>
                    <a href={'/room-detail/' + item.roomGroupId} target={'_blank'} style={{color: 'black'}}>
                      <Title level={4} style={{marginBottom: 0}}>{item.title}</Title>
                    </a></Col>
                  <Col span={item.buildingTypeId == 3 ? 12 : 24}>Địa chỉ: {JSON.parse(item.address.ward)[0]
                  + ', ' + JSON.parse(item.address.district)[0] + ', ' + JSON.parse(item.address.province)[0]}</Col>
                  {item.buildingTypeId == 3 &&
                  <Col span={12}>Tên phòng: <span className={styles.roomName}>{item.roomName}</span></Col>}
                  <Col span={12}>Tiền thuê: {formatterCurrency(item.price) + ' VNĐ'} </Col>
                  <Col span={12}>Tiền đặt cọc: {formatterCurrency(item.deposit) + ' VNĐ'} </Col>
                  <Col span={24}>Trạng thái phòng:
                    <Tag color={ManagementRoomStatus.find(obj => obj.code == item.status).color}
                         style={{marginLeft: '10px'}}>
                      {' ' + ManagementRoomStatus.find(obj => obj.code == item.status).name}
                    </Tag>
                  </Col>
                  {item.status != 0 && item.status != 4 && item.tenant != null &&
                  generateRoomTransactionDetail(item)}
                </Col>
              </Row>
            </List.Item>
          )}
        />
      </Row>
    </div>
  );
}

const onClickOpenUpdate = (buildingTypeId) => router.push(`/host/management/update?typeId=${buildingTypeId}`);

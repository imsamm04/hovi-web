import React, {Component} from 'react';
import Carousel from './common/Carousel';
import {Tooltip, Col, List, Button, Icon, Tag, Typography, Row} from 'antd';
import {CONST, formatterCurrency} from 'utils';
import styles from "./index.less";

const {Paragraph, Text} = Typography;

export default class extends Component {
  render() {
    const {showDrawer, dataSource, isLoading, amenities, buildingServices, isKhuTro} = this.props;
    const detailAddress = (building) => {
      const {ward, district, province} = building;
      return `${JSON.parse(ward)[0]}, ${JSON.parse(district)[0]}, ${JSON.parse(province)[0]}`;
    };

    return (
      <List
        itemLayout="horizontal"
        loading={isLoading}
        dataSource={dataSource}
        renderItem={item => {
          const images_url = item.roomImages.map(data => data.imageUrl);
          const handleUpdate = (type, id) => showDrawer({item, type}, id);
          const listServices = item.buildingServices && item.buildingServices.map(s => {
            const data = buildingServices.find(m => m.id === s.serviceId);
            return <Tag style={{margin: '0 3px 3px 0'}}>{`Dịch vụ ${String(data.name).toLowerCase()}`}</Tag>;
          });
          const listAmenities = item.roomAmenities && item.roomAmenities.map(a => {
            const data = amenities.find(m => m.id === a.amenitiesId);
            return <Tag style={{margin: '0 3px 3px 0'}}>{data.usableName}</Tag>;
          });
          return (
            <List.Item className={styles.listItem}>
              <Row className={styles.contentItem}>
                <Carousel
                  width={300}
                  images_url={images_url}
                  handleUpdate={() => handleUpdate(CONST.IMAGES_DRAWER)}/>
                <div className={styles.metaItemShowMap}>
                  <Col>
                    <a href={`/room-detail/${item.id}`} target='_blank' rel='noopener noreferrer'>
                      <Paragraph
                        className={styles.itemTitle}
                        style={{marginBottom: isKhuTro ? '10px' : '5px'}}
                        ellipsis={{rows: 2, expandable: false}}>
                        {item.building.buildingName} - Loại {formatterCurrency(item.rentPrice)} VNĐ
                      </Paragraph>
                    </a>
                  </Col>
                  {!isKhuTro && <div style={{marginBottom: '10px'}}>
                    <Text strong>Địa chỉ:</Text>&nbsp;<Icon type='environment'/>&nbsp;{detailAddress(item.building)}
                    &nbsp;<a onClick={() => handleUpdate(CONST.BUILDING_DRAWER)}>
                    <Tooltip title='Cập nhật'><Icon type='edit'/></Tooltip>
                  </a>
                  </div>}
                  <div style={{marginBottom: '5px'}}>
                    <Text strong>Dịch vụ:</Text>&nbsp;{listServices}
                    <Tag className={styles.updateTag}
                         onClick={() => handleUpdate(CONST.SERVICES_DRAWER)}>
                      <Icon type="edit"/> Cập nhật
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Tiện ích:</Text>&nbsp;{listAmenities}
                    <Tag className={styles.updateTag}
                         onClick={() => handleUpdate(CONST.AMENITIES_DRAWER)}>
                      <Icon type="edit"/> Cập nhật
                    </Tag>
                  </div>
                  {isKhuTro ?
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <Button
                        type='dashed'
                        style={{width: '49%', marginTop: '10px'}}
                        onClick={() => handleUpdate(CONST.ROOM_GROUP_DRAWER)}>
                        Cập nhật thông tin nhóm phòng
                      </Button>
                      <Button
                        type='dashed'
                        style={{width: '49%', marginTop: '10px'}}
                        onClick={() => handleUpdate(CONST.ROOM_NAME_DRAWER, item.id)}>
                        Cập nhật danh sách phòng
                      </Button>
                    </div> :
                    <Button
                      type='dashed'
                      style={{width: '100%', marginTop: '10px'}}
                      onClick={() => handleUpdate(CONST.ROOM_GROUP_DRAWER)}>
                      Cập nhật thông tin nhóm phòng
                    </Button>}
                </div>
              </Row>
            </List.Item>
          )
        }}
      />
    )
  }
}

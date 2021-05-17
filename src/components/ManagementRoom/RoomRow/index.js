import React, {Component} from 'react';
import {Button, Card, Collapse, List, Row, Col, Icon} from 'antd';
import styles from "./index.less";
import {CONST, formatterCurrency} from 'utils';
import Carousel from "./common/Carousel";
import router from 'umi/router';

const {Panel} = Collapse;
const {Meta} = Card;

export default class extends Component {
  render() {
    const {showDrawer, dataSource, isLoading, handleUpdate} = this.props;
    const listBuilding = formatData(dataSource);


    const customPanelStyle = {
      background: '#f7f7f7',
      borderRadius: 4,
      marginBottom: 24,
      border: 0,
      overflow: 'hidden',
    };

    return (
      <Collapse
        bordered={false}
        expandIcon={({isActive}) => <Icon type="caret-right" rotate={isActive ? 90 : 0}/>}>
        {listBuilding.map(buildingId => {
          const items = dataSource.filter(data => data.buildingId === buildingId);
          const building = items[0] && items[0].building;

          return building && (
            <Panel header={
              <div>
                <Row type='flex' align="middle">
                  <Col span={12}>
                    {formatAddress(building, () => showDrawer({
                      type: CONST.BUILDING_DRAWER,
                      item: items[0]
                    }))}
                  </Col>
                  <Col span={12} className={styles.addRoomGroup}>
                    <Button type='link' onClick={() => router.push(`/host/management/${buildingId}/add`)}>
                      <Icon type="plus-square"/>&nbsp;Thêm loại phòng trọ
                    </Button>
                  </Col>
                </Row>
                <Button
                  type='link'
                  style={{padding: 0}}
                  onClick={() => showDrawer({
                    type: CONST.SERVICES_DRAWER,
                    item: items[0]
                  })}>Cập nhật dịch vụ</Button>
              </div>
            } key={buildingId} style={customPanelStyle}>
              <List
                grid={{gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1}}
                dataSource={items}
                renderItem={item => {
                  const images_url = item.roomImages.map(data => data.imageUrl);
                  return (
                    <List.Item>
                      <Card
                        className={styles.card}
                        hoverable
                        style={{width: '100%'}}
                        cover={<Carousel
                          images_url={images_url}
                          width='100%'
                          handleUpdate={() => showDrawer({
                            item,
                            type: CONST.IMAGES_DRAWER,
                          })}/>
                        }>
                        <Meta
                          title={<a>{`Loại phòng ${formatterCurrency(item.rentPrice)} VNĐ`}</a>}
                          description={
                            <Row>
                              <Button
                                type='dashed'
                                style={{width: '100%'}}
                                onClick={() => showDrawer({
                                  item,
                                  type: CONST.ROOM_GROUP_DRAWER,
                                })}>
                                Chỉnh sửa thông tin phòng
                              </Button>
                              <Button
                                type='dashed'
                                style={{width: '100%', marginTop: '5px'}}
                                onClick={() => showDrawer({
                                  item,
                                  type: CONST.AMENITIES_DRAWER,
                                })}>
                                Chỉnh sửa tiện ích phòng
                              </Button>
                            </Row>
                          }/>
                      </Card>
                    </List.Item>
                  )
                }}
              />
            </Panel>
          )
        })}
      </Collapse>
    );
  }
}

const formatData = (dataSource) => {
  const listBuildingIds = dataSource.map(value => value.buildingId);
  return listBuildingIds.filter((value, index, self) => self.indexOf(value) === index);
};

const formatAddress = (building, onClick) => {
  try {
    const {province, district, ward, buildingName} = building;
    if (province && district && ward) {
      return (
        <Row type='flex' align='middle' gutter={4}>
          <Col className={styles.buildingTitle}>{buildingName}</Col><Col>-</Col>
          <Col>
            <Button type='link' style={{padding: 0}} onClick={onClick}>
              {`${JSON.parse(ward)[0]}, ${JSON.parse(district)[0]}, ${JSON.parse(province)[0]}`}<Icon type="edit"/>
            </Button>
          </Col>
        </Row>
      )
    } else return <div/>;
  } catch (e) {
    console.log(e);
    return <div/>;
  }
};

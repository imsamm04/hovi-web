import React from 'react';
import {Card, Col, Icon, List, Row, Typography, Tag} from 'antd/lib/index';
import Carousel from '../../common/Carousel';
import LocalStorage from 'utils/LocalStorage';
import {timeDifference} from 'utils';
import router from 'umi/router';
import styles from '../ResultSearch/index.less';

const {Meta} = Card;
const {Paragraph} = Typography;

export default ({item, savedList, onChange}) => {
  const formatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  const time = timeDifference(item.dataSearch.updatedAt);

  return (
    <List.Item className={styles.itemCol}>
      <Card
        hoverable
        size='small'
        bordered={false}
        className={styles.cardItem}
        bodyStyle={{height: '120px', overflow: 'hidden'}}
        headStyle={{fontSize: '15px', fontWeight: 100, color: 'rgba(0, 0, 0, 0.65)'}}
        cover={<Carousel
          likeButton={true}
          images_url={item.dataSearch.roomImages}
          isSaved={savedList.includes(Number(item.id))}
          onChange={onChange}
          onClick={() => router.push(`/room-detail/${item.id}`)}
          savedData={{
            roomGroupId: item.id,
            name: item.dataSearch.name,
            rentPrice: item.dataSearch.rentPrice
          }}/>}>
        <Meta
          description={
            <div onClick={() => router.push(`/room-detail/${item.id}`)}>
              <Paragraph
                className={styles.descriptionParagraph}
                ellipsis={{rows: 2, expandable: false}}>
                {time.isNew &&
                <Tag color="#2db7f5" style={{marginRight: '5px'}}>{time.content}</Tag>}{item.dataSearch.name}
              </Paragraph>
              <Row style={{
                position: 'absolute',
                padding: '12px',
                marginBottom: '24px',
                left: 0,
                bottom: 0,
                right: 0,
              }}>
                <Col span={12}>{LocalStorage.findRoomType(item.dataSearch.typeId)}</Col>
                <Col span={12} style={{textAlign: 'right'}}>
                  <Icon type="user" style={{color: 'rgba(0, 0, 0, 0.65)'}}/>
                  &nbsp;{item.dataSearch.capacity} người ở
                </Col>
              </Row>
            </div>
          }/>
        <Row type="flex" justify="space-between" style={{
          position: 'absolute',
          padding: '12px',
          left: 0,
          bottom: 0,
          right: 0,
        }}>
          <Col span={12}>
            <b>{`${formatNumber(Number(item.dataSearch.rentPrice))} VNĐ`}</b>
          </Col>
          <Col span={12} style={{textAlign: 'right'}}>
            {item.dataSearch.viewAmount ? `${item.dataSearch.viewAmount} lượt xem` : 'Chưa có lượt xem'}
            {/*{time.isNew ? <Tag color="#2db7f5" style={{margin: 0}}>{time.content}</Tag> : `${time.content}`}*/}
            {/*<Icon type="star" theme='filled' style={{color: 'rgba(0, 0, 0, 0.65)'}}/>*/}
            {/*&nbsp;{4.5}*/}
          </Col>
        </Row>
      </Card>
    </List.Item>
  );
}

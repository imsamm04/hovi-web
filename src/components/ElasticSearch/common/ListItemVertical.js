import React, {Component} from 'react';
import {Button, Col, Icon, List, Row, Tag, Typography} from 'antd/lib/index';
import Carousel from '../../common/Carousel';
import SavedList from '../../common/SavedList';
import classNames from 'classnames';
import router from 'umi/router';
import LocalStorage from 'utils/LocalStorage';
import {formatterCurrency, timeDifference, CONST} from 'utils';
import styles from '../ResultSearch/index.less';

const {Paragraph} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    this.savedList = React.createRef();
  }

  handleOnSave = () => {
    LocalStorage.getCurrentUser().then(user => {
      if (user) this.savedList.current.handleToggle();
      else router.push(`${window.location.pathname}?login=true`);
    });
  };

  render() {
    const {item, isShowMap, onMouseOver, images_url, savedData, isSaved, onChange} = this.props;
    const amenities = item.dataSearch.amenities;
    const listAmenities = amenities && amenities.map((a, i) => `${a.name}${i + 1 === amenities.length ? '' : ' · '}`);
    const gender = item.dataSearch.typeId === CONST.NHATRO ? CONST.GENDER_DISPLAY.find(g => g.code === item.dataSearch.gender).name : 'người ở';
    const time = timeDifference(item.dataSearch.updatedAt);

    const formatSavedData = () => {
      if (!savedData) return {};
      else {
        const {roomGroupId, name, rentPrice} = savedData;
        const title = name.toString().split(' - ')[0];
        const address = name.toString().split(' - ')[1];

        return {
          title,
          address,
          rentPrice,
          roomGroupId,
          images: images_url
        }
      }
    };

    return (
      <div>
        <List.Item
          onMouseMove={() => onMouseOver(item.id)} className={classNames(styles.cardItem, {
          [styles.cardItemShowMap]: isShowMap,
        })}>
          <Row type='flex'>
            <Col className={styles.imageCarousel}>
              <Carousel
                width={300}
                isShowMap={isShowMap}
                onClick={() => router.push(`/room-detail/${item.id}`)}
                images_url={item.dataSearch.roomImages}/>
            </Col>
            <Col className={styles.metaItemShowMap}>
              <Row type='flex' justify="space-between">
                <Col span={20} style={{display: 'flex', alignItems: 'center'}}>
                  {LocalStorage.findRoomType(item.dataSearch.typeId)} - {item.dataSearch.area} mét vuông
                </Col>
                <Col span={4} style={{textAlign: 'right'}}>
                  <Button
                    type='link'
                    className={styles.likeBtn}
                    onClick={this.handleOnSave}>
                    {isSaved ?
                      <Icon
                        type="heart"
                        theme='twoTone'
                        style={{color: '#eb2f96', fontSize: '16px'}}/> :
                      <Icon
                        type="heart"
                        style={{color: 'rgba(0, 0, 0, 0.65)', fontSize: '16px'}}/>}
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col
                  onClick={() => router.push(`/room-detail/${item.id}`)}
                  className={styles.itemTitle}>
                  <Paragraph
                    className={styles.descriptionParagraph}
                    ellipsis={{rows: 2, expandable: false}}>
                    {time.isNew &&
                    <Tag color="#2db7f5" style={{marginRight: '5px'}}>{time.content}</Tag>}{item.dataSearch.name}
                  </Paragraph>
                </Col>
                <Col>
                  {!time.isNew && <Paragraph
                    style={{marginBottom: '5px'}}
                    underline
                    ellipsis={{rows: 2, expandable: false}}>
                    Cập nhật cách đây {time.content}
                  </Paragraph>}
                </Col>
                <Col>
                  <Paragraph
                    ellipsis={{rows: 2, expandable: false}}>
                    {listAmenities}
                  </Paragraph>
                </Col>
                <Col>
                </Col>
                <Col>{item.dataSearch.detail_address}</Col>
              </Row>
              <Row className={styles.detailItem}>
                <Col span={12}>
                  <Icon type="user" style={{color: 'rgba(0, 0, 0, 0.65)'}}/>
                  &nbsp;{item.dataSearch.capacity}&nbsp; {gender}
                </Col>
                <Col span={12} style={{textAlign: 'right'}}>
                  <b>{`${formatterCurrency(Number(item.dataSearch.rentPrice))} VNĐ`}</b>
                </Col>
              </Row>
            </Col>
          </Row>
        </List.Item>
        <SavedList ref={this.savedList} {...formatSavedData()} isSaved={isSaved} onChange={onChange}/>
        <div className={styles.borderCardItem}/>
      </div>
    );
  }
}

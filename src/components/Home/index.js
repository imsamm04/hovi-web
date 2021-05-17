import React, {Component} from 'react';
import {Row, Col, Icon} from 'antd';
import TopPopulation from './TopPoplulation';
import Footer from '../Layout/Footer';
import {buildQuerySearch} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import router from 'umi/router';
import styles from './index.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomTypes: [],
      recentlySearch: LocalStorage.getRecentlySearch(),
    };
  }

  componentDidMount() {
    LocalStorage.getRoomTypes().then(roomTypes => this.setState({roomTypes}));
  }

  render() {
    const {roomTypes, recentlySearch} = this.state;

    return (
      <div className={styles.bodyContent}>
        <h3 className={styles.title}>Bạn muốn thuê loại phòng nào?</h3>
        <Row gutter={16} className={styles.list}>
          {roomTypes.map((roomType, i) =>
            <RoomType key={i} index={i} id={roomType.id}>{roomType.type}</RoomType>)}
        </Row>
        {recentlySearch &&
        <div>
          <h3 className={styles.title}>Tiếp tục tìm kiếm của bạn</h3>
          <Row gutter={16} className={styles.list}>
            {recentlySearch.map((location, i) =>
              <Location key={i} location={location.data}>{location.name}</Location>)}
          </Row>
        </div>}
        <Row style={{marginBottom: '80px'}}>
          <TopPopulation/>
        </Row>
        <Footer/>
      </div>
    );
  }
}

const RoomType = ({children, index, id}) => {
  const keywords = ['apartment', 'home', 'dorm'];
  return (
    <Col style={{flex: 1}} onClick={() => router.push(`/homes/search?types=${id}`)}>
      <Row className={styles.roomType}>
        <Col span={8} className={styles.roomTypeImage}>
          <img className={styles.image} src={`https://source.unsplash.com/featured/?${keywords[index]}`} alt='house'/>
        </Col>
        <Col span={16} className={styles.roomTypeTitle}>
          {children}
        </Col>
      </Row>
    </Col>
  );
};

const Location = ({children, location}) => (
  <Col style={{flex: 1}} onClick={() => {
    // LocalStorage.recentlySearch(location);
    router.push({
      pathname: '/homes/search',
      query: buildQuerySearch({location}),
    })
  }}>
    <Row className={styles.recentlySearch}>
      <Icon type='search'/>
      <div className={styles.recentlyTitle}>{children}</div>
    </Row>
  </Col>
);


import React, {Component} from 'react';
import {Button, Card, Col, Input, Row} from 'antd/lib/index';
import {buildQuerySearch, getDefaultFilter} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import CustomTitle from '../../common/CustomTitle';
import LocationSearch from '../LocationSearch';
import PriceInput from '../../common/PriceInput';
import RoomTypeSelect from '../common/RoomTypeSelect';
import router from 'umi/router';
import styles from './index.less';

const {Meta} = Card;
const InputGroup = Input.Group;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: [],
      roomTypes: '',
      priceRange: ['', ''],
    };
  }

  handleChangeLocation = (location) => this.setState({location});
  handleChangeRoomType = (roomTypes) => this.setState({roomTypes: [roomTypes]});
  handleChangePrice = (price, index) => {
    const {priceRange} = this.state;
    if (!price) this.setState({
      priceRange: index ? [priceRange[0], ''] : ['', priceRange[1]],
    });
    else if (typeof price === 'number') this.setState({
      priceRange: index ? [priceRange[0], price] : [price, priceRange[1]],
    });
  };

  handleSearch = () => {
    const {location, roomTypes, priceRange} = this.state;

    let minPrice = priceRange[0] ? priceRange[0] : getDefaultFilter('price')[0];
    let maxPrice = priceRange[1] ? priceRange[1] : getDefaultFilter('price')[1];

    // add recently search
    LocalStorage.recentlySearch(location);

    // build query search
    router.push({
      pathname: '/homes/search',
      query: buildQuerySearch({location, roomTypes, price: [minPrice, maxPrice]}),
    });
  };

  render() {
    const {priceRange} = this.state;

    return (
      <Card className={styles.cardSearch}>
        <CustomTitle>HomoHouse<br/>Thuê trọ đơn giản.</CustomTitle>
        <Meta
          className={styles.metaCard}
          title={<div className={styles.titleMetaCard}>Bạn muốn tìm phòng ở đâu?</div>}
          description={
            <LocationSearch
              isHomepage={true}
              placeholder='Bất cứ nơi nào'
              handleChangeLocation={this.handleChangeLocation}/>
          }/>
        <Meta
          className={styles.metaCard}
          title={
            <Row className={styles.titleMetaCard}>
              <Col span={12}>Thấp nhất</Col>
              <Col span={12}>Cao nhất</Col>
            </Row>
          }
          description={
            <InputGroup compact>
              <PriceInput
                style={{width: '50%'}} size='large'
                index={0} value={priceRange}
                onChangePrice={this.handleChangePrice}/>
              <PriceInput
                style={{width: '50%'}} size='large'
                index={1} value={priceRange}
                onChangePrice={this.handleChangePrice}/>
            </InputGroup>
          }/>
        <Meta
          className={styles.metaCard}
          title={<div className={styles.titleMetaCard}>Loại phòng</div>}
          description={<RoomTypeSelect style={{width: '100%'}} handleChange={this.handleChangeRoomType}/>}/>
        <Button type='danger' size='large'
                onClick={this.handleSearch}
                className={styles.searchBtn}>Tìm kiếm</Button>
      </Card>
    );
  }
}

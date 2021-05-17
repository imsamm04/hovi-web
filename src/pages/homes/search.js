import React, {Component} from 'react';
import {Card, Layout, Tag, Icon} from 'antd/lib/index';
import {DrawerFilter, FilterSearch, GoogleMapForm, HomeHeader, ResultSearch} from 'components';
import {
  CONST,
  buildQuerySearch,
  getPartUrl,
  checkCompareAdvancedFilter,
  defaultState,
  formatterCurrency,
} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import {ES} from 'services';
import styles from './search.less';
import classNames from "classnames";
import router from "umi/router";

const {Content} = Layout;

export default class extends Component {
  constructor(props) {
    super(props);
    const {query} = props.history.location;
    this.state = {
      metaPage: {},
      scrollData: {},
      results: [],
      isLoading: true,
      isMoreFilter: false,
      isPopupOpen: false,
      isHover: 0,
      locationSearch: getPartUrl(query, 'locations'),
      optionsSearch: getPartUrl(query, 'optionsSearch'),
      isShowMap: localStorage.getItem('isShowMap') === 'true',
    };
  }

  componentWillMount() {
    this.unlisten = this.props.history.listen(location => {
      const numPage = location.query.page;
      const page = numPage && !isNaN(numPage) ? Number(numPage) : 1;
      this.handleGetResults({page})
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  handleChangeLocation = (locationSearch) => this.setState({locationSearch});

  handleFilterOpen = (isPopupOpen) => this.setState({
    isPopupOpen,
    isMoreFilter: false
  }, () => {
    if (!isPopupOpen) {
      const {query} = this.props.history.location;
      router.push({
        pathname: '/homes/search',
        query: buildQuerySearch({
          ...this.state.optionsSearch,
          location: getPartUrl(query, 'locations')
        }),
      });
    }
  });

  handleOpenDrawerFilter = () => {
    const {isMoreFilter} = this.state;
    this.setState({isMoreFilter: !isMoreFilter}, () => {
      if (isMoreFilter) {
        const {query} = this.props.history.location;
        const {lat, lng, address} = this.state.optionsSearch.location;
        const location = lat && lng && address ? {lat, lng, address} : getPartUrl(query, 'locations');

        // add recently search
        LocalStorage.recentlySearch(location, 2);

        // build query search
        router.push({
          pathname: '/homes/search',
          query: buildQuerySearch({...this.state.optionsSearch, location}),
        });
      }
    });
  };

  handleChangeOptionSearch = (key, value) => {
    const {optionsSearch, locationSearch} = this.state;
    this.setState({
      locationSearch: key === 'location' ? [] : locationSearch,
      optionsSearch: {
        ...optionsSearch,
        [key]: value
      }
    })
  };

  handleGetResults = ({page, scrollId = null}) => {
    this.setState({isLoading: true}, () => {
      let location = {};
      const {locationSearch, optionsSearch} = this.state;
      const isSearchAround = !!(optionsSearch.location.lat && optionsSearch.location.lng);
      if (locationSearch.length > 0) location.province = locationSearch[0][1];
      if (locationSearch.length > 1) location.district = locationSearch[1][1];
      if (locationSearch.length > 2) location.ward = locationSearch[2][1];

      new ES('rooms').roomsSearch({
        params: {
          page,
          scrollId,
          clause: optionsSearch,
          location: isSearchAround ? null : location,
          isShowMap: this.state.isShowMap
        }
      }).then(response => this.setState({
        isLoading: false,
        metaPage: response.meta,
        scrollData: response.scroll,
        results: response.data,
      })).catch(() => this.setState({isLoading: false}));
    });
  };

  /**
   * Event on click search button in header
   */
  handleSearch = () => {
    const {query} = this.props.history.location;

    // add recently search
    LocalStorage.recentlySearch(this.state.locationSearch);

    this.setState(({optionsSearch}) => ({
      optionsSearch: {
        ...optionsSearch,
        location: {lat: '', lng: '', address: ''}
      }
    }), () => router.push({
      pathname: '/homes/search',
      query: buildQuerySearch({
        ...getPartUrl(query, 'optionsSearch'),
        location: this.state.locationSearch,
      }),
    }));
  };

  handleChangePagination = (page) => {
    const {optionsSearch, locationSearch} = this.state;
    router.push({
      pathname: '/homes/search',
      query: buildQuerySearch({
        page,
        ...optionsSearch,
        location: locationSearch,
      }),
    })
  };

  handleLoadMore = () => {
    const {scrollData} = this.state;
    if (scrollData.scrollId) {
      new ES('rooms').roomsSearch({
        params: {
          scrollId: scrollData.scrollId,
          isShowMap: this.state.isShowMap
        }
      }).then(response => this.setState({
        scrollData: response.scroll,
        results: this.state.results.concat(response.data)
      }));
    }
  };

  render() {
    const {isMoreFilter, isShowMap, isPopupOpen, optionsSearch, locationSearch} = this.state;
    const {results, metaPage, scrollData, isLoading, isHover} = this.state;
    const {history} = this.props;

    /**
     * Css styling for Card
     * @type {{padding: string, display: string, height: string}}
     */
    const bodyStyle = {
      display: 'flex',
      height: '100%',
      padding: isShowMap ? '0 0 0 24px' : '0 0 0 80px',
    };

    const getMarker = results.map(value => {
      const {lat, lon} = value.dataSearch.coordinates;

      return {
        id: value.id,
        position: {lat: Number(lat), lng: Number(lon)},
        rentPrice: value.dataSearch.rentPrice
      }
    });

    return (
      <Layout className={styles.layout}>
        <div className={styles.fixedHeader}>
          <HomeHeader
            history={history}
            locationQuery={locationSearch}
            handleSearch={this.handleSearch}
            handleChangeLocation={this.handleChangeLocation}/>
          <Card className={styles.cardHeader} bodyStyle={bodyStyle}>
            <FilterSearch
              isShowMap={isShowMap}
              isMoreFilter={isMoreFilter}
              optionsSearch={optionsSearch}
              drawerChanged={checkCompareAdvancedFilter(optionsSearch)}
              handleFilterOpen={this.handleFilterOpen}
              handleOpenDrawerFilter={this.handleOpenDrawerFilter}
              handleChangeOptionSearch={this.handleChangeOptionSearch}/>
          </Card>
        </div>
        <Content className={classNames(styles.container, {
          [styles.isMoreFilter]: isMoreFilter, // add style when show drawer (More filter button)
          [styles.blurContent]: isPopupOpen, // add style when popup filter open
        })}>
          <DrawerFilter
            isMoreFilter={isMoreFilter}
            optionsSearch={optionsSearch}
            handleChangeOptionSearch={this.handleChangeOptionSearch}
            handleOpenDrawerFilter={this.handleOpenDrawerFilter}/>
          <ResultSearch
            results={results}
            metaPage={metaPage}
            isLoading={isLoading}
            scrollData={scrollData}
            filterTags={filterTags(optionsSearch)}
            handleLoadMore={this.handleLoadMore}
            handleChangePagination={this.handleChangePagination}
            onMouseOver={(id) => this.setState({isHover: id})}/>
          {isShowMap &&
          <GoogleMapForm
            isHover={isHover}
            results={results}
            currentMarker={getMarker}/>}
        </Content>
      </Layout>
    );
  }
}

const filterTags = ({price, amenities, roomTypes, gender, capacity, location, radius, area, direction}) => {
  let tags = [];

  if (location.address) {
    tags.push(<Tag color='geekblue'><Icon type='environment' theme='filled'/>&nbsp;{location.address}</Tag>);
    tags.push(<Tag color='geekblue'>Bán kính {radius}km</Tag>);
  }

  if (gender !== defaultState.gender) {
    const genderObj = CONST.GENDER_DEFINE.find(d => d.code === gender);
    genderObj && tags.push(<Tag color='purple'>Phòng cho {genderObj.name}</Tag>);
  }

  if (price[0] !== defaultState.price[0])
    tags.push(<Tag color='blue'>Giá thấp nhất {formatterCurrency(price[0])} VNĐ</Tag>);
  if (price[1] !== defaultState.price[1])
    tags.push(<Tag color='blue'>Giá cao nhất {formatterCurrency(price[1])} VNĐ</Tag>);

  if (capacity[0] !== defaultState.capacity[0])
    tags.push(<Tag color='volcano'>Ít nhất {capacity[0]} người ở</Tag>);
  if (capacity[1] !== defaultState.capacity[1])
    tags.push(<Tag color='volcano'>Tối đa {capacity[1]} người ở</Tag>);

  if (area[0] !== defaultState.area[0])
    tags.push(<Tag color='cyan'>Ít nhất {area[0]} m²</Tag>);
  if (area[1] !== defaultState.area[1])
    tags.push(<Tag color='cyan'>Tối đa {area[1]} m²</Tag>);

  if (direction !== '' && direction !== undefined)
    tags.push(<Tag color='cyan'>Hướng {String(direction).toLowerCase()}</Tag>);

  amenities.forEach(amenitiesId => {
    const obj = LocalStorage.findRoomAmenities(amenitiesId);
    tags.push(<Tag color='orange'>{obj.usableName}</Tag>);
  });

  roomTypes.forEach(roomTypeId => {
    const typeName = LocalStorage.findRoomType(roomTypeId);
    tags.push(<Tag color='green'>{typeName}</Tag>);
  });

  return tags
};

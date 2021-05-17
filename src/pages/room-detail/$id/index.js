import React, {Component} from 'react';
import styles from './index.less';
import {Loader} from 'components';
import RoomDetailImage from '../../../components/Roomdetail/Image';
import BasicInformation from '../../../components/Roomdetail/BasicInformation';
import Amenities from '../../../components/Roomdetail/Amenities';
import Description from '../../../components/Roomdetail/Description';
import Review from '../../../components/Roomdetail/Review';
import SideBox from '../../../components/Roomdetail/SideBox';
import Services from '../../../components/Roomdetail/Services';
import Map from '../../../components/Roomdetail/Map';
import {Col, Divider, Row, Typography} from 'antd';
import router from 'umi/router';
import {API} from 'services';

const {Title, Paragraph} = Typography;

class RoomDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {},
      savedList: [],
      reviewList: [],
      rating: null,
    };
  }

  componentDidMount() {
    const {id} = this.props.match.params;
    if (isNaN(Number(id))) router.push('/404');
    else Promise.all([
      new API('saved-rooms').getAll(),
      new API('roomGroupDetail').get(id)
    ]).then(response => {
      const list = response[0];
      const detail = response[1];
      const savedList = list.length && list.map(value => value.roomGroupId) || [];
      if (detail.responseStatus === 200) this.setState({
        savedList,
        data: detail.data,
        isLoading: false,
        reviewList: detail.data.reviewList,
        rating: detail.data.rating,
      }); else router.push('/404');
    }).catch(error => {
      console.log(error)
    });
  }

  getReview = (reviewList, rating) => {
    this.setState({reviewList: reviewList, rating: rating});
  };

  onChangeSavedList = (id, isDelete = false) => {
    if (isDelete) this.setState({savedList: []});
    else this.setState(({savedList}) => ({savedList: [...savedList, id]}));
  };

  render() {
    const {data, isLoading, savedList, reviewList, rating} = this.state;
    const subTitle = 3;
    const address = () => {
      try {
        const {province, district, ward, location} = data.generalAddress;
        if (province && district && ward && location) return {
          province: JSON.parse(province)[0],
          district: JSON.parse(district)[0],
          ward: JSON.parse(ward)[0],
          location: {
            lat: Number(location.split(',')[0]),
            lng: Number(location.split(',')[1])
          },
        }; else return {location: {}};
      } catch (e) {
        console.log(e);
        return {location: {}};
      }
    };

    if (isLoading) return <Loader/>;
    return (
      <div className={styles.main}>
        <RoomDetailImage
          images={data.images}
          location={address()}
          roomCost={data.roomCost}
          title={data.buildingName}
          roomGroupId={data.roomGroupId}
          onChange={this.onChangeSavedList}
          isSaved={savedList.includes(Number(data.roomGroupId))}/>
        <div className={styles.content}>
          <div className={styles.leftSide}>
            <Row>
              <Col span={24}>
                <div className={styles.titleContainer}>
                  <Paragraph ellipsis={{rows: 3, expandable: false}}>
                    <Title level={2} className={styles.title}>
                      {data.title}
                    </Title>
                  </Paragraph>
                  {data.buildingTypeId !== 3 ?
                    <div style={{marginTop: '15px'}}>
                      {(!!data.direction ? ('Hướng ' + data.direction + ' · ') : '') +
                      (!!data.bathroomQuantity ? (data.bathroomQuantity + ' phòng tắm · ') : '') +
                      (!!data.bedroomQuantity ? (data.bedroomQuantity + ' phòng ngủ ') : '')}
                    </div>
                    : ''
                  }
                </div>
              </Col>
              <Col span={24}><Divider/></Col>
              <Col span={24}>
                <BasicInformation
                  status={data.status}
                  area={data.area}
                  capacity={data.capacity}
                  gender={data.gender}
                  subTitle={subTitle}
                  roomCost={data.roomCost}
                  floorQuantity={data.floorQuantity}
                  buildingTypeId={data.buildingTypeId}/>
              </Col>
              <Col span={24}><Divider/></Col>
              <Col span={24}>
                <Amenities amenities={data.amenities} subTitle={subTitle}/>
              </Col>
              <Col span={24}><Divider/></Col>
              <Col span={24}>
                <Services services={data.services} subTitle={subTitle}/>
              </Col>
              <Col span={24}><Divider/></Col>
              <Col span={24}>
                <Description
                  description={<div dangerouslySetInnerHTML={{__html: data.description}}/>}
                  subTitle={subTitle}/>
              </Col>
              <Col span={24}><Divider/></Col>
              <Col span={24}>
                <Map address={address()} subTitle={subTitle}/>
              </Col>
              <Col span={24}><Divider/></Col>
              <Col span={24}>
                <Review subTitle={subTitle} rating={rating} reviewList={reviewList}
                        roomGroupId={this.props.match.params.id} getReview={this.getReview}/>
              </Col>
              <Col>
                <Col span={24}><Divider/></Col>
              </Col>
            </Row>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.contactBox}>
              <SideBox
                deposit={data.roomCost.deposit} phone={data.hostPhone} buildingTypeId={data.buildingTypeId}
                status={data.status} roomGroupId={this.props.match.params.id}
                avatar={data.hostAvatar} hostName={data.hostName} minDepositPeriod={data.minDepositPeriod}
                hostId={data.hostId} availableRooms={data.availableRooms} allRooms={data.allRooms}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomDetail;

import React, {Component} from 'react';
import {Button, Drawer, message, PageHeader, Menu, Icon, Tooltip, Typography, Divider} from 'antd';
import {
  BuildingUpdateForm,
  RoomGroupUpdateForm,
  BuildingServices,
  RoomAmenities,
  ImageUpdateForm,
  RoomNameUpdate,
  RoomRowV2,
} from 'components';
import {API} from 'services';
import LocalStorage from 'utils/LocalStorage';
import {CONST} from 'utils';
import styles from './index.less';
import router from 'umi/router';

const {SubMenu} = Menu;
const {Text} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: '1',
      buildingTypes: [],
      buildingServices: [],
      amenities: [],
      dataSource: [],
      visible: false,
      currentDrawer: {},
      isLoading: true,
      detailBuilding: '',
      items: [],
      roomNameDrawerId: '',
      listType3: []
    };

    this.building = React.createRef();
    this.roomGroup = React.createRef();
    this.buildingServices = React.createRef();
    this.roomAmenities = React.createRef();
    this.roomImages = React.createRef();
    this.roomNames = React.createRef();
  }

  componentWillMount() {
    /**
     * Listen changed from url
     * Open the login view modal when needed.
     **/
    this.unlisten = this.props.history.listen((location) => {
      const query = location.query;
      if (!isNaN(Number(query.typeId))) this.setState({
        currentTab: query.typeId,
        detailBuilding: query['khu-tro']
      }, () => this.getData(query.typeId, query['khu-tro']));
      else this.getData(this.state.currentTab)
    });
  }

  componentWillUnmount() {
    /**
     * Turn off listen event when this component destroy.
     **/
    this.unlisten();
  }

  componentDidMount() {
    LocalStorage.getBuildingServices().then(buildingServices => this.setState({buildingServices}));
    LocalStorage.getRoomAmenities().then(amenities => this.setState({amenities}));
    new API('buildingKhuTro').getAll()
      .then(response => {
        this.setState({listType3: response, isLoading: false});
      }).catch(error => console.log(error));
  }

  onChangeTab = (key) => {
    this.setState({isLoading: true});
    if (String(key).includes('khu-tro')) router.push(`/host/management/update?typeId=3&${key}`);
    else router.push(`/host/management/update?typeId=${key}`);
  };

  getData = (currentTab, detailBuilding) => new API('building').get(currentTab, true)
    .then(data => {
      if (data.responseStatus === 200) {
        let items = [];
        const dataSource = data.map(value => {
          const roomNames = value.rooms.map(room => room.roomName);
          return {...value, roomNames};
        });

        if (detailBuilding && !isNaN(Number(detailBuilding)))
          items = dataSource.filter(data => String(data.buildingId) === detailBuilding);
        this.setState({dataSource, items, isLoading: false});
      } else this.setState({isLoading: false},
        () => message.error('Lấy thông tin phòng thất bại !'));
    });

  onClose = () => {
    this.setState({visible: false}, () => {
      router.push(`${window.location.pathname}${window.location.search}`);
    });
  };

  showDrawer = (currentDrawer, roomNameDrawerId) => this.setState({visible: true, currentDrawer, roomNameDrawerId});
  onChange = (dataChanged) => this.setState(({currentDrawer}) => ({currentDrawer: {...currentDrawer, ...dataChanged}}));

  submitForm = () => {
    // this.setState({isLoading: true});
    const {currentDrawer} = this.state;

    switch (currentDrawer.type) {
      case CONST.AMENITIES_DRAWER:
        this.roomAmenities.current.handleSubmit();
        break;
      case CONST.SERVICES_DRAWER:
        this.buildingServices.current.handleSubmit();
        break;
      case CONST.BUILDING_DRAWER:
        this.building.current.handleSubmit();
        break;
      case CONST.ROOM_GROUP_DRAWER:
        this.roomGroup.current.handleSubmit();
        break;
      case CONST.IMAGES_DRAWER:
        this.roomImages.current.handleSubmit();
        break;
      case CONST.ROOM_NAME_DRAWER:
        this.roomNames.current.validateFields((err, values) => {
          if (err) message.error('Lỗi nhập thông tin !');
          else {
            const {roomNameDrawerId} = this.state;
            const {existRooms, newRooms, deleteRooms} = values;
            const createRooms = newRooms && newRooms.map(n => ({
              roomGroupId: roomNameDrawerId,
              roomName: n
            })).filter(r => r !== null);
            const updateRooms = existRooms.map((r, i) => !deleteRooms[i] ? {
              roomId: i,
              roomName: r,
              roomStatus: -1
            } : {roomId: i, roomName: r}).filter(r => r !== null);

            new API('room').update({
              id: 'update/list',
              data: {updateRooms, createRooms}
            }).then((response) => {
              this.onClose();
              this.roomNames.current.setFieldsValue({keys: []});
              if (response.responseStatus === 200) message.success('Cập nhật danh sách phòng thành công !');
              else message.error('Có lỗi xảy ra, hãy thử lại sau !');
            }).catch(err => {
              this.onClose();
              console.log(err);
              message.error('Có lỗi xảy ra, hãy thử lại sau !');
            });
          }
        });
        break;
      default:
        break;
    }
  };

  render() {
    const {
      items,
      detailBuilding,
      buildingServices,
      amenities,
      dataSource,
      isLoading,
      currentTab,
      visible,
      currentDrawer,
      roomNameDrawerId,
      listType3
    } = this.state;

    const content = () => {
      console.log(items);
      return <RoomRowV2
        isKhuTro={currentTab === '3'}
        dataSource={detailBuilding ? items : dataSource}
        isLoading={isLoading}
        buildingServices={buildingServices}
        amenities={amenities}
        showDrawer={this.showDrawer}/>;
    };

    const headerAction = () => {
      if (detailBuilding && items.length > 0) {

        const detailAddress = (building) => {
          const {ward, district, province} = building;
          return `${JSON.parse(ward)[0]}, ${JSON.parse(district)[0]}, ${JSON.parse(province)[0]}`;
        };

        return (
          <div>
            <Text strong>Địa chỉ:</Text>&nbsp;<Icon type='environment'/>&nbsp;{detailAddress(items[0].building)}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            &nbsp;<a onClick={() => this.showDrawer({
            type: CONST.BUILDING_DRAWER,
            item: {building: items[0].building}
          })}>
            <Tooltip title='Cập nhật'><Icon type='edit'/></Tooltip>
          </a>
            <Divider type='vertical'/>
            <Button
              type='link'
              style={{padding: 0}}
              onClick={() => router.push(`/host/management/${detailBuilding}/add`)}>
              <Icon type="plus-square"/>&nbsp;Thêm loại phòng trọ mới
            </Button>
          </div>
        )
      } else return <div/>;
    };

    const renderComponent = () => {
      const {type, item} = currentDrawer;
      if (type === CONST.AMENITIES_DRAWER) return {
        title: 'Cập nhật tiện ích',
        Component: <RoomAmenities
          ref={this.roomAmenities}
          amenities={amenities}
          roomGroupId={item.id}
          roomAmenities={item.roomAmenities}
          onClose={this.onClose}/>
      };
      if (type === CONST.SERVICES_DRAWER) return {
        title: 'Cập nhật dịch vụ',
        Component: <BuildingServices
          ref={this.buildingServices}
          buildingId={item.buildingId}
          fields={item.buildingServices}
          buildingServices={buildingServices}
          onClose={this.onClose}/>
      };
      if (type === CONST.BUILDING_DRAWER) return {
        title: 'Cập nhật địa chỉ',
        Component: <BuildingUpdateForm
          ref={this.building}
          building={item.building}
          onClose={this.onClose}/>
      };
      if (type === CONST.ROOM_GROUP_DRAWER) return {
        title: 'Cập nhật thông tin phòng',
        Component: <RoomGroupUpdateForm
          ref={this.roomGroup}
          roomGroup={item}
          onClose={this.onClose}/>
      };
      if (type === CONST.IMAGES_DRAWER) return {
        title: 'Cập nhật hình ảnh',
        Component: <ImageUpdateForm
          ref={this.roomImages}
          roomGroupId={item.id}
          buildingId={item.buildingId}
          roomImages={item.roomImages}
          onClose={this.onClose}/>
      };
      if (type === CONST.ROOM_NAME_DRAWER) {
        const data = dataSource.filter(d => String(d.building.id) === String(detailBuilding));
        return {
          title: 'Cập nhật danh sách phòng',
          Component: <RoomNameUpdate
            ref={this.roomNames}
            currentKey={0}
            roomNameDrawerId={roomNameDrawerId}
            rooms={data.map(data => data.rooms)}
            onClose={this.onClose}/>
        };
      } else return {};
    };

    return (
      <PageHeader title='Cập nhật thông tin phòng'>
        <div className={styles.main}>
          <div className={styles.leftMenu}>
            <Menu
              style={{width: 256}}
              selectedKeys={currentTab === '3' ? [`khu-tro=${detailBuilding}`] : [currentTab]}
              defaultOpenKeys={currentTab === '3' ? [currentTab] : []}
              mode='inline'
              theme='light'
              onClick={data => this.onChangeTab(data.key)}
            >
              <Menu.Item key="1">
                Căn hộ chung cư
              </Menu.Item>
              <Menu.Item key="2">
                Nhà nguyên căn
              </Menu.Item>
              <SubMenu key="3" title='Khu nhà trọ'>
                {listType3.map(item => {
                  return <Menu.Item key={"khu-tro=" + item.buildingId}>{item.title}</Menu.Item>
                })}
              </SubMenu>
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>
              <div className={styles.titleContent}>{getTitle(currentTab, dataSource, detailBuilding)}</div>
              {headerAction()}
            </div>
            {content()}
          </div>
        </div>
        <Drawer
          title={renderComponent().title}
          width={700}
          closable={false}
          onClose={this.onClose}
          visible={visible}>
          <div className={styles.contentComponent}>
            {renderComponent().Component}
          </div>
          <div className={styles.footer}>
            <Button size='large' type="link" style={{marginRight: 8}} onClick={this.onClose}>Thoát</Button>
            <Button size='large' type="primary" onClick={this.submitForm}>Cập nhật</Button>
          </div>
        </Drawer>
      </PageHeader>
    );
  }
}

const getBuilding = (dataSource, buildingId) => {
  const items = dataSource.filter(data => String(data.buildingId) === String(buildingId));
  return items[0] && items[0].building;
};

const getTitle = (currentTab, dataSource, buildingId) => {
  if (currentTab === '1') return 'Căn hộ chung cư';
  else if (currentTab === '2') return 'Nhà nguyên căn';
  else if (!buildingId) return 'Khu nhà trọ';
  else {
    const building = getBuilding(dataSource, buildingId);
    return building ? `Khu nhà trọ > ${building.buildingName}` : '';
  }
};

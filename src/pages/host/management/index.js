import React from 'react';
import {Spin, Menu, Typography, message, PageHeader} from 'antd';
import RoomGroupList from "../../../components/Management";
import {API} from 'services';
import router from "umi/router";

const {SubMenu} = Menu;
const {Title} = Typography;

class Management extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      currentKey: 1,
      isLoading: false,
      isLoadingListRoom: false,
      listData: [],
      listRoom: []
    }
  }

  componentWillMount() {
    /**
     * Listen changed from url
     * Open the login view modal when needed.
     **/
    this.unlisten = this.props.history.listen((location) => {
      const query = location.query;
      this.setState({
        currentKey: query.typeId ? query.typeId : '1',
      }, () => this.callApi(query.typeId ? query.typeId : '1'));
    });
  }

  componentWillUnmount() {
    /**
     * Turn off listen event when this component destroy.
     **/
    this.unlisten();
  }

  componentDidMount() {
    new API('buildingKhuTro').getAll()
      .then(response => {
        this.setState({listData: response, isLoading: false});
        this.callApi(this.state.currentKey);
      }).catch(error => console.log(error));
  }

  /* get list room based on buildingTypeId */

  callApi = (currentKey) => {
    if (!currentKey) return;
    new API('management/getListRoom').get(currentKey)
      .then(response => {
        if (response.responseStatus === 200) this.setState({
          listRoom: response,
          isLoadingListRoom: false,
        }); else this.setState({
          isLoadingListRoom: false
        }, () => message.error('Có lỗi xảy ra, vui lòng thử lại sau !'));
      }).catch(error => {
      console.log(error);
      this.setState({
        isLoadingListRoom: false
      }, () => message.error('Có lỗi xảy ra, vui lòng thử lại sau !'));
    })
  };

  onSelect = (data) => {
    if (!data.key) return;
    const formatKey = String(data.key).replace('bt-', '');
    const reFormat = String(formatKey).replace('khu-tro', '3');
    this.setState({currentKey:reFormat})
    router.push(`/host/management/?typeId=${reFormat}`);
  };

  render() {
    const {currentKey, isLoading, listData, listRoom, isLoadingListRoom} = this.state;

    if (isLoading) return <Spin spinning={true}/>;
    return (
      <PageHeader title='Quản lý phòng cho thuê'>
        <div style={{display: 'flex'}}>
          <Menu
            style={{width: 256}}
            selectedKeys={[formatKey(currentKey)]}
            defaultOpenKeys={[String(currentKey).includes('3-') ? '3' : '']}
            onOpenChange={(d) => console.log(d)}
            mode='inline'
            theme='light'
            onClick={this.onSelect}>
            <Menu.Item key="bt-1">
              Căn hộ chung cư
            </Menu.Item>
            <Menu.Item key="bt-2">
              Nhà nguyên căn
            </Menu.Item>
            <SubMenu key="3" title={<Spin spinning={isLoading}>Khu nhà trọ</Spin>}>
              {listData.map(item => {
                return <Menu.Item key={"khu-tro-" + item.buildingId}>{item.title}</Menu.Item>
              })}
            </SubMenu>
          </Menu>
          <div style={{padding: '0 24px 24px 24px', width: 'calc(100% - 256px)'}}>
            <RoomGroupList listRoom={listRoom} isLoading={isLoadingListRoom} currentKey={currentKey}/>
          </div>
        </div>
      </PageHeader>
    );
  }
}

export default Management;

const formatKey = (key) => {
  if (key === '1' || key === '2') return `bt-${key}`;
  else return `khu-tro-${String(key).replace('3-', '')}`
};

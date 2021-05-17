import React from 'react';
import {Spin, Typography, Menu, PageHeader, message} from 'antd';
import MyRoomList from "../../components/MyRoom";
import {API} from 'services';
import router from 'umi/router';

const {Title} = Typography;

class MyRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      currentKey: '1',
      listRoom: [],
      isLoading: false,

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

  callApi = (currentKey) => {
    new API('myRoom/getListRoom').get(currentKey)
      .then(response => {
        if (response.responseStatus === 200) this.setState({
          isLoading: false,
          currentKey,
          listRoom: response
        }); else this.setState({
          isLoading: false
        }, () => message.error('Có lỗi xảy ra, xin vui lòng thử lại sau !'));
      })
      .catch(error => this.setState({
        isLoading: false
      }, () => console.log(error)));
  };

  onSelect = (keys) => this.setState({
    currentKey: keys[0],
    isLoading: true
  }, () => this.callApi(keys[0]));

  render() {
    const {currentKey, isLoading, listRoom} = this.state;
    const title = currentKey === '1' ? 'Phòng đã thuê' : currentKey === '2' ?
      'Phòng đang thuê' : currentKey === '3' ? 'Phòng quan tâm' : 'Phòng đang liên hệ';

    return (

      <PageHeader title='Phòng của tôi'>
        <div style={{display: 'flex'}}>
          <Menu
            style={{width: 256}}
            selectedKeys={[currentKey]}
            mode='inline'
            theme='light'
            onClick={data => router.push(`/my-rooms?typeId=${data.key}`)}>
            <Menu.Item key="1">
              Phòng đã thuê
            </Menu.Item>
            <Menu.Item key="2">
              Phòng đang thuê
            </Menu.Item>
            <Menu.Item key="3">
              Phòng đang quan tâm
            </Menu.Item>
            <Menu.Item key="4">
              Phòng đang liên hệ
            </Menu.Item>
          </Menu>
          <div style={{padding: '0 24px 24px 24px', width: 'calc(100% - 256px)'}}>
            <Title level={4}>{title}</Title>
            <Spin spinning={isLoading}>
              <MyRoomList keySent={currentKey} listRoom={listRoom}/>
            </Spin>
          </div>
        </div>
      </PageHeader>
    );
  }

}

export default MyRoom;

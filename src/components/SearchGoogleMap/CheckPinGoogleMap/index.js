import React from 'react';
import {Typography} from 'antd';
import GoogleMap from './GoogleMap';

const {Title, Text} = Typography;

export default ({location, detailedAddress, handleFormChange}) => {
  return (
    <div>
      <Title level={4}>Bản đồ đã ghim đúng địa điểm mà bạn nhập chưa?</Title>
      <Text>Nếu cần, bạn có thể điều chỉnh bản đồ để ghim ở đúng vị trí. Xác nhận đúng địa điểm sẽ giúp cho khách thuê
        tìm thấy khu trọ của bạn một cách dễ dàng.</Text>
      <div style={{marginTop: '32px'}}>
        <Text strong>{detailedAddress.value}</Text>
        <GoogleMap location={location} handleFormChange={handleFormChange}/>
      </div>
    </div>
  );
}

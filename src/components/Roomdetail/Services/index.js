import React, {Component} from 'react';
import {Card, List, Typography} from 'antd';
import {formatterCurrency} from '../../../utils/index'
import styles from './index.less';
import SvgIcon from '../../../assets/icons/services';

const {Title} = Typography;

class Services extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const services = this.props.services;
    return (
      <div>
        <Title level={this.props.subTitle}>Dịch vụ</Title>
        {services.length > 0 ?
          <List size='middle'
                grid={{gutter: 20, xs: 1, sm: 2, lg: 3}}
                dataSource={services}
                renderItem={item => (
                  <List.Item>
                    <Card className={styles.serviceContainer} title={
                      <div>
                        {<img alt="example" src={SvgIcon.find(element => element.code == item.icon_id).content}/>}
                        <span className={styles.serviceName}>{item.service_name}</span>
                      </div>}>
                      {!!item.service_price && <p className={styles.servicePrice}>Giá:
                        {' '+(formatterCurrency(item.service_price)) + ' VNĐ'}</p>}
                      {!!item.note && <p>Ghi chú: {item.note}</p>}
                    </Card>
                  </List.Item>
                )}/>
          : <div>Phòng không có dịch vụ</div>
        }
      </div>
    );
  }
}

export default Services;

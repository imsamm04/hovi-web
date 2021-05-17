import React, {Component} from 'react';
import {Col, List, Row, Typography} from 'antd';
import styles from './index.less'
import SvgIcon from '../../../assets/icons/amentities';


const {Title} = Typography;

class Amenities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const amenities = this.props.amenities;
    return (
      <div>
        <Title level={this.props.subTitle}>Tiện ích</Title>
        {amenities.length > 0 ?
          <List size='middle'
                grid={{gutter: 20,  xs: 1, sm: 2, lg: 3}}
                dataSource={amenities}
                renderItem={
                  item => (
                    <List.Item>
                      <Row>
                        <Col span={4}><img
                          src={SvgIcon.find(element => element.code === item.amenities_id).content}/></Col>
                        <Col className={styles.name} span={19}>{item.amenities_name}</Col>
                      </Row>
                    </List.Item>
                  )}
          /> : <div>Phòng không có tiện ích</div>
        }
      </div>
    );
  }
}

export default Amenities;

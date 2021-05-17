import React, {Component} from 'react';
import {Checkbox, Col, Row, Typography} from 'antd';
import styles from './index.less';

const {Title, Text} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: true,
      checkAll: false,
    }
  }

  onChange = userSelect => {
    const {amenities} = this.props;
    this.setState({
      indeterminate: !!userSelect.length && userSelect.length < amenities.length,
      checkAll: userSelect.length === amenities.length,
    }, () => this.props.handleFormChange({userSelect}, 'roomAmenitiesFields'));
  };

  onCheckAllChange = e => {
    const {amenities} = this.props;
    const userSelect = e.target.checked ? amenities.map(data => data.id) : [];
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => this.props.handleFormChange({userSelect}, 'roomAmenitiesFields'));
  };

  render() {
    const {indeterminate, checkAll} = this.state;
    const {userSelect, amenities} = this.props;

    const listAmenities = amenities.map((data, index) => {
      return <Col key={index} span={8}>
        <Checkbox style={{whiteSpace: 'pre'}} value={data.id}>
          {data.usableName}
        </Checkbox>
      </Col>;
    });

    return (
      <Row>
        <Col><Title level={4}>Tiện ích</Title></Col>
        <Col className={styles.description}>
          <Text>
            Tích chọn những ô tiện ích mà khách thuê có thể sử dụng.
          </Text>
        </Col>
        <Checkbox
          indeterminate={indeterminate}
          onChange={this.onCheckAllChange}
          checked={checkAll}>
          Chọn tất cả
        </Checkbox>
        <Checkbox.Group
          value={userSelect}
          onChange={this.onChange}>
          <Row>
            {listAmenities}
          </Row>
        </Checkbox.Group>
      </Row>
    );
  }
}

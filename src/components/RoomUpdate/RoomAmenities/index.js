import React, {Component} from 'react';
import {Checkbox, Col, message, Row, Typography} from 'antd';
import {API} from 'services';
import styles from './index.less';

const {Text} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: true,
      checkAll: false,
      userSelect: this.formatData(props.roomAmenities)
    }
  }

  formatData = (roomAmenities) => roomAmenities.map(value => value.amenitiesId);

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({userSelect: this.formatData(nextProps.roomAmenities)});
  }

  onChange = userSelect => {
    const {amenities} = this.props;
    this.setState({
      indeterminate: !!userSelect.length && userSelect.length < amenities.length,
      checkAll: userSelect.length === amenities.length,
    }, () => this.setState({userSelect}));
  };

  onCheckAllChange = e => {
    const {amenities} = this.props;
    const userSelect = e.target.checked ? amenities.map(data => data.id) : [];
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => this.setState({userSelect}));
  };

  handleSubmit = () => {
    const {roomGroupId} = this.props;
    const {userSelect} = this.state;
    new API('roomAmenities').update({
      id: roomGroupId, data: {data: userSelect}
    }).then(data => {
      console.log(data);
      this.props.onClose();
      message.success('Cập nhật thành công');
    }).catch(err => {
      console.log(err)
    })
  };

  render() {
    const {indeterminate, checkAll, userSelect} = this.state;
    const {amenities} = this.props;

    const listAmenities = amenities.map((data, index) => {
      return <Col key={index} span={8}>
        <Checkbox style={{whiteSpace: 'pre'}} value={data.id}>
          {data.usableName}
        </Checkbox>
      </Col>;
    });

    return (
      <Row>
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

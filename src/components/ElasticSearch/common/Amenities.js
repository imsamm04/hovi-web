import React, {Component} from 'react';
import {Button, Checkbox, Col, Row} from 'antd';
import {checkCompareFilter, getDefaultFilter} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import styles from '../FilterSearch/index.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomAmenities: [],
    };
  }

  componentDidMount() {
    LocalStorage.getRoomAmenities().then(roomAmenities => this.setState({roomAmenities}));
  }


  render() {
    const {style, handleSave, amenities, handleChangeState} = this.props;
    const {roomAmenities} = this.state;

    const customStyle = style ? style : {width: '100%'};
    const listAmenities = roomAmenities.map((data, index) => {
      return <Col key={index} span={12}>
        <Checkbox style={{whiteSpace: 'pre'}} value={data.id}>
          {data.usableName}
        </Checkbox>
      </Col>;
    });

    return (
      <Col>
        <Row>
          <Checkbox.Group
            style={customStyle} value={amenities}
            onChange={value => handleChangeState('amenities', value)}>
            <Row>
              {listAmenities}
            </Row>
          </Checkbox.Group>
        </Row>
        <Row>
          {checkCompareFilter(amenities, 'amenities') &&
          <Button type='link'
                  className={styles.resetBtn}
                  onClick={() => handleChangeState('amenities', getDefaultFilter('amenities'))}>Reset</Button>}
          <Button type='link' className={styles.saveBtn}
                  onClick={() => handleSave('amenities', amenities)}>Lưu</Button>
        </Row>
      </Col>
    );
  }
}

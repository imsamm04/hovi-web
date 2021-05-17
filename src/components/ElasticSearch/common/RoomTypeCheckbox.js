import React from 'react';
import {Button, Checkbox, Col, Row} from 'antd';
import LocalStorage from 'utils/LocalStorage';
import styles from '../FilterSearch/index.less';

const CheckboxGroup = Checkbox.Group;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: true,
      checkAll: false,
      roomTypes: [],
    };
  }

  componentDidMount() {
    LocalStorage.getRoomTypes().then(roomTypes => this.setState({roomTypes}));
  }

  onChange = checkedList => {
    const {roomTypes} = this.state;
    this.setState({
      indeterminate: !!checkedList.length && checkedList.length < roomTypes.length,
      checkAll: checkedList.length === roomTypes.length,
    }, () => this.props.handleChangeState('roomTypes', checkedList));
  };

  onCheckAllChange = e => {
    const {roomTypes} = this.state;
    const checkedList = e.target.checked ? roomTypes.map(roomType => roomType.id) : [];

    this.setState({
      indeterminate: false,
      checkAll: e.target.checked,
    }, () => this.props.handleChangeState('roomTypes', checkedList));
  };

  render() {
    const {style, handleSave, checkedList} = this.props;
    const {indeterminate, checkAll, roomTypes} = this.state;
    return (
      <div style={style}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={this.onCheckAllChange}
          checked={checkAll}>
          Tất cả
        </Checkbox>
        <br/>
        <CheckboxGroup
          defaultValue={checkedList}
          value={checkedList}
          onChange={this.onChange}>
          <Row>
            {roomTypes.map((roomType, index) => {
              return <Col key={index} span={12}>
                <Checkbox style={{whiteSpace: 'pre'}}
                          value={roomType.id}>{roomType.type}
                </Checkbox>
              </Col>;
            })}
          </Row>
        </CheckboxGroup>
        <Row><Button
          type='link' className={styles.saveBtn}
          onClick={() => handleSave('roomTypes', checkedList)}>Lưu</Button>
        </Row>
      </div>
    );
  }
}

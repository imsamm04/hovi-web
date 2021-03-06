import React from 'react';
import {Badge, Button, Col, Icon, Popover, Row, Switch} from 'antd/lib/index';
import {checkCompareFilter} from 'utils';
import RangePrice from '../common/RangePrice';
import Amenities from '../common/Amenities';
import RoomType from '../common/RoomTypeCheckbox';
import Capacity from '../common/Capacity';
import classNames from 'classnames';
import styles from './index.less';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
    };
    this.handleFilterOpen = props.handleFilterOpen;
    this.handleOpenDrawerFilter = props.handleOpenDrawerFilter;
    this.handleChangeOptionSearch = props.handleChangeOptionSearch;
  }

  /**
   * When user save filter options search
   * @param field
   * @param value
   */
  handleSave = (field, value) => {
    this.setState({[field]: value, isVisible: false}, () => {
      this.handleFilterOpen(false);
      this.handleChangeOptionSearch({...this.state});
    });
  };

  /**
   * When status of all popup filter search changed
   * @param isVisible
   * @param fieldName
   */
  onVisibleChange = (isVisible, fieldName) => {
    this.handleFilterOpen(isVisible);
    this.setState({isVisible: isVisible ? fieldName : ''}, () => {
      !isVisible && this.handleChangeOptionSearch({...this.state});
    });
  };

  /**
   * When user click show google map
   */
  handleShowMap = () => {
    localStorage.setItem('isShowMap', String(!this.props.isShowMap));
    window.location.reload();
  };

  render() {
    const {isMoreFilter, handleChangeOptionSearch, optionsSearch, isShowMap, drawerChanged} = this.props;
    const {price, amenities, roomTypes, capacity} = optionsSearch;
    const {isVisible} = this.state;

    return (
      <Row type='flex' style={{width: '100%'}}>
        <Row type="flex" justify="start" align="middle" className={classNames({
          [styles.filterSearch]: isShowMap,
          [styles.filterSearch2]: !isShowMap,
        })}>
          <div className={styles.titleFilter}>B??? l???c:</div>
          <PopupFilter name='Gi??'
                       fieldName='price'
                       isVisible={isVisible}
                       isChanged={checkCompareFilter(price, 'price')}
                       onVisibleChange={this.onVisibleChange}>
            <RangePrice
              price={price}
              handleSave={this.handleSave}
              handleChangeState={handleChangeOptionSearch}/>
          </PopupFilter>
          <PopupFilter name='Ti???n ??ch'
                       fieldName='amenities'
                       isVisible={isVisible}
                       isChanged={checkCompareFilter(amenities, 'amenities')}
                       onVisibleChange={this.onVisibleChange}>
            <Amenities
              style={{width: '280px'}}
              amenities={amenities}
              handleChangeState={handleChangeOptionSearch}
              handleSave={this.handleSave}/>
          </PopupFilter>
          <PopupFilter name='Lo???i ph??ng'
                       fieldName='roomTypes'
                       isVisible={isVisible}
                       isChanged={checkCompareFilter(roomTypes, 'roomTypes')}
                       onVisibleChange={this.onVisibleChange}>
            <RoomType
              style={{width: '280px'}}
              checkedList={roomTypes}
              handleSave={this.handleSave}
              handleChangeState={handleChangeOptionSearch}/>
          </PopupFilter>
          <PopupFilter name='S??? ng?????i ???'
                       fieldName='capacity'
                       isVisible={isVisible}
                       isChanged={checkCompareFilter(capacity, 'capacity')}
                       onVisibleChange={this.onVisibleChange}>
            <Capacity
              capacity={capacity}
              handleSave={this.handleSave}
              handleChangeState={handleChangeOptionSearch}/>
          </PopupFilter>
          <Col className={styles.popover}>
            {!drawerChanged ?
              <Badge color="#f50">
                <Button
                  type={isMoreFilter ? 'primary' : 'default'}
                  onClick={this.handleOpenDrawerFilter}>N??ng cao</Button>
              </Badge> :
              <Button
                type={isMoreFilter ? 'primary' : 'default'}
                onClick={this.handleOpenDrawerFilter}>N??ng cao</Button>}
          </Col>
        </Row>
        <div className={classNames({
          [styles.switch]: isShowMap,
          [styles.switch2]: !isShowMap,
        })}>
          <div className={styles.titleSwitch}>Hi???n th??? b???n ?????</div>
          <Switch
            checkedChildren={<Icon type="check"/>}
            unCheckedChildren={<Icon type="close"/>}
            checked={isShowMap}
            onChange={this.handleShowMap}
          />
        </div>
      </Row>
    );
  }
}

const PopupFilter = ({children, isVisible, onVisibleChange, isChanged, name, fieldName}) => {
  return (
    <Col className={styles.popoverCol}>
      <Popover
        getPopupContainer={trigger => trigger.parentNode}
        placement='topLeft' trigger="click" visible={isVisible === fieldName}
        onVisibleChange={value => onVisibleChange(value, fieldName)} content={children}>
        {isChanged ?
          <Badge color="#f50"><Button type={isVisible === fieldName ? 'primary' : 'default'}>{name}</Button></Badge> :
          <Button type={isVisible === fieldName ? 'primary' : 'default'}>{name}</Button>}
      </Popover>
    </Col>
  );
};

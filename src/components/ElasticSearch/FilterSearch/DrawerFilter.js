import React from 'react';
import {Button, Col, Divider, Drawer, Icon, InputNumber, Radio, Row, Select, Typography} from "antd";
import Autocomplete from '../LocationSearch/index.v2';
import AreaFilter from '../common/Area';
import {CONST} from 'utils';
import styles from './DrawerFilter.less';

const {Option} = Select;
const {Text} = Typography;

export default ({isMoreFilter, optionsSearch, handleChangeOptionSearch, handleOpenDrawerFilter}) => {
  return (
    <Drawer
      title={null}
      width={700}
      placement="left"
      closable={false}
      getContainer={false}
      visible={isMoreFilter}
      style={{position: 'absolute'}}
      bodyStyle={{borderTop: '1px solid rgba(0, 0, 0, 0.03)'}}
      maskStyle={{background: 'rgba(255, 255, 255, 0.7)'}}>
      <div>
        <Text underline>Tìm kiếm xung quanh địa điểm với Google Map</Text>
        <Row className={styles.row}>
          <Col span={8} className={styles.titleCol}><Text>Địa điểm</Text></Col>
          <Col span={16}>
            <Autocomplete
              {...optionsSearch.location}
              handleChangeOptionSearch={handleChangeOptionSearch}/>
          </Col>
        </Row>
        <Row className={styles.row}>
          <Col span={8} className={styles.titleCol}><Text>Bán kính tìm kiếm</Text></Col>
          <Col span={16}>
            <InputNumber
              step={0.5}
              min={0.5}
              size='large'
              defaultValue={optionsSearch.radius}
              onChange={value => handleChangeOptionSearch('radius', value)}/>
            &nbsp;km
          </Col>
        </Row>
        <Divider/>
        <Row className={styles.row}>
          <Col span={8} className={styles.titleCol}><Text>Diện tích (phòng / căn nhà)</Text></Col>
          <Col span={16}>
            <AreaFilter
              area={optionsSearch.area}
              handleChangeOptionSearch={handleChangeOptionSearch}/>
          </Col>
        </Row>
        <Divider/>
        <Icon theme="twoTone" twoToneColor="#faad14" type='warning'/>
        &nbsp;<Text underline>Dành cho kiểu phòng căn hộ chung cư hoặc nhà nguyên căn !</Text>
        <Row className={styles.row}>
          <Col span={8} className={styles.titleCol}><Text>Hướng nhà</Text></Col>
          <Col span={16}>
            <Select
              allowClear
              size='large'
              defaultValue={optionsSearch.direction}
              className={styles.directionSelect}
              onChange={value => handleChangeOptionSearch('direction', value)}>
              {CONST.DIRECTION.map((value, index) => <Option key={index} value={value}>{value}</Option>)}
            </Select>
          </Col>
        </Row>
        <Divider/>
        <Icon theme="twoTone" twoToneColor="#faad14" type='warning'/>
        &nbsp;<Text underline>Dành cho kiểu phòng khu nhà trọ !</Text>
        <Row className={styles.row}>
          <Col span={8}><Text>Giới tính</Text></Col>
          <Col span={16}>
            <Radio.Group
              defaultValue={optionsSearch.gender}
              onChange={e => handleChangeOptionSearch('gender', e.target.value)}>
              <Radio value={2}>Tất cả</Radio>
              <Radio value={1}>Nam</Radio>
              <Radio value={0}>Nữ</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <div className={styles.footer}>
          <div className={styles.btnFooter}>
            <Button
              type='primary'
              size='large'
              onClick={handleOpenDrawerFilter}>
              Lưu tùy chọn tìm kiếm
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

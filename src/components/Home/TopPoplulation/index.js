import React, {Component} from 'react';
import {ES} from 'services';
import {formatterCurrency, buildQuerySearch} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import router from 'umi/router';
import styles from "./index.less";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    }
  }

  componentDidMount() {
    this.getData();
  };

  getData = () => {
    new ES('rooms').roomsSuggest({
      params: {
        areaName: 'district'
      }
    }).then(response => {
      let promise = [];
      response && response.map(item => promise.push(LocalStorage.findDistrictById(item.area.key)));
      Promise.all(promise).then(data => {
        const dataSource = data.map((location, index) => {
          return {
            location,
            avgPrice: response[index].avgPrice,
            count: response[index].area.doc_count
          }
        });
        this.setState({dataSource});
      });
    }).catch(err => {
      console.log(err)
    });
  };

  render() {
    const {dataSource} = this.state;

    return (
      <div style={{marginBottom: '30px'}}>
        <div className={styles.title}>Khu vực phổ biến</div>
        <div className={styles.list}>
          {dataSource && dataSource.map(item => {
            const {id, name, province} = item.location;
            const params = [[province.name, province.id], [name, id]];
            return (
              <div
                onClick={() => router.push({
                  pathname: '/homes/search',
                  query: buildQuerySearch({location: params}),
                })}
                className={styles.item}>
                <img
                  id='image'
                  className={styles.image}
                  src={`https://source.unsplash.com/featured/?hanoi&?sig=${Math.random()}`} alt='house'/>
                <div className={styles.itemName}>{item.location.name} ({item.count} phòng)</div>
                <div className={styles.itemPrice}>
                  Giá trung bình {formatterCurrency(Math.round(item.avgPrice))} VNĐ
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

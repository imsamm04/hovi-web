import React, {Component} from 'react';
import {Layout} from "antd";
import styles from './index.less';

const {Footer} = Layout;
export default class extends Component {

  render() {
    return (
      <Footer className={styles.footer}>
        <div>

        </div>
        <div className={styles.copyright}>
          Homo House ©2019 Created by Hovi Team Development
        </div>
      </Footer>
    )
  }
}

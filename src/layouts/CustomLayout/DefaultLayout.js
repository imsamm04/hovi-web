import React, {Component} from 'react';
import {Layout} from 'antd/lib/index';
import {HomeHeader, Loader} from 'components';
import {buildQuerySearch, getPartUrl} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import router from 'umi/router';
import styles from './DefaultLayout.less';

const {Content} = Layout;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: getPartUrl(props.history.location.query),
      currentUser: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    const {isPrivatePage} = this.props;
    LocalStorage.getCurrentUser()
      .then(currentUser => {
        if (isPrivatePage && !currentUser) router.push('/?login=true');
        else this.setState({currentUser, isLoading: false})
      }).catch(() => {
      if (isPrivatePage) router.push('/?login=true');
      else this.setState({isLoading: false});
    });
  }

  /**
   * push location changed into url
   * @param location
   */
  handleChangeLocation = (location) => this.setState({location});

  /**
   * Event on click search button in header
   */
  handleSearch = () => {
    const {location} = this.state;
    const {query} = this.props.history.location;
    // add recently search
    LocalStorage.recentlySearch(location);

    router.push({
      pathname: '/homes/search',
      query: buildQuerySearch({...getPartUrl(query, 'optionsSearch'), location}),
    });
  };

  render() {
    const {children, history} = this.props;
    const {isLoading} = this.state;
    const locationQuery = getPartUrl(history.location.query);

    if (isLoading) return <Loader fullScreen={true}/>;
    else return (
      <Layout className={styles.layout}>
        <div className={styles.fixedHeader}>
          <HomeHeader
            history={history}
            locationQuery={locationQuery}
            handleSearch={this.handleSearch}
            handleChangeLocation={this.handleChangeLocation}/>
        </div>
        <Content className={styles.defaultLayoutContent}>
          {children}
        </Content>
      </Layout>
    );
  }
}

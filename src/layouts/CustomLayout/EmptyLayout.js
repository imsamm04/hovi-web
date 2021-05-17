import React, {Component} from 'react';
import router from 'umi/router';
import {Loader} from 'components';
import LocalStorage from 'utils/LocalStorage'

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    const {isLoading} = this.state;
    const {children} = this.props;

    if (isLoading) return <Loader fullScreen={true}/>;
    return <div>{children}</div>;
  }
}

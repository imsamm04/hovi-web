import React from 'react';
import {Icon, Select, Spin, Button} from 'antd/lib/index';
import {ES} from 'services';
import {removeUnicode} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import styles from './index.less';

const {Option} = Select;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirstLoad: !!props.locationQuery,
      selectLocations: props.locationQuery || [],
      dataSource: [],
      isOpen: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    const {selectLocations} = this.state;
    this.onChange(selectLocations.length);
    this.setState({isFirstLoad: false});
  }

  onChange = (index) => {
    const {selectLocations} = this.state;
    this.props.handleChangeLocation(selectLocations);
    this.setState({isLoading: true});
    if (index === 0) LocalStorage.getLocationProvinces()
      .then(dataSource => this.setState({dataSource, isLoading: false}));
    else if (index === 1) LocalStorage.getDistrictById(selectLocations[0][1])
      .then(dataSource => this.setState({dataSource, isLoading: false}));
    else if (index === 2) new ES('locations/wards').getById(selectLocations[1][1])
      .then(dataSource => this.setState({dataSource, isLoading: false}));
  };

  onSelect = (value) => {
    let {selectLocations} = this.state;
    if (selectLocations.length < 3) {
      selectLocations.push(value);
      this.setState({selectLocations}, () => this.onChange(selectLocations.length));
    }
  };

  onDeselect = (deselectValue) => {
    const {selectLocations} = this.state;
    selectLocations.forEach((value, index) => {
      if (deselectValue[1] === value[1]) {
        index === 0 && this.setState({selectLocations: []},
          () => this.onChange(index));
        index === 1 && this.setState({selectLocations: [selectLocations[0]]},
          () => this.onChange(index));
        index === 2 && this.setState({selectLocations: [selectLocations[0], selectLocations[1]]},
          () => this.onChange(index));
      }
    });
  };

  render() {
    const {selectLocations, dataSource, isLoading, isFirstLoad} = this.state;
    const {placeholder, className, isHomepage} = this.props;
    const maxWidth = isHomepage ? {maxWidth: '135px'} : {};

    let options = dataSource.map(data => <Option key={data.id} value={[data.name, data.id]}>
      {selectLocations.length < 2 ?
        <Icon type="environment" theme='filled' className={styles.icon}/> :
        <Icon type="swap-right" className={styles.icon}/>}
      {data.name}
    </Option>);

    isFirstLoad && selectLocations.forEach((value, index) => {
      options.push(
        <Option key={value[1]} value={value}>
          {index === 0 ?
            <Icon type="environment" theme='filled' className={styles.icon}/> :
            <Icon type="swap-right" className={styles.icon}/>}
          {value[0]}
        </Option>,
      );
    });


    return (
      <Select
        size='large'
        mode="multiple"
        className={className}
        style={{width: '100%'}}
        placeholder={placeholder}
        value={selectLocations}
        maxTagCount={3}
        notFoundContent={isLoading ? <Spin size="small"/> : null}
        onDeselect={this.onDeselect}
        onSelect={this.onSelect}
        filterOption={(inputValue, option) => {
          const formatValue = removeUnicode(option.props.children[1].toLowerCase());
          const compareValue = removeUnicode(inputValue.toLowerCase());
          return formatValue.indexOf(compareValue) !== -1;
        }}
        dropdownRender={(menuNode, props) => {
          let tagChildren =
            props.children.props.children.props.children[0].props.children[1].props
              .children;
          if (tagChildren.length > 0) {
            for (let i = 0; i < tagChildren.length - 1; i++) {
              props.children.props.children.props.children[0].props.children[1].props.children[i]
                = React.cloneElement(
                props.children.props.children.props.children[0].props.children[1]
                  .props.children[i],
                {
                  ...props.children.props.children.props.children[0].props
                    .children[1].props.children[i].props,
                  style: {
                    ...props.children.props.children.props.children[0].props
                      .children[1].props.children[i].props.style,
                    ...maxWidth,
                    marginRight: 0,
                    background: 'transparent',
                    borderColor: 'transparent',
                    paddingLeft: i === 0 ? 5 : 0,
                  },
                  children: [
                    ...props.children.props.children.props.children[0].props
                      .children[1].props.children[i].props.children,
                  ],
                },
              );
              props.children.props.children.props.children[0].props.children[1].props.children[i]
                .props.children[1] = React.cloneElement(
                props.children.props.children.props.children[0].props.children[1]
                  .props.children[i].props.children[1],
                {
                  style: {
                    color: '#ff4d4f',
                    marginLeft: '5px',
                  },
                },
              );
            }
          }
          return <div>{menuNode}</div>;
        }}>
        {options}
      </Select>
    );
  }
}

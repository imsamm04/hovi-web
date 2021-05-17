import React from 'react';
import {List, Pagination, Skeleton, Spin, Typography} from 'antd/lib/index';
import {API} from 'services';
import InfiniteScroll from 'react-infinite-scroller';
import ListItemHorizontal from '../common/ListItemHorizontal';
import ListItemVertical from '../common/ListItemVertical';
import styles from './index.less';
import FilterIcon from '../../../assets/filter-icon.svg';
import LocalStorage from 'utils/LocalStorage';

const {Title} = Typography;

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      savedList: []
    }
  }

  componentDidMount() {
    LocalStorage.getCurrentUser()
      .then(currentUser => {
        if (currentUser) new API('saved-rooms').getAll()
          .then(data => {
            if (data.responseStatus === 200) {
              const savedList = data.map(value => value.roomGroupId);
              this.setState({savedList})
            }
          }).catch(err => {
            console.log(err);
          });
      });
  }

  onChangeSavedList = (id, isDelete = false) => {
    if (isDelete) this.setState(({savedList}) => ({savedList: savedList.filter(rid => String(rid) !== id)}));
    else this.setState(({savedList}) => ({savedList: [...savedList, id]}));
  };

  onChange = (page) => {
    window.scroll({top: 0, left: 0, behavior: 'smooth'});
    this.props.handleChangePagination(page);
  };

  render() {
    const {results, scrollData, metaPage, isLoading, onMouseOver, handleLoadMore, filterTags} = this.props;
    const isShowMap = localStorage.getItem('isShowMap') === 'true';
    const {savedList} = this.state;

    if (isShowMap) return <div className={styles.responsiveMap}>
      <Spin style={{zIndex: 1}} spinning={isLoading}>
        <List size='default' itemLayout='vertical' className={styles.list}>
          {filterTags.length ? <div className={styles.filterTag}>Tags:&nbsp;&nbsp;{filterTags}</div> : <div/>}
          <Title className={styles.resultTitle} level={3}>
            <img src={FilterIcon} alt='filter-icon'/>Tìm thấy {metaPage.total} phòng có thể thuê
          </Title>
          {results.map((item, index) => (
            <ListItemVertical
              key={index}
              item={item}
              isShowMap={isShowMap}
              onMouseOver={onMouseOver}
              images_url={item.dataSearch.roomImages}
              isSaved={savedList.includes(Number(item.id))}
              onChange={this.onChangeSavedList}
              savedData={{
                roomGroupId: item.id,
                name: item.dataSearch.name,
                rentPrice: item.dataSearch.rentPrice
              }}/>
          ))}
        </List>
        {metaPage.page && metaPage.total_page > 1 &&
        <div className={styles.pagination}>
          <Pagination
            total={metaPage.total}
            defaultCurrent={metaPage.page}
            onChange={this.onChange}/>
        </div>}
      </Spin>
    </div>;
    else return <div style={{width: '100%'}}>
      <List
        size='default'
        itemLayout='vertical'
        className={styles.list2}
        grid={{xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5,}}>
        {filterTags.length ? <div className={styles.filterTag}>Tags:&nbsp;&nbsp;{filterTags}</div> : <div/>}
        <Title className={styles.resultTitle} level={3}>
          <img src={FilterIcon} alt='filter-icon'/>Tìm thấy {scrollData.total} phòng có thể thuê
        </Title>
        <InfiniteScroll
          pageStart={0}
          loadMore={handleLoadMore}
          hasMore={results.length !== scrollData.total}
          loader={<Skeleton active title={false} paragraph={{rows: 5, width: 'auto'}}/>}>
          {results.map((item, index) => <ListItemHorizontal
            key={index}
            item={item}
            savedList={savedList}
            onChange={this.onChangeSavedList}/>)}
        </InfiniteScroll>
      </List>
    </div>
  }
};

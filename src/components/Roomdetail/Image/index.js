import React, {Component} from 'react';
import {Button, Icon, Modal} from 'antd';
import SavedList from '../../common/SavedList';
import Slider from 'react-slick';
import styles from './index.less';
import MagicSliderDots from '../../common/MagicSliderDots';
import classNames from 'classnames';
import LocalStorage from 'utils/LocalStorage';
import NotFoundImage from '../../../assets/not-found.png';
import router from 'umi/router';

const DotsProps = {
  dotContainerClassName: 'magic-dots slick-dots',
  activeDotClassName: 'slick-active',
  prevNextDotClassName: 'small'
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onHover: false,
      isCopy: false,
      isShareModal: false
    };

    this.savedList = React.createRef();
  }

  handleOnHover = (onHover) => this.setState({onHover});
  handleShare = (isShareModal) => this.setState({isShareModal});
  handleOnCopy = () => {
    const textField = document.createElement('textarea');
    textField.innerText = window.location.href;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
    this.setState({isCopy: true}, () => {
      setTimeout(() => {
        this.setState({isCopy: false});
      }, 3000);
    });
  };

  handleSavedList = () => {
    LocalStorage.getCurrentUser().then(user => {
      if (user) this.savedList.current.handleToggle();
      else router.push(`${window.location.pathname}?login=true`);
    });
  };

  render() {
    const {onHover, isCopy, isShareModal} = this.state;
    const {images, roomCost, title, location, roomGroupId, isSaved, onChange} = this.props;
    const shareUrl = window.location.href;

    const NextArrow = (props) => {
      const {className, style, onClick} = props;
      return (
        <div
          className={classNames(className, {
            [styles.nextBtn]: true,
            [styles.nextBtnHover]: onHover
          })}
          style={{...style, ...nextArrowStyles}}
          onClick={onClick}
        />
      );
    };

    const PrevArrow = (props) => {
      const {className, style, onClick} = props;
      return (
        <div
          className={classNames(className, {
            [styles.prevBtn]: true,
            [styles.prevBtnHover]: onHover
          })}
          style={{...style, ...prevArrowStyles}}
          onClick={onClick}
        />
      );
    };

    const settings = {
      dots: true,
      initialSlide: 0,
      variableWidth: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow/>,
      prevArrow: <PrevArrow/>,
      appendDots: (dots) => {
        return <MagicSliderDots dots={dots} numDotsToShow={5} dotWidth={30} {...DotsProps}/>
      }
    };

    let imageId = 1;
    const listImages = images.length ? images.map(image => (
      <div className={styles.imageContainer} key={imageId++}>
        <img className={styles.image} src={image} alt='homo-house'/>
      </div>
    )) : [1, 2, 3, 4].map(key => (
      <div className={styles.imageContainer} key={key}>
        <img className={styles.image} src={NotFoundImage} alt='homo-house'/>
      </div>
    ));

    return (
      <div
        className={styles.mainContent}
        onMouseEnter={() => this.handleOnHover(true)}
        onMouseLeave={() => this.handleOnHover(false)}>
        <Slider {...settings}>
          {listImages}
        </Slider>
        <div>
          <Button
            type={isSaved ? 'danger' : 'default'}
            className={styles.saveBtn}
            onClick={this.handleSavedList}>
            <Icon type='heart'/> Lưu
          </Button>
          <SavedList
            ref={this.savedList}
            isSaved={isSaved}
            onChange={onChange}
            title={title}
            images={images}
            roomGroupId={roomGroupId}
            rentPrice={roomCost.price}
            address={`${location.ward}, ${location.district}, ${location.province}`}/>
        </div>
        <div>
          <Button
            className={styles.shareBtn}
            onClick={() => this.handleShare(true)}>
            <Icon type="share-alt"/> Chia sẻ
          </Button>
          <Modal
            centered
            footer={null}
            title='Chia sẻ'
            visible={isShareModal}
            bodyStyle={{padding: '0 24px'}}
            onCancel={() => this.handleShare(false)}>
            <div>
              <ShareButton
                icon='copy'
                title={isCopy ? 'Đã sao chép' : 'Sao chép đường dẫn'}
                onClick={this.handleOnCopy}/>
              <ShareButton
                icon='facebook'
                title='Facebook'
                url={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}/>
              <ShareButton
                icon='message'
                title='Messenger'
                url={`http://www.facebook.com/dialog/send?app_id=1018625581681284&link=${shareUrl}&redirect_uri=${shareUrl}`}/>
              <ShareButton
                icon='mail'
                title='Email'
                url={`mailto:${shareUrl}`}/>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

const ShareButton = ({title, onClick, icon, url = null}) => {
  const BaseComponent = (
    <div onClick={onClick} className={styles.shareItem}>
      <div className={styles.item}>
        <div className={styles.title}>
          <div className={styles.content}>{title}</div>
        </div>
        <div className={styles.icon}>
          <Icon type={icon} style={{fontSize: '30px'}}/>
        </div>
      </div>
    </div>
  );

  return !url ? BaseComponent : <a
    target='_blank'
    href={url}
    style={{color: '#484848'}}
    rel='noopener noreferrer'>{BaseComponent}</a>;
};

const prevArrowStyles = {
  zIndex: 1,
  display: 'block',
  width: '25%',
  height: '100%',
  left: 0,
};

const nextArrowStyles = {
  zIndex: 1,
  display: 'block',
  width: '25%',
  height: '100%',
  right: 0,
};

import React, {Component} from 'react';
import {Button, Icon} from 'antd';
import Slider from 'react-slick';
import MagicSliderDots from './MagicSliderDots';
import SavedList from './SavedList';
import classNames from 'classnames';
import styles from './Carousel.less';
import NotFoundImage from '../../assets/not-found.png';
import LocalStorage from 'utils/LocalStorage';
import router from 'umi/router';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onHover: false,
    };

    this.savedList = React.createRef();
  }

  handleOnHover = (onHover) => this.setState({onHover});
  handleOnSave = () => {
    LocalStorage.getCurrentUser().then(user => {
      if (user) this.savedList.current.handleToggle();
      else router.push(`${window.location.pathname}?login=true`);
    });
  };

  render() {
    const {onHover} = this.state;
    const {
      images_url,
      onChange,
      onClick,
      width,
      isSaved = false,
      savedData = null,
      isShowMap = false,
      likeButton = false,
      isMessagesPage = false,
      isTransactionPage = false
    } = this.props;

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

    const DotsProps = {
      dotContainerClassName: 'magic-dots slick-dots',
      activeDotClassName: 'slick-active',
      prevNextDotClassName: 'small'
    };

    const settings = {
      dots: true,
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

    const formatSavedData = () => {
      if (!savedData) return {};
      else {
        const {roomGroupId, name, rentPrice} = savedData;
        const title = name.toString().split(' - ')[0];
        const address = name.toString().split(' - ')[1];
        return {
          title,
          address,
          rentPrice,
          roomGroupId,
          images: images_url
        }
      }
    };

    return (
      <div style={{
        width,
        padding: isShowMap || isTransactionPage ? 0 : '5px',
        borderRadius: '5px !important',
      }}>
        <div
          className={styles.mainContent}
          onMouseEnter={() => this.handleOnHover(true)}
          onMouseLeave={() => this.handleOnHover(false)}>
          <Slider {...settings}>
            {!images_url.length && <img
              onClick={onClick}
              src={NotFoundImage}
              className={classNames(styles.image, {
                [styles.isMessagesPage]: isMessagesPage,
                [styles.isTransactionPage]: isTransactionPage,
              })} alt='homo-house'/>}
            {images_url.map((url, index) => <img
              onClick={onClick}
              key={index}
              src={url}
              className={classNames(styles.image, {
                [styles.isMessagesPage]: isMessagesPage,
                [styles.isTransactionPage]: isTransactionPage,
              })} alt='homo-house'/>)}
          </Slider>
        </div>
        {likeButton && savedData && (
          <div>
            <Button
              type='link'
              className={styles.likeBtn}
              onClick={this.handleOnSave}>
              {isSaved ?
                <Icon
                  type="heart"
                  theme="twoTone"
                  twoToneColor="#eb2f96"
                  className={styles.likeIcon}/> :
                <Icon
                  type="heart"
                  theme="twoTone"
                  twoToneColor="rgb(72, 72, 72);"
                  className={styles.likeIcon}/>}
            </Button>
            <SavedList ref={this.savedList} {...formatSavedData()} isSaved={isSaved} onChange={onChange}/>
          </div>
        )}
      </div>
    );
  }
}

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


import React, {Component} from 'react';
import {Button} from 'antd';
import Slider from 'react-slick';
import MagicSliderDots from 'components/common/MagicSliderDots';
import classNames from 'classnames';
import NotFoundImage from 'assets/not-found.png';
import styles from './Carousel.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onHover: false,
    };
  }

  handleOnHover = (onHover) => this.setState({onHover});

  render() {
    const {onHover} = this.state;
    const {images_url, width, handleUpdate} = this.props;

    const DotsProps = {
      dotContainerClassName: 'magic-dots slick-dots',
      activeDotClassName: 'slick-active',
      prevNextDotClassName: 'small'
    };

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

    return (
      <div style={{width, borderRadius: '5px !important'}}
           onMouseEnter={() => this.handleOnHover(true)}
           onMouseLeave={() => this.handleOnHover(false)}>
        <Slider {...settings}>
          {!images_url.length && <img
            src={NotFoundImage}
            className={styles.image}
            alt='homo-house'/>}
          {images_url.map((url, index) => <img key={index} src={url} className={styles.image} alt='homo-house'/>)}
        </Slider>
        <Button
          className={styles.likeBtn}
          onClick={handleUpdate}>
          Cập nhật hình ảnh
        </Button>
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

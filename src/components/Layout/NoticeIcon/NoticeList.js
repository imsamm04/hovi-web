import React from 'react';
import {Avatar, List, Typography, Icon} from 'antd';
import {timestampToDateTime} from 'utils';
import classNames from 'classnames';
import styles from './NoticeList.less';

const {Paragraph} = Typography;

export default function NoticeList(
  {
    data = [],
    onClick,
    onClear,
    title,
    locale,
    emptyText,
    emptyImage,
    onViewMore = null,
    showClear = false,
    showViewMore = true,
  }) {

  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found"/> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          if (i >= 5) return <div/>;

          const avatar = item.receiver ? item.receiver.avatar : null;

          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = avatar ?
            typeof avatar === 'string' ?
              <Avatar className={styles.avatar} src={avatar}/> :
              <span className={styles.iconElement}>{avatar}</span> : null;

          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    <Paragraph
                      strong
                      ellipsis={{rows: 1, expandable: false}}
                      className={classNames(styles.paragraph, {
                        [styles.report]: item.description.type === 'REPORT'
                      })}>
                      {item.description.type === 'REPORT' && <div><Icon type="warning"/>&nbsp;</div>}{item.title}
                    </Paragraph>
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>
                      <Paragraph
                        className={styles.paragraph}
                        ellipsis={{rows: 2, expandable: false}}>
                        {item.description.content}
                      </Paragraph>
                    </div>
                    <div className={styles.datetime}>{timestampToDateTime(item.timestamp)}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {locale.clear} {locale[title] || title}
          </div>
        ) : null}
        {showViewMore ? <div onClick={onViewMore}>{locale.viewMore}</div> : null}
      </div>
    </div>
  );
}

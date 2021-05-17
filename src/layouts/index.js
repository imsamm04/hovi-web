import React from 'react';
import HomeLayout from './CustomLayout/HomeLayout';
import EmptyLayout from './CustomLayout/EmptyLayout';
import DefaultLayout from './CustomLayout/DefaultLayout';

export default ({children, history}) => {
  const {pathname} = window.location;
  const isHomePage = pathname === '/';
  const isSearchPage = pathname.includes('/homes/search');
  const isBecomeAHost = pathname.includes('/become-a-host');
  const isUpdatePage = `${pathname.substring(0, 17)}${pathname.substring(pathname.lastIndexOf("/") + 1, pathname.length)}`.includes('/host/management/add');

  const isPrivatePage = () => {
    return pathname.includes('/messages') ||
      pathname.includes('/host/management') ||
      pathname.includes('/become-a-host') ||
      pathname.includes('/users/settings') ||
      pathname.includes('/my-rooms') ||
      pathname.includes('/users/show/') ||
      pathname.includes('/notification')
  };

  if (isHomePage) return <HomeLayout {...{history, children}}/>;
  else if (isBecomeAHost || isSearchPage || isUpdatePage)
    return <EmptyLayout isPrivatePage={isPrivatePage()} {...{
      history,
      children
    }}/>;
  else return <DefaultLayout isPrivatePage={isPrivatePage()} {...{history, children}}/>;
}

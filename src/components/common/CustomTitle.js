import React from 'react';

export default ({children}) => {
  return <h1 style={{
    fontSize: '30px',
    lineHeight: '36px',
    letterSpacing: 'normal',
    fontFamily: 'inherit',
    textTransform: 'undefined',
    color: '#484848',
    paddingTop: '6px',
    paddingBottom: '6px',
    margin: ' 0px',
    padding: ' 0px',
    fontWeight: 'bold',
  }}>
    {children}
  </h1>;
}

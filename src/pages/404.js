import {Button, Result} from 'antd';
import React from 'react';
import {router} from 'umi';

export default () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
      style={{height: '100vh'}}
      extra={
        <Button type="primary" onClick={() => router.go(-2)}>
          Quay lại
        </Button>
      }
    />
  );
};

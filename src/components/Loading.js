import { Spin } from 'antd';
import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="w-full h-full min-h-[80vh] flex justify-center items-center">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 50 }} />}
        size="large"
      />
    </div>
  );
}
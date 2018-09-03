import React, { Component, PureComponent } from 'react';
import {
  Alert,
  Skeleton,
  Card,
  Icon,
  Avatar
} from 'antd';

const { Meta } = Card;

import './Home.scss';

/**
 * 主页
 */
export default class HomePage extends (PureComponent || Component) {
  constructor(ctx) {
    super(ctx);
    this.state = {
      loading: true
    }
  }

  render(){
    const {loading} = this.state
    const logoImg = require('@images/logo.jpeg')

    return (
      <div>
        <Alert
          message="Ben区块链彩票"
          description="来买买吧，买了可能发财"
          type="info"
        />
        <div className="test-div">ooo</div>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src={logoImg} />}
        >
          <Meta
            title="六合彩"
            description={
              <div>
                <div>管理员地址</div>
                <div>每周三晚上8点开奖</div>
              </div>  
            }
          />
        </Card>
      </div>
    );
  }

}
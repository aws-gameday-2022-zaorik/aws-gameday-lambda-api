#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StackProps } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc';

const baseProps: StackProps = {
  env: {
    account: '',
    region: 'ap-northeast-1'
  }
}

const app = new cdk.App()

new VpcStack(
  app, 'vpcStack',{
    ...baseProps
  }
)

app.synth()
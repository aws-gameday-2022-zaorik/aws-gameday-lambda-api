import { CfnOutput, CfnParameter, Stack, StackProps } from "aws-cdk-lib";
import { FlowLogDestination, FlowLogTrafficType, Vpc } from "aws-cdk-lib/aws-ec2";
import { AccountRootPrincipal } from "aws-cdk-lib/aws-iam";
import { Key } from "aws-cdk-lib/aws-kms";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { BlockPublicAccess, Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";


export class VpcStack extends Stack{
    vpc: Vpc
    vpcIdParameter : StringParameter
    vpcIdCfnOutput : CfnOutput
    flowlogBucket: Bucket
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        this.vpc = new Vpc(this, 'vpc', {
        })

        const key = new Key(this, 'bucketEncryptionKey')
        key.grantAdmin(new AccountRootPrincipal())

        this.flowlogBucket = new Bucket(this, 'flowlogBucket',{
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
            encryption: BucketEncryption.KMS,
            encryptionKey: key
        })

        this.vpc.addFlowLog('flowLogtoS3', {
            destination: FlowLogDestination.toS3(
                this.flowlogBucket
            ),
            trafficType: FlowLogTrafficType.ALL
        })

        this.vpc.addFlowLog('flowLogtoCW', {
            destination: FlowLogDestination.toCloudWatchLogs(
            ),
            trafficType: FlowLogTrafficType.ALL
        })


        //Parameters
        this.vpcIdParameter = new StringParameter(this, 'vpcId', {
            stringValue: this.vpc.vpcId,
            parameterName: 'vpcId'
        })
        this.vpcIdCfnOutput = new CfnOutput(this, 'vpcIdCfnOutput', {
            exportName: 'vpcId',
            value: this.vpc.vpcId
        })
        
    }
}
import { CfnOutput, CfnParameter, Stack, StackProps } from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";


export class VpcStack extends Stack{
    vpc: Vpc
    vpcIdParameter : StringParameter
    vpcIdCfnOutput : CfnOutput
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props)

        this.vpc= new Vpc(this, 'vpc')

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
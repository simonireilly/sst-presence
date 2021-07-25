import * as sst from "@serverless-stack/resources";
import * as cdk from '@aws-cdk/core'
import * as path from "path"

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const table = new sst.Table(this, 'SocketStore', {
      fields: {
        pk: sst.TableFieldType.STRING
      },
      primaryIndex: {
        partitionKey: 'pk'
      },
      dynamodbTable: {
        removalPolicy: cdk.RemovalPolicy.DESTROY
      }
    })

    // Create the WebSocket API
    const api = new sst.WebSocketApi(this, "Api", {
      defaultFunctionProps: {
        environment: {
          tableName: table.dynamodbTable.tableName,
          AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1'
        },
      },
      routes: {
        $connect: "src/connect.main",
        $disconnect: "src/disconnect.main",
        sendmessage: "src/send-message.main",
      },
    });

    // Allow the API to access the table
    api.attachPermissions([table]);

    // const site = new sst.StaticSite(this, "ReactSite", {
    //   path: path.join(__dirname, "..", "..", "..", "frontend"),
    //   buildOutput: "out",
    //   buildCommand: "yarn export",
    //   errorPage: "404.html",
    //   indexPage: "index.html",
    // });

    // Show the endpoint in the output
    this.addOutputs({
      "ApiEndpoint": api.url,
      // "Frontend": site.url
    });
  }
}

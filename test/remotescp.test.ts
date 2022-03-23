import * as scp from '../src/remotescp'
import * as context from '../src/context'
import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'

const inputs: context.Inputs = {
    ipaddr: '192.168.130.159',
    username: 'service',
    password: '**********',
    operation_type: "upload",
    operation_list: ["dir /Users/a/opensource/scp-remote-action /usr/local/wwww/","file /Users/a/opensource/scp-remote-action/package-lock.json /usr/local/node/src/"]
}

const inputsForDownload: context.Inputs = {
    ipaddr: '192.168.130.159',
    username: 'service',
    password: '**********',
    operation_type: "download",
    operation_list: ["dir /usr/local/kubeconf /usr/local/","file /root/apache-maven-3.3.9-bin.tar.gz /usr/local"]
}

// test('check remote',()=>{
//   scp.execRemoteScpCommands(inputs);
// })

/**
 * 测试 生成的上传命令是否和预期匹配
 */
test('test gen scp remote upload command',() => {
    let command1:string = " scp -o StrictHostKeyChecking=no  -r /Users/a/opensource/scp-remote-action service@192.168.130.159:/usr/local/wwww/"
    let commandScp1Array:string[] = utils.splitScpCommand(inputs.operation_list[0]);
    let commandScp1 = scp.genScpCommand(commandScp1Array,inputs.ipaddr,inputs.operation_type,inputs.username);
    expect(commandScp1).toEqual(command1);

    let command2:string = " scp -o StrictHostKeyChecking=no /Users/a/opensource/scp-remote-action/package-lock.json service@192.168.130.159:/usr/local/node/src/"
    let commandScp2Array:string[] = utils.splitScpCommand(inputs.operation_list[1]);
    let commandScp2 = scp.genScpCommand(commandScp2Array,inputs.ipaddr,inputs.operation_type,inputs.username);
    expect(commandScp2).toEqual(command2);
})

/**
 * 测试 生成的下载命令是否和预期匹配
 */
 test('test gen scp remote upload command',() => {
    let command1:string = " scp -o StrictHostKeyChecking=no -r service@192.168.130.159:/usr/local/kubeconf /usr/local/"
    let commandScp1Array:string[] = utils.splitScpCommand(inputsForDownload.operation_list[0]);
    let commandScp1 = scp.genScpCommand(commandScp1Array,inputsForDownload.ipaddr,inputsForDownload.operation_type,inputsForDownload.username);
    expect(commandScp1).toEqual(command1);

    let command2:string = " scp -o StrictHostKeyChecking=no service@192.168.130.159:/root/apache-maven-3.3.9-bin.tar.gz /usr/local"
    let commandScp2Array:string[] = utils.splitScpCommand(inputsForDownload.operation_list[1]);
    let commandScp2 = scp.genScpCommand(commandScp2Array,inputsForDownload.ipaddr,inputsForDownload.operation_type,inputsForDownload.username);
    expect(commandScp2).toEqual(command2);
})

test('exec remote scp command',() => {
    let command1:string = "sshpass -p ********  scp -o StrictHostKeyChecking=no  -r /Users/a/opensource/scp-remote-action service@192.168.130.159:/usr/local/wwww/"
    scp.execRemoteSCPCommand(command1);
    let command2:string = "sshpass -p ********  scp -o StrictHostKeyChecking=no /Users/a/opensource/scp-remote-action/package-lock.json service@192.168.130.159:/usr/local/node/src/"
    scp.execRemoteSCPCommand(command2);
})
import * as core from '@actions/core'
import * as cp from 'child_process'
import * as context from './context'
import * as utils from './utils'

/**
 *      sshpass -p ${{ secrets.CCE_PASSWORD }}  scp  -o StrictHostKeyChecking=no  target/demoapp.jar root@182.92.156.203:/usr/local/
        sshpass -p ${{ secrets.CCE_PASSWORD }}  scp  -o StrictHostKeyChecking=no  bin/demoapp.service root@182.92.156.203:/etc/systemd/system/
 */
export async function execRemoteScpCommands(
  inputs: context.Inputs
): Promise<void> {
  for (var i = 0; i < inputs.operation_list.length; i++) {
    core.info('exec command:' + inputs.operation_list[i])
    let scpCommand:string[] = utils.splitScpCommand(inputs.operation_list[i]);
    //只有在upload的情况下需要检查本地文件是否存在，如果不存在则跳过这一行
    if(inputs.operation_type==="upload" && !utils.checkLocalFileOrDirExist(inputs.operation_type,scpCommand)){
      continue;
    }
    if(utils.checkScpCommandStart(inputs.operation_list[i] ) && utils.checkScpCommandLength(scpCommand,3)){
      let scppassCommand:string =
      'sshpass -p ' +
      inputs.password +
      genScpCommand(scpCommand,inputs.ipaddr,inputs.operation_type,inputs.username)
      core.info("sshpass scp command : " + scppassCommand)
      await execRemoteSCPCommand(scppassCommand)
    }

  }
}

/**
 * 本地上传，在第二个路径前加user@ipaddr:
 * 远端下载，在第一个路径前加user@ipaddr:
 * 如果是目录，为scp -r
 * 
 * @param scpcommand 执行远程命令
 */
export async function execRemoteSCPCommand(scpcommand: string): Promise<void> {
  let sshpassCommandResult = await (cp.execSync(scpcommand) || '').toString()
  //core.info('result ' + sshpassCommandResult)
}

export function genScpCommand(fileArray:string[],ipaddr:string,ops_type:string,username:string) : string{
  let scpCommand = " scp -o StrictHostKeyChecking=no ";
  let scptype = fileArray[0];
  let fromPath = fileArray[1];
  let distPath = fileArray[2];


  if(scptype === "dir"){
    scpCommand += " -r "
  }

  if(ops_type === "upload"){
    scpCommand += fromPath + " " + username + "@" + ipaddr+":" + distPath
  }
  if(ops_type === "download"){
    scpCommand +=  username + "@" + ipaddr+":" + fromPath+ " " + distPath
  }

  return scpCommand;
}
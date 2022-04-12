import * as core from '@actions/core'
import * as cp from 'child_process'
import * as context from './context'
import * as utils from './utils'

export async function execRemoteScpCommands(
  inputs: context.Inputs
): Promise<void> {
  //  for (const scpOPS in inputs.operation_list) {
  for (let i = 0; i < inputs.operation_list.length; i++) {
    core.info('exec command:' + inputs.operation_list[i])
    const scpCommand: string[] = utils.splitScpCommand(inputs.operation_list[i])
    //只有在upload的情况下需要检查本地文件是否存在，如果不存在则跳过这一行
    if (
      inputs.operation_type === 'upload' &&
      !utils.checkLocalFileOrDirExist(inputs.operation_type, scpCommand)
    ) {
      continue
    }
    if (
      utils.checkScpCommandStart(inputs.operation_list[i]) &&
      utils.checkScpCommandLength(scpCommand, 3)
    ) {
      let scppassCommand: string =
        'sshpass -p ' +
        inputs.password +
        genScpCommand(
          scpCommand,
          inputs.ipaddr,
          inputs.operation_type,
          inputs.username
        )
      await execRemoteSCPCommand(scppassCommand)
    }
  }
}

/**
 * 执行远程命令
 * @param scpcommand
 */
export async function execRemoteSCPCommand(scpcommand: string): Promise<void> {
  const sshpassCommandResult = await (cp.execSync(scpcommand) || '').toString()
  core.info('result ' + sshpassCommandResult)
}

/**
 * 本地上传，在第二个路径前加user@ipaddr:
 * 远端下载，在第一个路径前加user@ipaddr:
 * 如果是目录，为scp -r
 * @param fileArray
 * @param ipaddr
 * @param ops_type
 * @param username
 * @returns
 */
export function genScpCommand(
  fileArray: string[],
  ipaddr: string,
  ops_type: string,
  username: string
): string {
  let scpCommand = ' scp -o StrictHostKeyChecking=no '
  const scptype = fileArray[0]
  const fromPath = fileArray[1]
  const distPath = fileArray[2]

  if (scptype === 'dir') {
    scpCommand += ' -r '
  }

  if (ops_type === 'upload') {
    scpCommand += fromPath + ' ' + username + '@' + ipaddr + ':' + distPath
  }
  if (ops_type === 'download') {
    scpCommand += username + '@' + ipaddr + ':' + fromPath + ' ' + distPath
  }

  return scpCommand
}

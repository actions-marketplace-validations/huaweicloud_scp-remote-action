import * as core from '@actions/core'
import * as context from './context'
import * as path from 'path'
import * as fs from 'fs-extra'

//高危命令列表，持续完善
const dangerCommandSet: string[] = [
  'poweroff',
  'reboot',
  'rm',
  'mkfs',
  'file',
  'dd',
  'shutdown',
  '){:|:&};:',
  '^foo^bar'
]
/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
  if (
    checkParameterIsNull(inputs.ipaddr) ||
    checkParameterIsNull(inputs.username) ||
    checkParameterIsNull(inputs.password) ||
    checkParameterIsNull(inputs.operation_type)
  ) {
    core.info('Please fill all the required parameters')
    return false
  }
  if (
    inputs.operation_type != 'upload' &&
    inputs.operation_type != 'download'
  ) {
    core.info('operation_type must be upload or download')
    return false
  }

  if (!checkIPV4Addr(inputs.ipaddr)) {
    core.info('ip address not correct')
    return false
  }

  if (inputs.operation_list.length === 0) {
    core.info('can not find any scp file/dir list')
    return false
  }
  return true
}

/**
 * 检查是否是正常的IP地址
 * @param ipaddr
 * @returns
 */
export function checkIPV4Addr(ipaddr: string): boolean {
  return context.IPREGX.test(ipaddr)
}

/**
 * 判断字符串是否为空
 * @param parameter
 * @returns
 */
export function checkParameterIsNull(parameter: string): boolean {
  return (
    parameter === undefined ||
    parameter === null ||
    parameter === '' ||
    parameter.trim().length == 0
  )
}

/**
 * 按空格将切分本地和远端文件路径
 * @param scpCommand
 * @returns
 */
export function splitScpCommand(scpCommand: string): string[] {
  const fileArray: string[] = scpCommand.split(' ')
  return fileArray
}

/**
 * 检查文件是否以file或者dir开头
 * @param scpCommand
 * @returns
 */
export function checkScpCommandStart(scpCommand: string): boolean {
  return scpCommand.startsWith('file') || scpCommand.startsWith('dir')
}

/**
 * 检查数组是否包含三个元素
 * @param scpCommand
 * @returns
 */
export function checkScpCommandLength(
  scpCommand: string[],
  arrayLength: number
): boolean {
  return scpCommand.length === arrayLength
}

/**
 * 目前只检查本地文件，远端文件也可以检查，但需要发起远程命令，比较麻烦
 * @param opsType
 * @param path
 * @returns
 */
export function checkLocalFileOrDirExist(
  opsType: string,
  path: string[]
): boolean {
  let checkPath = ''
  if (opsType === 'upload') {
    checkPath = path[1]
  }
  if (opsType === 'download') {
    checkPath = path[2]
  }
  return checkFileOrDirStat(path[0], checkPath)
}

export function checkFileOrDirStat(
  fileType: string,
  checkPath: string
): boolean {
  core.info('check local file ' + checkPath + ' exist')
  try {
    const stat = fs.statSync(checkPath)
    console.log(stat)
    if (fileType === 'file' && stat.isFile()) {
      return true
    } else if (fileType === 'dir' && stat.isDirectory()) {
      return true
    } else {
      core.info('file Type not match ' + checkPath + ' is  not ' + fileType)
      return false
    }
  } catch (error) {
    console.log(error)
    return false
  }
}

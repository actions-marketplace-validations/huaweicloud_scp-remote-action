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
    checkObejectIsNull(inputs.ipaddr) ||
    checkObejectIsNull(inputs.username) ||
    checkObejectIsNull(inputs.password) ||
    checkObejectIsNull(inputs.operation_type)
  ) {
    core.info('Please fill all the required parameters')
    return false
  }
  if(inputs.operation_type != "upload" && inputs.operation_type != "download" ){
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
  let ipRegx = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))(\.|$)){4}$/
  return ipRegx.test(ipaddr) ? true : false
}

/**
 * 判断字符串是否为空
 * @param s
 * @returns
 */
export function checkObejectIsNull(s: string): boolean {
  if (s == undefined || s == null || s == '' || s.trim().length == 0) {
    return true
  }
  return false
}

/**
 *
 * @param commands 检查是否有影响操作系统安全的高危命令
 * @returns
 */
export function checkCommandsDanger(commands: string[]): boolean {
  var isCommandsDanger: boolean = false
  for (var i = 0; i < commands.length; i++) {
    var command = commands[i]
    if (checkCommandDanger(command)) {
      isCommandsDanger = true
      break
    }
  }
  return isCommandsDanger
}

/**
 * 检查命令行中是否有黑名单中的高危命令
 * @param command
 * @returns
 */
export function checkCommandDanger(command: string): boolean {
  let isCommandDanger = false
  for (var i = 0; i < dangerCommandSet.length; i++) {
    if (command.indexOf(dangerCommandSet[i]) > -1) {
      core.info(
        'find danger operation "' +
          dangerCommandSet[i] +
          '" in command line "' +
          command +
          '",please remove it '
      )
      isCommandDanger = true
    }
  }
  i
  return isCommandDanger
}

/**
 * 按空格将切分本地和远端文件路径
 * @param scpCommand 
 * @returns 
 */
export function splitScpCommand(scpCommand:string): string[]{
  const fileArray:string[] = scpCommand.split(" ");
  return fileArray;
}

/**
 * 检查文件是否以file或者dir开头
 * @param scpCommand 
 * @returns 
 */
export function checkScpCommandStart(scpCommand:string): boolean{
  if(scpCommand.startsWith("file") || scpCommand.startsWith("dir")){
    return true;
  }
  return false
}

/**
 * 检查数组是否包含三个元素
 * @param scpCommand 
 * @returns 
 */
export function checkScpCommandLength(scpCommand:string[],arrayLength:number): boolean{
  if(scpCommand.length === arrayLength){
    return true;
  }
  return false;
}

/**
 * 目前只检查本地文件，远端文件也可以检查，但需要发起远程命令，比较麻烦
 * @param opsType 
 * @param path 
 * @returns 
 */
export function checkLocalFileOrDirExist(opsType:string,path:string[]) : boolean{
  let checkPath:string = "";
  if(opsType === "upload"){
    checkPath = path[1];
  }
  if(opsType === "download"){
    checkPath = path[12];
  }
  return checkFileOrDirStat(path[0],checkPath);
}

export function checkFileOrDirStat(fileType:string ,checkPath:string): boolean{
  core.info("check local file " + checkPath + " exist");
  try {
    const stat = fs.statSync(checkPath);
    console.log(stat)
    if(fileType === "file" && stat.isFile()){
      return true;
    }else if(fileType === "dir" && stat.isDirectory()){
      return true;
    }else{
      core.info("file Type not match " + checkPath + " is  not " + fileType);
      return false
    }
  } catch (error) {
    console.log(error)
    return false;
  }
}


import * as core from '@actions/core'
import * as context from './context'
import * as remotescp from './remotescp'
import * as install from './install'
import * as utils from './utils'

export async function run() {
  const inputs: context.Inputs = context.getInputs()
  //const inputs:context.Inputs = context.getInputsForTest();

  //如果参数输入有问题，终止操作
  if (!utils.checkInputs(inputs)) {
    return
  }

  //检查当前环境是否具备远程命令操作条件
  const installSuccess = await install.installSshPassOnSystem()
  if (!installSuccess) {
    core.info('can not install sshpass on system')
    return
  }

  //执行远程操作
  remotescp.execRemoteScpCommands(inputs)
}

run()

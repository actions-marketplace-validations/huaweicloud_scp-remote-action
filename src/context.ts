import * as core from '@actions/core'

export interface Inputs {
  ipaddr: string
  username: string
  password: string
  operation_type: string
  operation_list: string[]
}

export function getInputs(): Inputs {
  return {
    ipaddr: core.getInput('ipaddr'),
    username: core.getInput('username'),
    password: core.getInput('password'),
    operation_type: core.getInput('operation_type'),
    operation_list: core.getMultilineInput('operation_list')
  }
}

//检测IP正则表达式
export const IPREGX = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))(\.|$)){4}$/

//高危命令列表，持续完善
export const dangerCommandSet: string[] = [
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

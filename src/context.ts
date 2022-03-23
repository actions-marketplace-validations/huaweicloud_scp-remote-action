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

export function getInputsTestUpload(): Inputs {
  return {
    ipaddr: '192.168.130.159',
    username: 'service',
    password: '**********',
    operation_type: "upload",
    operation_list: ["dir /root/kube/conf /usr/local/kubeconf","file /root/apache-maven-3.3.9-bin.tar.gz /root/"]
  }
}

export function getInputsTestDownload(): Inputs {
  return {
    ipaddr: '192.168.130.159',
    username: 'service',
    password: '**********',
    operation_type: "download",
    operation_list: ["dir /usr/local/kubeconf /usr/local/","file /root/apache-maven-3.3.9-bin.tar.gz /usr/local"]
  }
}

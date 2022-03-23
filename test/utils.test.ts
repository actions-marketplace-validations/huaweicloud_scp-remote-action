import * as utils from '../src/utils'
import {expect, test} from '@jest/globals'
import * as context from '../src/context'

const inputs: context.Inputs = {
  ipaddr: '192.168.130.159',
  username: 'root',
  password: '********',
  operation_type: "upload",
  operation_list: ["dir Users/a/opensource/scp-remote-action /usr/local/wwww/","file /Users/a/opensource/scp-remote-action/package-lock.json /usr/local/nodesrc/"]
}



test('check inputs',()=>{
  expect(utils.checkInputs(inputs)).toEqual(true);
  for(let i = 0 ; i < inputs.operation_list.length;i++){
    let fileList = inputs.operation_list[i];
    let fileArray:string[] = utils.splitScpCommand(fileList);
    expect(utils.checkScpCommandLength(fileArray,3)).toEqual(true);
  }
})



test('check ipv4', () => {
  expect(utils.checkIPV4Addr('192.168.1.1')).toEqual(true)
  expect(utils.checkIPV4Addr('0.0.0.0')).toEqual(true)
  expect(utils.checkIPV4Addr('256.1.1.2')).toEqual(false)
  expect(utils.checkIPV4Addr('10.197.68.254')).toEqual(true)
  expect(utils.checkIPV4Addr('10.197.68.256')).toEqual(false)
  expect(utils.checkIPV4Addr('10.197.68.256.19')).toEqual(false)
})

test('check file/dir exist', () => {
  //check dir
  expect(utils.checkFileOrDirStat("dir","/Users/a/opensource/scp-remote-action")).toEqual(true)
  //check file
  expect(utils.checkFileOrDirStat("file","/Users/a/opensource/scp-remote-action/README.md")).toEqual(true)
  //check file not exist
  expect(utils.checkFileOrDirStat("dir","/Users/a/opensource/scp-remote-actionssss")).toEqual(false)
    //path is not file
  expect(utils.checkFileOrDirStat("file","/Users/a/opensource/scp-remote-action")).toEqual(false)
  //path is not directory
  expect(utils.checkFileOrDirStat("dir","/Users/a/opensource/scp-remote-action/README.md")).toEqual(false)
})

test('check fileList start',()=>{
  let fileList1:string = "dir Users/a/opensource/scp-remote-action /usr/local/wwww/";
  let fileList2:string = "file /Users/a/opensource/scp-remote-action/package-lock.json /usr/local/nodesrc/";
  expect(utils.checkScpCommandStart(fileList1)).toEqual(true);
  expect(utils.checkScpCommandStart(fileList2)).toEqual(true);
})

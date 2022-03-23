"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileOrDirStat = exports.checkLocalFileOrDirExist = exports.checkScpCommandLength = exports.checkScpCommandStart = exports.splitScpCommand = exports.checkCommandDanger = exports.checkCommandsDanger = exports.checkObejectIsNull = exports.checkIPV4Addr = exports.checkInputs = void 0;
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs-extra"));
//高危命令列表，持续完善
const dangerCommandSet = [
    'poweroff',
    'reboot',
    'rm',
    'mkfs',
    'file',
    'dd',
    'shutdown',
    '){:|:&};:',
    '^foo^bar'
];
/**
 * 检查输入的各参数是否正常
 * @param inputs
 * @returns
 */
function checkInputs(inputs) {
    if (checkObejectIsNull(inputs.ipaddr) ||
        checkObejectIsNull(inputs.username) ||
        checkObejectIsNull(inputs.password) ||
        checkObejectIsNull(inputs.operation_type)) {
        core.info('Please fill all the required parameters');
        return false;
    }
    if (inputs.operation_type != "upload" && inputs.operation_type != "download") {
        core.info('operation_type must be upload or download');
        return false;
    }
    if (!checkIPV4Addr(inputs.ipaddr)) {
        core.info('ip address not correct');
        return false;
    }
    if (inputs.operation_list.length === 0) {
        core.info('can not find any scp file/dir list');
        return false;
    }
    return true;
}
exports.checkInputs = checkInputs;
/**
 * 检查是否是正常的IP地址
 * @param ipaddr
 * @returns
 */
function checkIPV4Addr(ipaddr) {
    let ipRegx = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))(\.|$)){4}$/;
    return ipRegx.test(ipaddr) ? true : false;
}
exports.checkIPV4Addr = checkIPV4Addr;
/**
 * 判断字符串是否为空
 * @param s
 * @returns
 */
function checkObejectIsNull(s) {
    if (s == undefined || s == null || s == '' || s.trim().length == 0) {
        return true;
    }
    return false;
}
exports.checkObejectIsNull = checkObejectIsNull;
/**
 *
 * @param commands 检查是否有影响操作系统安全的高危命令
 * @returns
 */
function checkCommandsDanger(commands) {
    var isCommandsDanger = false;
    for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        if (checkCommandDanger(command)) {
            isCommandsDanger = true;
            break;
        }
    }
    return isCommandsDanger;
}
exports.checkCommandsDanger = checkCommandsDanger;
/**
 * 检查命令行中是否有黑名单中的高危命令
 * @param command
 * @returns
 */
function checkCommandDanger(command) {
    let isCommandDanger = false;
    for (var i = 0; i < dangerCommandSet.length; i++) {
        if (command.indexOf(dangerCommandSet[i]) > -1) {
            core.info('find danger operation "' +
                dangerCommandSet[i] +
                '" in command line "' +
                command +
                '",please remove it ');
            isCommandDanger = true;
        }
    }
    i;
    return isCommandDanger;
}
exports.checkCommandDanger = checkCommandDanger;
/**
 * 按空格将切分本地和远端文件路径
 * @param scpCommand
 * @returns
 */
function splitScpCommand(scpCommand) {
    const fileArray = scpCommand.split(" ");
    return fileArray;
}
exports.splitScpCommand = splitScpCommand;
/**
 * 检查文件是否以file或者dir开头
 * @param scpCommand
 * @returns
 */
function checkScpCommandStart(scpCommand) {
    if (scpCommand.startsWith("file") || scpCommand.startsWith("dir")) {
        return true;
    }
    return false;
}
exports.checkScpCommandStart = checkScpCommandStart;
/**
 * 检查数组是否包含三个元素
 * @param scpCommand
 * @returns
 */
function checkScpCommandLength(scpCommand, arrayLength) {
    if (scpCommand.length === arrayLength) {
        return true;
    }
    return false;
}
exports.checkScpCommandLength = checkScpCommandLength;
/**
 * 目前只检查本地文件，远端文件也可以检查，但需要发起远程命令，比较麻烦
 * @param opsType
 * @param path
 * @returns
 */
function checkLocalFileOrDirExist(opsType, path) {
    let checkPath = "";
    if (opsType === "upload") {
        checkPath = path[1];
    }
    if (opsType === "download") {
        checkPath = path[12];
    }
    return checkFileOrDirStat(path[0], checkPath);
}
exports.checkLocalFileOrDirExist = checkLocalFileOrDirExist;
function checkFileOrDirStat(fileType, checkPath) {
    core.info("check local file " + checkPath + " exist");
    try {
        const stat = fs.statSync(checkPath);
        console.log(stat);
        if (fileType === "file" && stat.isFile()) {
            return true;
        }
        else if (fileType === "dir" && stat.isDirectory()) {
            return true;
        }
        else {
            core.info("file Type not match " + checkPath + " is  not " + fileType);
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}
exports.checkFileOrDirStat = checkFileOrDirStat;

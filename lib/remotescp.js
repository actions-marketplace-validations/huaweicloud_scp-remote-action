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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genScpCommand = exports.execRemoteSCPCommand = exports.execRemoteScpCommands = void 0;
const core = __importStar(require("@actions/core"));
const cp = __importStar(require("child_process"));
const utils = __importStar(require("./utils"));
/**
 *      sshpass -p ${{ secrets.CCE_PASSWORD }}  scp  -o StrictHostKeyChecking=no  target/demoapp.jar root@182.92.156.203:/usr/local/
        sshpass -p ${{ secrets.CCE_PASSWORD }}  scp  -o StrictHostKeyChecking=no  bin/demoapp.service root@182.92.156.203:/etc/systemd/system/
 */
function execRemoteScpCommands(inputs) {
    return __awaiter(this, void 0, void 0, function* () {
        for (var i = 0; i < inputs.operation_list.length; i++) {
            core.info('exec command:' + inputs.operation_list[i]);
            let scpCommand = utils.splitScpCommand(inputs.operation_list[i]);
            //只有在upload的情况下需要检查本地文件是否存在，如果不存在则跳过这一行
            if (inputs.operation_type === "upload" && !utils.checkLocalFileOrDirExist(inputs.operation_type, scpCommand)) {
                continue;
            }
            if (utils.checkScpCommandStart(inputs.operation_list[i]) && utils.checkScpCommandLength(scpCommand, 3)) {
                let scppassCommand = 'sshpass -p ' +
                    inputs.password +
                    genScpCommand(scpCommand, inputs.ipaddr, inputs.operation_type, inputs.username);
                core.info("sshpass scp command : " + scppassCommand);
                yield execRemoteSCPCommand(scppassCommand);
            }
        }
    });
}
exports.execRemoteScpCommands = execRemoteScpCommands;
/**
 * 本地上传，在第二个路径前加user@ipaddr:
 * 远端下载，在第一个路径前加user@ipaddr:
 * 如果是目录，为scp -r
 *
 * @param scpcommand 执行远程命令
 */
function execRemoteSCPCommand(scpcommand) {
    return __awaiter(this, void 0, void 0, function* () {
        let sshpassCommandResult = yield (cp.execSync(scpcommand) || '').toString();
        //core.info('result ' + sshpassCommandResult)
    });
}
exports.execRemoteSCPCommand = execRemoteSCPCommand;
function genScpCommand(fileArray, ipaddr, ops_type, username) {
    let scpCommand = " scp -o StrictHostKeyChecking=no ";
    let scptype = fileArray[0];
    let fromPath = fileArray[1];
    let distPath = fileArray[2];
    if (scptype === "dir") {
        scpCommand += " -r ";
    }
    if (ops_type === "upload") {
        scpCommand += fromPath + " " + username + "@" + ipaddr + ":" + distPath;
    }
    if (ops_type === "download") {
        scpCommand += username + "@" + ipaddr + ":" + fromPath + " " + distPath;
    }
    return scpCommand;
}
exports.genScpCommand = genScpCommand;

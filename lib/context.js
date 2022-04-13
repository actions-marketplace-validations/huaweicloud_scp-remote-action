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
exports.dangerCommandSet = exports.IPREGX = exports.getInputs = void 0;
const core = __importStar(require("@actions/core"));
function getInputs() {
    return {
        ipaddr: core.getInput('ipaddr'),
        username: core.getInput('username'),
        password: core.getInput('password'),
        operation_type: core.getInput('operation_type'),
        operation_list: core.getMultilineInput('operation_list')
    };
}
exports.getInputs = getInputs;
//检测IP正则表达式
exports.IPREGX = /^((\d|[1-9]\d|1\d\d|2([0-4]\d|5[0-5]))(\.|$)){4}$/;
//高危命令列表，持续完善
exports.dangerCommandSet = [
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

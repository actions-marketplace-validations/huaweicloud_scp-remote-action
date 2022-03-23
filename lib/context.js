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
exports.getInputsTestDownload = exports.getInputsTestUpload = exports.getInputs = void 0;
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
function getInputsTestUpload() {
    return {
        ipaddr: '192.168.130.159',
        username: 'service',
        password: '**********',
        operation_type: "upload",
        operation_list: ["dir /root/kube/conf /usr/local/kubeconf", "file /root/apache-maven-3.3.9-bin.tar.gz /root/"]
    };
}
exports.getInputsTestUpload = getInputsTestUpload;
function getInputsTestDownload() {
    return {
        ipaddr: '192.168.130.159',
        username: 'service',
        password: '**********',
        operation_type: "download",
        operation_list: ["dir /usr/local/kubeconf /usr/local/", "file /root/apache-maven-3.3.9-bin.tar.gz /usr/local"]
    };
}
exports.getInputsTestDownload = getInputsTestDownload;

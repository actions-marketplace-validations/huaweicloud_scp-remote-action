# scp-remote-action
通过scp命令批量上传文件和目录到远端服务器，从远端服务器上批量下载文件和目录，从而支持业务包和配置文件部署等操作
目前支持linux系统和苹果系统，windows系统不支持

## **前置工作**
(1).获取远端linux服务器的IP,账号,密码,并确定该使用该账号密码可以正常登陆
(2).需要在项目的setting--Secret--Actions下添加 USERNAME,PASSWORD两个参数
## **参数说明:**
ipaddr:远端节点IP地址，必填
username:远端节点账号，必填
password:远端节点密码，必填
operation_type:操作类型，目前支持两种:upload 和download，必填
operation_list:操作文件或者目录列表,格式为 类型 源路径 目标路径
    如果operation_type为upload,则会被识别为 类型(file/dir) 本地源路径 远端目标路径
    如果operation_type为download,则会被识别为 类型(file/dir) 远端目标路径 本地源路径


## **使用样例:**
1、上传本地文件和目录到远端服务器
```yaml
    - name: scp remote upload
      uses: huaweicloud/scp-remote-action@v1.1
      with:
        ipaddr: "***.***.***.**"
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
        operation_type: upload
        operation_list: |
          file /etc/os-release /root
          dir .github /root
 ```   
   2、从远端服务器下载文件和目录
```yaml
    - name: scp remote download
      uses: huaweicloud/scp-remote-action@v1.1
      with:
        ipaddr: "192.168.130.159"
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
        operation_type: download
        operation_list: |
          file /etc/os-release ~/
          dir /root/obsutil/ ~/
 ```
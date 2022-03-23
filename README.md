# scp-remote-action
use ssh channel,upload local file and directory to remote server ,or download file and directory from remote server

sample:

    - name: scp remote upload
      uses: lengxing-lx/scp-remote-action@v1.1
      with:
        ipaddr: "182.92.156.203"
        username: "root"
        password: ${{ secrets.CCE_PASSWORD }}
        operation_type: upload
        operation_list: |
          file /etc/os-release /root
          dir .github /root
    - name: scp remote download
      uses: lengxing-lx/scp-remote-action@v1.1
      with:
        ipaddr: "182.92.156.203"
        username: "root"
        password: ${{ secrets.CCE_PASSWORD }}
        operation_type: download
        operation_list: |
          file /etc/os-release ~/
          dir /root/obsutil/ ~/

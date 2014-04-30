---

layout: hebi-post
title: ubuntu getting start for 7
location: Hefei
time: 10:57:25

---

# 基本操作
应用程序的菜单显示在最上面。

左侧可以打开设置。

左侧可以打开电脑助手。没反应可能是隐藏了，点击右上角图标，选显示。


# 快捷键
Ctrl-Alt-箭头: 切换工作区
# VPN
桌面上ustcvpn是科大vpn，vpn是翻墙vpn。

进入文件夹后，右键点空白处，选在终端中打开。然后输入：

    sudo openvpn client.conf

其中client.conf是文件名，可以是任何名称，你可以把这个文件改成任何名称。
文件名称支持tab补全。如终端输入`sudo openvpn cl`后按tab会补全文件名`client.conf`。

当出现xxx completed后，就已经连上了。这时候所有流量都会从vpn里过。窗口不要关闭。

要停止vpn，在终端窗口中输入：`Ctrl-c`。

如果不小心直接关掉终端窗口，则vpn没有关掉。这时候要运行下面的命令：

    ps -ef | grep openvpn

找到对应有 `sudo openvpn client.conf`的一行，像下面这样：

    501  1100   280   0 11:12AM ttys000    0:00.20 /bin/bash -l
    0  1144  1100   0 11:13AM ttys000    0:00.00 ps -ef

第二个数字就是PID号。然后终端输入(`1100`换成你的PID号)：

    sudo kill 1100

要测试你的ip地址，直接在百度上搜`IP`



# 命令行
终止当前进程: `Ctrl-c`

退出终端：`exit` 或直接点击叉号

命令自动补全，可以补全命令，文件名: `tab`

任何命令前加sudo， 表示管理员运行。
如果一个命令提示permission not xxx则基本是这个问题。用sudo就好了。
如：

    openvpn client.conf
    sudo openvpn client.conf

进入目录`xxx`:

    cd xxx

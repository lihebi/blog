---

layout: hebi-post
title: Shell Script
location: 合肥
time: 22:47:45

---

## 变量

#### 变量替换

**返回结果，但不改变原变量的值。**

```
# 若var未被声明，则以DEFAULT为其值
${var-DEFAULT}
${var=DEFAULT}
# 若
# 1. var 未被声明 或
# 2. 其值为空
# 则以DEFAULT为其值
${var:-DEFAULT}
${var:=DEFAULT}
```


<!--more-->

#### 特殊变量

```
$0 # 脚本名称
$<n> # 第n个参数
$# # 参数数量
$* # 所有参数，作为一个字符串
$@ # 所有参数，作为字符串数组
```

```
# example

./a.sh hello world
"$0" => ./a.sh
"$1" => hello
"$2" => world
"$#" => 2
"$*" => "./a.sh hello world"
"$@" => [ "./a.sh" "hello" "world" ]
```

```
$$ # 当前进程的PID
$? # 上一个命令的返回值
$! # 运行在后台的最后一个进程的PID。done了也算。
$_ # 上个命令的最后一个字段
```

## 字符串

substring使用的是bash中的正则。

* `${#string}` $string的长度
* `${string:5}` $string 从5位置开始的子串
* `${string:5:3}` 5位置开始，提取3个。
* `${string#substring}` 从*开头*删除substring的*最短*匹配
* `${string##substring}` 从*开头*删除substring的*最长*匹配
* `${string%substring}` 从*结尾*删除substring的*最短*匹配
* `${string%%substring}` 从*结尾*删除substring的*最长*匹配

## 语法结构


#### If

```
if condition1; then
  # ...
elif condition2
then
  # ...
else
  # ...
fi
```


其中condition有三种形式：

`[]`: TODO

`[[]]`: TODO

`(())`: TODO

关于`;`:
如果语句后面是行结束符，不需要。
如果有`then`等在一行上，需要。

#### Case

```
case $a in
1|en) echo 'en';;
2|zh) echo 'zh';;
esac
```

#### 循环

```
# while
while condition; do xxx; done
# until
until condition; do xxx; done
# for
for condition; do xxx; done
# conditions
for fname in *
for fname in `/etc/*` # do not need the 2 `
for x in aa bb cc
for x in $@
for x; do xx
for (( i=1; i<5; i++ ))
```

可以使用`break`, `continue`.

#### 函数

```
# 形式1
function func {
  return 1;
  exit 1;
}
# 形式2
func() {
  return 1;
}
```

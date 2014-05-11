---

layout: hebi-post
title: Javascript
location: 淮北
time: 08:12:01
tags: javascript 编程语言
---

## Number

```
Number.parseInt(string, radix)
```

## String

#### slice
```
str.slice(begin, end)
‘hello world’.slice(0, -2) ==> ‘hello wor’
```

<!--more-->

## Function

#### 定义函数的区别

```
function xxx() {}
```

在程序load的时候，就将这个名称加载到内存，所以在其上面可以直接使用了。

```
var func = function xxx() {}
```

只有执行到这句的时候才会存在，所以在上面不能执行func或xxx。

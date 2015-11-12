---
title: ndnd与ndnpeek关系文档
location: 合肥
time: 08:25:47
categories: 文档
---

# ndnd执行流程

### ndnd_main.c

主函数代码如下

```
int
main(int argc, char **argv)
{
    struct ndnd_handle *h;

    if (argc > 1) {
        fprintf(stderr, "%s", ndnd_usage_message);
        exit(1);
    }
    signal(SIGPIPE, SIG_IGN);
    h = ndnd_create(argv[0], stdiologger, stderr);
    if (h == NULL)
        exit(1);
    ndnd_run(h);
    ndnd_msg(h, "exiting.");
    ndnd_destroy(&h);
    ERR_remove_state(0);
    EVP_cleanup();
    exit(0);
}
```

使用ndnd_create创建了一个ndnd_handle.
运行ndnd_run.

### ndnd_run()

```
for (h->running = 1; h->running;) {

  process_internal_client_buffer(h);
  usec = ndn_schedule_run(h->sched);
  timeout_ms = (usec < 0) ? -1 : ((usec + 960) / 1000);
  if (timeout_ms == 0 && prev_timeout_ms == 0)
  timeout_ms = 1;
  process_internal_client_buffer(h);

  prepare_poll_fds(h);
  res = poll(h->fds, h->nfds, timeout_ms);
  for (i = 0; res > 0 && i < h->nfds; i++) {
    if (h->fds[i].revents != 0) {
      res--;
      // 可写
      if (h->fds[i].revents & (POLLOUT))
        do_deferred_write(h, h->fds[i].fd);
      // 可读
      else if (h->fds[i].revents & (POLLIN))
        process_input(h, h->fds[i].fd);
    }
  }
}
```

分为两部分

* process_internal
* `poll`遍历准备好的IO

内部的client连接本地`socket`后,发送的`interest`和接收`data`都是走`poll`这条路.

`process_internal`应该是为了`ndndc`等路由控制命令准备的.

所以,内部和外部client没有本质的区别,直接往远程`IP:PORT`发包就行.

# mypeek 代码

`mypeek`是简版的`ndnpeek`,为了达到完全脱离ndnd进行编译执行,我把相关文件集中到一个目录下.

### 目录结构.

```
mypeek
├── Makefile
├── hashtb.c
├── mypeek.c
├── ndn_bloom.c
├── ndn_buf_decoder.c
├── ndn_buf_encoder.c
├── ndn_charbuf.c
├── ndn_client.c
├── ndn_coding.c
├── ndn_digest.c
├── ndn_indexbuf.c
├── ndn_interest.c
├── ndn_keystore.c
├── ndn_match.c
├── ndn_name_util.c
├── ndn_reg_mgmt.c
├── ndn_schedule.c
├── ndn_setup_sockaddr_un.c
├── ndn_signing.c
├── ndn_sockaddrutil.c
├── ndn_uri.c
└── ndn_versioning.c
```

### makefile

```
CC=gcc
CFLAGS=-Wall
LDFLAGS=-lcrypto

EXECUTABLE=mypeek
OBJ = mypeek.o hashtb.o ndn_bloom.o ndn_buf_decoder.o ndn_buf_encoder.o ndn_charbuf.o ndn_client.o ndn_coding.o ndn_digest.o\
	ndn_indexbuf.o ndn_interest.o ndn_keystore.o ndn_match.o ndn_name_util.o ndn_reg_mgmt.o\
	ndn_schedule.o ndn_setup_sockaddr_un.o ndn_signing.o ndn_sockaddrutil.o ndn_uri.o ndn_versioning.o

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)

$(EXECUTABLE): $(OBJ)
	$(CC) -o $(EXECUTABLE) $(OBJ) $(CFLAGS) $(LDFLAGS)

clean:
	rm -rf $(OBJ) $(EXECUTABLE)
```

在ubuntu下编译时,可能会出错,说要使用c99.但有的文件使用c99又不行.

解决办法:
使用此文件make一下,再修改一行后make:

```
CFLAGS=-std=c99 -lcrypto
```

### mypeek.c

ndn_connect时第二个参数写`"tcp"`.

```
int main(int argc, char** argv) {
  // 变量定义
  int res;
  struct ndn *h = NULL;
  struct ndn_charbuf *name = NULL;
  struct ndn_charbuf *resultbuf = NULL;
  struct ndn_charbuf *templ = NULL;
  int timeout_ms = 3000;
  struct ndn_parsed_ContentObject pcobuf = { 0 };
  int get_flags = 0;
  const unsigned char *ptr;
  size_t length;


  // 从传入的第一个参数"/xxx/xxx"转换为ndn名字
  name = ndn_charbuf_create();
  ndn_name_from_uri(name, argv[1]);
  // 创建ndn实体,并连接远程socket
  h = ndn_create();
  res = ndn_connect(h, "tcp"); // 这里要使用tcp
  // 构造name对应的Interest,并取得内容放到resultbuf里
  resultbuf = ndn_charbuf_create();
  res = ndn_get(h, name, templ, timeout_ms, resultbuf, &pcobuf, NULL, get_flags);
  ptr = resultbuf->buf;
  length = resultbuf->length;
  // 从buf中获得内容
  ndn_content_get_value(ptr, length, &pcobuf, &ptr, &length);
  fwrite(ptr, length, 1, stdout) - 1;
}
```

运行方式

```
mypeek /test
```

### ndn_setup_sockaddr_in

这个函数写死了,`getaddrinfo`函数的`hostname`参数直接设成`null`,所以只连接了本地`ndnd`.
同时也不提供输入参数来自定义.

```
int
ndn_setup_sockaddr_in(const char *name, struct sockaddr *result, int length)
{
    struct addrinfo hints = {0};
    struct addrinfo *ai = NULL;
    char *port;
    char *nameonly = strdup(name);
    int ans = -1;
    int res;

    port = strchr(nameonly, ':');
    if (port)
        *port++ = 0;
    if (port == NULL || port[0] == 0)
        port = getenv(NDN_LOCAL_PORT_ENVNAME);
    if (port == NULL || port[0] == 0)
        port = NDN_DEFAULT_UNICAST_PORT;
    memset(result, 0, length);
    hints.ai_family = AF_UNSPEC;
    if (strcasecmp(nameonly, "tcp6") == 0) hints.ai_family = AF_INET6;
    if (strcasecmp(nameonly, "tcp4") == 0) hints.ai_family = AF_INET;
    hints.ai_socktype = SOCK_STREAM;
    hints.ai_flags = AI_ADDRCONFIG;
    hints.ai_protocol = 0;
    // 这一行需要修改
    res = getaddrinfo(NULL, port, &hints, &ai);
    if (res != 0 || ai->ai_addrlen > length)
        goto Bail;
    memcpy(result, ai->ai_addr, ai->ai_addrlen);
    ans = 0;
Bail:
    free(nameonly);
    freeaddrinfo(ai);
    return (ans);
}
```

直接修改`getaddrinfo`行为

```
res = getaddrinfo("192.168.16.8", port, &hints, &ai);
```

其中IP地址是运行ndnd的主机.


# 客户端分析

### ndn_get

* 发送interest
* 运行主循环,等待data

```
res = ndn_express_interest(h, name, &md->closure, interest_template);
res = ndn_run(h, timeout_ms);
```

### ndn_express_interest

* 构造interest
* 换掉h的handle为传进来的函数指针
* 实际发送interest

```
ndn_construct_interest(h, namebuf, interest_template, interest);
ndn_replace_handler(h, &(interest->action), action);
ndn_refresh_interest(h, interest);
```

### ndn_refresh_interest

把`msg`打到已经建立的socket`h->sock`上

```
res = ndn_put(h, interest->interest_msg, interest->size);
```

### ndn_run

对已经建立的socket`h->sock`做轮询

```
for(;;) {
  fds[0].fd = h->sock;
  fds[0].events = POLLIN;
  res = poll(fds, 1, millisec);
  if ((fds[0].revents | POLLOUT) != 0)
    ndn_pushout(h);
  if ((fds[0].revents | POLLIN) != 0)
    ndn_process_input(h);
}
```

### ndn_pushout

往`h->sock`上写

```
res = write(h->sock, h->outbuf->buf + h->outbufindex, size);
```

### ndn_process_input

* 读`h->sock`数据,并解码,输出

```
res = read(h->sock, buf, inbuf->limit - inbuf->length);
ndn_skeleton_decode(d, buf, res);
while (d->state == 0) {
  ndn_dispatch_message(h, inbuf->buf + msgstart, d->index - msgstart);
  msgstart = d->index;
  if (msgstart == inbuf->length) {
    inbuf->length = 0;
    return(0);
  }
  ndn_skeleton_decode(d, inbuf->buf + d->index, inbuf->length - d->index);
}
if (msgstart < inbuf->length && msgstart > 0) {
  memmove(inbuf->buf, inbuf->buf + msgstart,
    inbuf->length - msgstart);
    inbuf->length -= msgstart;
    d->index -= msgstart;
}
```

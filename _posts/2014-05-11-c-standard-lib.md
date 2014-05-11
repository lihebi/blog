---

layout: hebi-post
title: C Standard Lib
location: 合肥
time: 13:32:22

---

## stdio.h

perror

```
void perror(const char *str);
```

fflush

```
int fflush(FILE *stream);
```

fopen

```
FILE *fopen(const char *filename, const char *mode);
```

fclose

```
int fclose(FILE *stream);
```

freopen

```
FILE *freopen(const char *filename, const char *mode, FILE *stream);
```

fprintf

```
int fprintf(FILE *stream, const char *format, ...);
```

fscanf

```
int fscanf(FILE *stream, const char *format, ...);
```


## stdlib.h

malloc

```
// Allocates a block of size bytes of memory. Not initialized.
void *malloc(size_t size);
```

free

```
void free(void *ptr);
```

calloc

```
// 为一个num个元素的数组分配内存。每一个有size字节，初始化为0。
void *calloc(size_t num, size_t size)
```

realloc

```
// 将ptr指向的block的大小改为size。
// 可能会将这个block移动到一个新的地址。
// block的内容会保留新的大小和旧的大小中较小者。
// 如果新的大小更大，那么多出来的是未定义的。
// 如果ptr==NULL，等价于malloc
void *realloc(void *ptr, size_t size);
```

atoi

```
int atoi(const char *str);
```

atof

```
double atof(const char *str);
```

atol

```
long int atol(const char *str);
```

strtol

```
// base是进制
long int strtol(const char *str, char **endptr, int base)
```

Example:

```
char str[] = "2001 60cf2d -1100110010 0x6fff";
long int a,b,c,d;
char *sp;
a = strtol(str, &sp, 10);
b = strtol(sp, &sp, 16);
c = strtol(sp, &sp, 2);
d = strtol(sp, NULL, 0);
```

strtoul

```
unsigned long int strtoul(const char *str, char **endptr, int base);
```

strtod

```
double strtod(const char *str, char **endptr);
```

printf


```
// Format: %[flags][width][.precision][length]specifier

/**
 * specifier
 * d/i 有符号十进制整数
 * u 无符号十进制整数
 * o 无符号八进制
 * x 无符号十六进制整数
 * X 同上，但是X大写
 * f/F 浮点数 小写/大写
 * e/E 科学计数法 小写/大写
 * g/G use the shortest representation: (%e or %f / %E or %F)
 * p pointer address
 */

/**
 * Flags
 * - 左对齐
 * + 强制显示+-号
 * (space) 如果没有符号位可写，加空格
 * # (oxX)会打出(0,0x,0X), (aef)会打出小数点
 */

/**
 * width
 * (number) number较大将显示的位数补空格。number小则无影响
 * * 在...中给出
 */

/**
 * .precision
 * (number) (ef)保留位数。s打印个数
 * (.*) ...中给出
 */

/**
 * length
 * l long
 * h short
 * U long long
 * z size_t
 */

int printf(const char *format, ...);
```

## sys/time.h

gettimeofday

```
// tzp = NULL
// 返回从1970.1.1 00:00 UTC 到现在的秒数
int gettimeofday(struct timeval *tp, void *tzp);
struct timeval {
  __time_t tv_sec;
  __suseconds_t tv_usec;
}
```

## strings.h

strcasecmp

```
// 忽略大小写。比较所有字节。
// 返回：s1>s2: >0
//      s1=s2: =0
//      s1<s2: <0
int strcasecmp(const char *s1, const char *s2);
```

strncasecmp

```
// 比较前n个字节
int strncasecmp(const char *s1, const char *s2, size_t n);
```

strlen

```
// ssize_t: signed int(POSIX)
// size_t: unsigned int
size_t strlen(const char *str);
```

## <signal.h>

signal

```
/**
 * sig
 * SIGABRT Signal Abort 中止
 * SIGFPE Floating-Point-Exception 浮点数异常
 * SIGILL Illegal Instruction 不合法指令
 * SIGINT Interrupt 中断
 * SIGSEGV Segmentation Violation 段错误
 * SIGTERM Terminate 中止
 * SIGPIPE Broken pipe 管道错误
 */

/**
 * `SIGPIPE`: one process open a pipe or FIFO for reading before another wrote to it.
 If the reading process never starts, or terminates unexpectly, writing to it raises SIGPIPE.
 Or output to a socket that isn't connected.
 */

/**
 * func
 * SIG_DFL default
 * SIG_IGN Ignore
 * customize: void handler_function(int parameter)
 */
void (*signal(int sig, void (*func)(int))) (int);
```

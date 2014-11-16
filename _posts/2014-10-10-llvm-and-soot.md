---
title: LLVM and Soot
location: Ames
time: 12:07:25
---

# LLVM

## Program1

#### Call graph

```c
static void D() { }
static void Y() { D(); }
static void X() { Y(); }
static void C() { D(); X(); }
static void B() { C(); }
static void S() { D(); }
static void P() { S(); }
static void O() { P(); }
static void N() { O(); }
static void M() { N(); }
static void G() { M(); }
static void A() { B(); G(); }

int main() {
  A();
}
```

Command to generate `Call Graph`:

```sh
clang++ -S -emit-llvm main.cpp -o - > clang.out
opt -analyze -dot-callgraph clang.out
dot -Tpng -ocall.png callgraph.dot
```

The call graph: `llvm1cg.png`

#### Control Flow Graph

commands

```
clang++ -S -emit-llvm main.cpp -o - > clang.out
opt -analyze -dot-cfg clang.out
for fname in *; do dot -Tpng -o$fname.png $fname; done
```

The control flow graph package: `llvm1cfg.tar.gz`.

#### Dependence Graph

Command to Generate

```
clang -O3 -emit-llvm main.cpp -c -o main.bc
opt -load ./LLVMHebi.dylib -print-control-deps ~/Desktop/tmp/main.bc
```

## Program2

```c
#include <stdio.h>

int sum(int a, int b) {
    return a+b;
}

int main() {
  sum(3,5);
  printf("hello world\n");
  return 0;
}
```

#### Dependence Graph

```
clang -O3 -emit-llvm main.cpp -c -o main.bc
opt -load ./LLVMHebi.dylib -print-control-deps ~/tmp/llvm/main.bc # => control-deps.sum.dot, control-deps.main.dot
```

Convert them to PNG files:

```

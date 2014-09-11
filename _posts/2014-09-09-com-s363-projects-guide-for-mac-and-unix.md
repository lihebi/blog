---

layout: hebi-post
title: Com S363 Projects Guide for Mac and Unix
location: Ames, IA
time: 22:33:02

---

If you are not familiar with command line, learn yourself. Links below may help.

**You can NOT use your home network to access pyrite server. Please use school internet.**

#Environment Setup
If you use mac, you may already have java environment set up for you. To check this, go to terminal and execute this command:

```
javac
```

If there outputs usage message, then you are set. Otherwise the system will inform you to download jdk from oracle website. Just follow the steps there.

If you use Unix/Linux, there are tutorials about how to set up jdk in your system on oracle website too. If you use distributions that have package manager, search them first because they are always easier to do.

In particular, try this:

```
#for ubuntu
apt-get install openjdk
#for redhat & centos
yum install openjdk
```

Note: `openjdk` is an open source implementation of oracle jdk.

#Instructions for Project0

##A. CyDIW
Download CyDIW zip package from course website and unzip it. In the terminal, `cd` to `CyDIW` directory and run:

```
./StartCyDIW.bash
```

The GUI will appear. Follow the same instructions on the course website for windows to complete `XQuery-Saxon Demo`.

##B. Java

###compile java file
For some reason the `CyDIW` client can't execute `javac` command. So you should compile the `.java` file to `.class` file before run it in `CyDIW`.

To compile the file `ComS363/Demos/A_Java_Demo/Java_Demo.java`, go to that directory in terminal, and type

```
javac Java_Demo.java
```

###run in commandline(Optional)
Now if you run `ls` command, you should see the output file `Java_Demo.class`. Instead of run it in `CyDIW`, you can just type `java Java_Demo`, and the output should appear.

###modify command file
The file `Compile_and_run_Java_from_CyDIW_Demo.txt` has to be modified before run in Mac or Unix. The program should be:

```
$OS:> java -cp ComS363/Demos/A_Java_Demo Java_Demo
```

Note:

* In Mac/Unix, there's no need to set environment variables `PATH` and `CLASSPATH`, since it is set in the system level. Be sure to remove or comment out the `OS:>set ...` part.
* The redirect function `> output.txt` didn't work in `CyDIW`

##C. Configuration of CyDIW for MySQL
follow the same instructions for windows.

##D. Setup JDBC and run a demo
### Add information in java source file
in JDBC_Demo.java, you should replace `dbUrl`, `user` and `password` to your own.
### compile
go to the folder `ComS363/Demos/A_JDBC_Demo`, type:

```
javac JDBC_Demo.java
```

###run in CyDIW
modify the file `Compile_and_run_JDBC_from_CyDIW_Demo.txt` to the codes below:

```
java -cp ComS363/Demos/A_JDBC_Demo:ComS363/Demos/A_JDBC_Demo/mysql-connector-java-5.0.5.jar:$CLASSPATH JDBC_Demo
```

Note:

* remove or comment out the enviroment path set part
* if you can't find the file `mysql-connector-java-5.0.5.jar`(at least I didn't find it), download it [here](http://dev.mysql.com/downloads/connector/j). Be sure to make the filename the same as the file you downloaded(currently the newest is 5.1.32). Put the file into the folder `ComS363/Demos/A_JDBC_Demo`

#Submit Instruction

###1. Compress
Compress the folder you are going to submit.
Just right click and choose `compress`

Now say you have the file `P0.zip` ready to go.
###2. Send to Pyrite Server
in terminal, `cd` to your folder that contains `P0.zip`. run the command:

```
scp P0.zip id@pyrite.cs.iastate.edu:/~
```
where `id` is your net-ID. You will be asked to enter your password.
###3. Connect to Pyrite
connect to `pyrite` using ssh:

```
ssh id@pyrite.cs.iastate.edu
```

###4. Unzip file
now you run `ls`, you should see `P0.zip`. run

```
unzip P0.zip
```
you will get the folder back.

###5. Submit
```
turnin cs363 Fall2014/ProjectP0 P0 
```



#Getting Help
If you have any questions, contact me by email:
[hebi at iastate.edu](mailto: hebi@iastate.edu).

Btw, I'm Hebi Li.

##quick links
[Course Website](http://www.cs.iastate.edu/~cs363)

[Getting Help page on Course Website](http://www.cs.iastate.edu/~cs363/Getting_Help/Getting_Help.htm)

[SSG support](https://support.cs.iastate.edu/)

[Linux Reference](https://support.cs.iastate.edu/doku.php/faq/linuxref)

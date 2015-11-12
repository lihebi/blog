---
title: Project P1 for ComS363
location: Ames, IA
time: 15:39:18
---

# Frequent Errors
* forget semi-colons
* Use proper case(upper or lower) for table name. It doesn’t matter for collumn names.

# create and load tables

```
$MySQL:> drop table Person;

$MySQL:> drop table Instructor;
$MySQL:> drop table Student;
$MySQL:> drop table Course;
$MySQL:> drop table Offering;
$MySQL:> drop table Enrollment;
$MySQL:> create table Person (
    Name char (20),
    ID char (9) not null,
    Address char (30),
    DOB date,
    Primary key(ID)
);

$MySQL:> create table Instructor (
    InstructorID char (9) not null references Person,
    Rank char (12),
    Salary Integer,
    Primary Key (InstructorID)
);
$MySQL:> create table Student (
    StudentID char (9) not null references Person,
    Classification char (10),
    GPA double,
    MentorID char (9) references Instructor,
    CreditHours integer,
    Primary Key (StudentID)
);

$MySQL:> create table Course (
    CourseCode char (6) not null,
    CourseName char (50),
    PreReq char (6)
);
$MySQL:> create table Offering (
    CourseCode char (6) not null,
    SectionNo int not null,
    InstructorID char (9) not null references Instructor,
    Primary Key (CourseCode, SectionNo)
);

$MySQL:> create table Enrollment (
    CourseCode char (6) not null,
    SectionNo int not null,
    StudentID char (9) not null references Student,
    Grade char (4) not null,
    primary key (CourseCode, StudentID),
    foreign key (CourseCode, SectionNo) references Offering
);
```

# query

13

```sql
select s.studentid, i.instructorid from Student s, Instructor i where s.gpa > 3.8
```

14

```sql
select distinct e.CourseCode, e.SectionNo from Student s, Enrollment e where s.Classification = ‘Sophomore’;
```

15

```sql
select distinct p.name, i.Salary from Instructor i, Person p, Student s where s.Classification = ‘Freshman’;
```

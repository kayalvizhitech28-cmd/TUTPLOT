create schema tutplot1;
create table tutplot1.login (
management_id int primary key, 
email_id varchar(50),
password varchar(20),
mobile_number varchar(12),
);
select * from tutplot1.login;

alter table tutplot1.login
add management_code as ('MGE'+right('000'+cast(management_id as varchar(20)),3)) persisted;

create table tutplot1.student_application_table1 (
student_id int primary key,
date_of_birth date,
gender varchar(10),
address varchar(50),
district varchar(20),
pincode int,
);
select*from tutplot1.student_application_table1;

alter table tutplot1.student_application_table1
add student_code as ('SDT'+right('000'+cast(student_id as varchar(20)),3)) persisted;

create table tutplot1.student_application_table2 (
educational_details_id int primary key identity(1,1),
admission_for_class int,
name_of_the_board varchar(20),
medium_of_study varchar(10),
academic_year int,
groups_and_subjects varchar(20),
branch varchar(50),
);
select * from tutplot1.student_application_table2;

alter table tutplot1.student_application_table2
add educational_code as ('EDC'+right('000'+cast(educational_details_id as varchar(20)),3)) persisted;


create table tutplot1.student_application_table3 (
fees_id varchar(20) primary key,
admission_fees int,
subject_fees int,
total_fees int,
);
select*from tutplot1.student_application_table3;

alter table tutplot1.student_application_table3
add fees_code as ('FEE'+right('000'+cast(fees_id as varchar(20)),3)) persisted;


create table tutplot1.student_application_table4 (
parentdetails_id varchar(20) primary key,
father_name varchar(30),
mother_name varchar(30),
occupation varchar(30),
fathers_mobile_no varchar(12),
mothers_mobile_no varchar(12),
fathers_email varchar(50),
mothers_email varchar(50),
);
select*from tutplot1.student_application_table4;

alter table tutplot1.student_application_table4
add pd_code as ('PDC'+right('000'+cast(parentdetails_id as varchar(20)),3)) persisted;


create table tutplot1.student_application_table01 (
student_id int primary key,
student_name varchar(30),
date_of_birth date,
class int,
mother_name varchar(30),
father_name varchar(30),
school_name varchar(90),
address varchar(50),
contact_number varchar(12),
);
select*from tutplot1.student_application_table01;


alter table tutplot1.student_application_table01
add student_code as ('SDT'+right('000'+cast(student_id as varchar(20)),3)) persisted;

ALTER TABLE tutplot1.student_application_table01
ADD total_fees int,
    pending_fees int;

ALTER TABLE tutplot1.student_application_table01
ADD group_class varchar(90);
  

create table tutplot1.staff_application_table1 (
staff_id int primary key,
date_of_birth date,
gender varchar(10),
address varchar(50),
district varchar(20),
pincode int,
);
select*from tutplot1.staff_application_table1;

alter table tutplot1.staff_application_table1
add staff_code as ('STF'+right('000'+cast(staff_id as varchar(20)),3)) persisted;


create table tutplot1.staff_application_table2 (
gd_id int primary key,
email_id int,
mobile_no varchar(12),
qualification varchar(20),
specialization varchar(20),
joining_date date,
);
select*from tutplot1.staff_application_table2;

alter table tutplot1.staff_application_table2
add gd_code as ('GDC'+right('000'+cast(gd_id as varchar(20)),3)) persisted;


create table tutplot1.staff_application_table01 (
staff_id int primary key,
staff_name varchar(30),
date_of_birth date,
address varchar(50),
contact_number varchar(12),
email_id int,
qualification varchar(20),
specialization varchar(20),
joining_date date,
);
select*from tutplot1.staff_application_table01;

alter table tutplot1.staff_application_table01
add staff_code as ('STF'+right('000'+cast(staff_id as varchar(20)),3)) persisted;

create table tutplot1.fees_details_table (
payment_id int primary key,
student_id int,
total_fees int,
fees_paid int,
date_of_pay date,
pending_fees int,
);
select*from tutplot1.fees_details_table;

ALTER TABLE tutplot1.fees_details_table
ADD CONSTRAINT FK_fees_student
FOREIGN KEY (student_id)
REFERENCES tutplot1.student_application_table1(student_id);


alter table tutplot1.fees_details_table
add payment_code as ('PAY'+right('000'+cast(payment_id as varchar(20)),3)) persisted;

create table tutplot1.timetable_table (
subject_id int primary key,
subject_name varchar(20),
day varchar(20),
handling_staff varchar(20),
);
select*from tutplot1.timetable_table;

alter table tutplot1.timetable_table
add subject_code as ('SUB'+right('000'+cast(subject_id as varchar(20)),3)) persisted;

create table tutplot1.exam_table (
exam_id int primary key,
exam varchar(30),
date_of_exam date,
);
select*from tutplot1.exam_table;

alter table tutplot1.exam_table
add exam_code as ('EXAM'+right('000'+cast(exam_id as varchar(20)),3)) persisted;

create table tutplot1.mark_table (
mark_id int primary key,
exam_id int,
student_id int,
marks int,
total int,
);
select*from tutplot1.mark_table;

alter table tutplot1.mark_table
add mark_code as ('MARK'+right('000'+cast(mark_id as varchar(20)),3)) persisted;

create table tutplot1.mark_table (
mark_id int primary key,
exam_id int,
student_id int,
marks int,
total int,
);
select*from tutplot1.mark_table;

create table tutplot1.mark_table01 (
mark_id int primary key,
exam_id int,
student_id int,
student_name varchar(20),
class_name varchar(20),
subject_name varchar(20),
subject_code varchar(20),
marks int,
total int,
);
select*from tutplot1.mark_table01;

create table tutplot1.attendance_table (
attendence_id int primary key,
student_id int,
staff_id int,
status varchar(20),
date_of_exam date,
);
select*from tutplot1.attendance_table;

alter table tutplot1.attendance_table
add attendence_code as ('ADC'+right('000'+cast(staff_id as varchar(20)),3)) persisted;
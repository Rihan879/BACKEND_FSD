Experiment 7. Create a new database named studentDB with a collections students

use studentDB
switched to db studentDB
db.createCollection("students")
{ ok: 1 }
show dbs
EmployeeDB   40.00 KiB
Student      64.00 KiB
admin        40.00 KiB
collegeDB    40.00 KiB
config      108.00 KiB
local        72.00 KiB
studentDB     8.00 KiB
show collections
students
db.students.insertOne({
    name: "Rihan",
    rollNo: 913,
    department: "CSE"
})
{
  acknowledged: true,
  insertedId: ObjectId('6afff3155df7b148d191682f')
}
db.students.find()
{
  _id: ObjectId('6afff3155df7b148d191682f'),
  name: 'Rihan',
  rollNo: 913,
  department: 'CSE'
}

Experiment 8.  Perform the following on studentDB .students collection insert 5 students records find all students older than 20 update a student's age using $set.Delete one student*

use studentDB
switched to db studentDB
db.students.insertMany([
    {rollNo: 101, name: "Rihan", age: 20, course: "CSE"},
    {rollNo: 102, name: "Aman", age: 19, course: "CSE"},
    {rollNo: 103, name: "Rahul", age: 22, course: "IT"},
    {rollNo: 104, name: "Priya", age: 20, course: "ECE"},
    {rollNo: 105, name: "Neha", age: 23, course: "CSE"}
])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6afff5f315af64a304f59e92'),
    '1': ObjectId('6afff5f315af64a304f59e93'),
    '2': ObjectId('6afff5f315af64a304f59e94'),
    '3': ObjectId('6afff5f315af64a304f59e95'),
    '4': ObjectId('6afff5f315af64a304f59e96')
  }
}
db.students.find({age: {$gt: 20}})
{
  _id: ObjectId('6afff5f315af64a304f59e94'),
  rollNo: 103,
  name: 'Rahul',
  age: 22,
  course: 'IT'
}
{
  _id: ObjectId('6afff5f315af64a304f59e96'),
  rollNo: 105,
  name: 'Neha',
  age: 23,
  course: 'CSE'
}
db.students.updateOne(
    {name: "Rihan"},
    {$set: {rollNo: 913}}
)
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 0,
  upsertedCount: 0
}
db.students.deleteOne({name: "Aman"})
{
  acknowledged: true,
  deletedCount: 1
}
db.students.find()
{
  _id: ObjectId('6afff3155df7b148d191682f'),
  name: 'Rihan',
  rollNo: 913,
  department: 'CSE'
}
{
  _id: ObjectId('6afff5f315af64a304f59e92'),
  rollNo: 101,
  name: 'Rihan',
  age: 20,
  course: 'CSE'
}
{
  _id: ObjectId('6afff5f315af64a304f59e94'),
  rollNo: 103,
  name: 'Rahul',
  age: 22,
  course: 'IT'
}
{
  _id: ObjectId('6afff5f315af64a304f59e95'),
  rollNo: 104,
  name: 'Priya',
  age: 20,
  course: 'ECE'
}
{
  _id: ObjectId('6afff5f315af64a304f59e96'),
  rollNo: 105,
  name: 'Neha',
  age: 23,
  course: 'CSE'
}
studentDB



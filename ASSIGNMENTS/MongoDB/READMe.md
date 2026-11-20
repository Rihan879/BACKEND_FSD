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



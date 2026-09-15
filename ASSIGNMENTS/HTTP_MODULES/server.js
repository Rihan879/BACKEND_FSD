const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    if (req.url == "/" && req.method == "GET") {

        res.write(`
            <h1>Student Record System</h1>

            <form action="/add" method="POST">
                Name: <input name="name"><br><br>
                Roll No: <input name="roll"><br><br>
                Course: <input name="course"><br><br>
                Email: <input name="email"><br><br>

                <button>Add Student</button>
            </form>

            <br>
            <a href="/students">View Students</a>
        `);

        res.end();
    }

    else if (req.url == "/add" && req.method == "POST") {

        let body = "";

        req.on("data", function(data) {
            body += data;
        });

        req.on("end", function() {

            let x = body.split("&");

            let student = {
                name: x[0].split("=")[1].replaceAll("+", " "),
                roll: x[1].split("=")[1],
                course: x[2].split("=")[1].replaceAll("+", " "),
                email: x[3].split("=")[1]
            };

            fs.readFile("students.json", "utf8", function(err, data) {

                let students = JSON.parse(data);

                students.push(student);

                fs.writeFile("students.json",
                    JSON.stringify(students),
                    function() {
                        res.end("Student Added Successfully");
                    }
                );
            });
        });
    }

    else if (req.url == "/students") {

        fs.readFile("students.json", "utf8", function(err, data) {

            let students = JSON.parse(data);

            res.write("<h1>Student Records</h1>");

            for (let i = 0; i < students.length; i++) {

                res.write(
                    "Name: " + students[i].name + "<br>" +
                    "Roll: " + students[i].roll + "<br>" +
                    "Course: " + students[i].course + "<br>" +
                    "Email: " + students[i].email + "<br><br>"
                );
            }

            res.end();
        });
    }
});

server.listen(3000, function() {
    console.log("Server running at http://localhost:3000");
});
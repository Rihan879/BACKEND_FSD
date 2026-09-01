const fs = require('fs');

// Create
fs.writeFile('demo.txt', 'Hello World', (err) => {
    if (err) throw err;
    console.log('File created.');

    // Read
    fs.readFile('demo.txt', 'utf8', (err, data) => {
        if (err) throw err;
        console.log('File content:', data);

        // Update (Append)
        fs.appendFile('demo.txt', '\nWelcome to Node.js', (err) => {
            if (err) throw err;
            console.log('File updated.');

            // Read updated file
            fs.readFile('demo.txt', 'utf8', (err, updatedData) => {
                if (err) throw err;
                console.log('Updated content:\n' + updatedData);

                // Delete
                fs.unlink('demo.txt', (err) => {
                    if (err) throw err;
                    console.log('File deleted.');
                });
            });
        });
    });
});
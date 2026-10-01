import { useState } from "react";

const App = () => {
  const [search, setSearch] = useState("");

  const documents = [
    {
      name: "FSD",
      file: "FSD-Node.pdf",
    },
    {
      name: "React",
      file: "React-Notes.pdf",
    },
    {
      name: "JavaScript",
      file: "JavaScript-Notes.pdf",
    },
  ];

  return (
    <div>
      <h1>Notes Portal App</h1>

      <input
        type="text"
        placeholder="🔍 Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
          padding: "12px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      {documents
        .filter((doc) =>
          doc.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((doc) => (
          <div key={doc.file}>
            <h2>{doc.name}</h2>

            <a
              href={`http://localhost:5000/files/${doc.file}`}
              download
            >
              <button>Download</button>
            </a>
          </div>
        ))}
    </div>
  );
};

export default App;
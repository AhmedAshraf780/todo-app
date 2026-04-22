import express from 'express';
import cors from 'cors';


const notes = []
const todos = []
const projects = []

const app = express();
app.use(express.json())

app.use(cors({
  origin: 'http://localhost:5173',
}));

/*
 *
 * ASHRAF CODE
 * */
app.get("/projects", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Projects retrieved successfully",
    projects
  });
})

app.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const project = projects.find(project => project.id === id)
  res.status(200).json({
    ok: true,
    message: "Project retrieved successfully",
    project
  });
})

app.post("/projects", (req, res) => {
  const { name, description } = req.body;
  const project = {
    id: projects.length + 1,
    name,
    description,
  }
  projects.push(project)
  res.status(200).json({
    ok: true,
    message: "Project created successfully",
    project
  });
})

app.put("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const project = projects.find(project => project.id === parseInt(id, 10))
  console.log(project)
  project.name = name
  project.description = description
  res.status(200).json({
    ok: true,
    message: "Project updated successfully",
    project
  });
})
app.delete("/projects/:id", (req, res) => {
  const { id } = req.params;
  const project = projects.find(project => project.id === id)
  projects.splice(projects.indexOf(project), 1)
  res.status(200).json({
    ok: true,
    message: "Project deleted successfully",
    project
  });
})

app.get('/', (req, res) => {
  res.send('Welcome to our todo-app');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 

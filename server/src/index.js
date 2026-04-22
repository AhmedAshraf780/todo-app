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

/*

khalx CODE

*/

app.get('/todos', (req, res) => {
    res.status(200).json({
        ok: true,
        message: "Todos retrieved successfully",
        todos
    });
})

app.post('/todos', (req, res) => {
    const { name } = req.body;

    todos.push(name, id = todos.length + 1, completed = false)
    res.status(200).json({
        ok: true,
        message: "Todo created successfully"
    });
})

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const todo = todos.find(todo => todo.id == id)
    todo.completed = completed
    res.status(200).json({
        ok: true,
        message: "Todo updated successfully"
    });
})

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todo = todos.find(todo => todo.id == id)
    todos.splice(todos.indexOf(todo), 1)
    res.status(200).json({
        ok: true,
        message: "Todo deleted successfully"
    });
})

app.get('/', (req, res) => {
    res.send('Welcome to our todo-app');
});



//=================================================================
/*

HIMAS CODE

*/
app.post('/notes', (req, res) => {
    const note = {
        id: notes.length + 1,
        title: req.body.title,
        content: req.body.content
    };

    notes.push(note);
    res.status(201).json(note);
});
app.get('/notes', (req, res) => {
    res.json(notes);
});
app.put('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const note = notes.find(n => n.id === id);

    if (!note) {
        return res.status(404).send('Note not found');
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    res.json(note);
});
app.delete('/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = notes.findIndex(n => n.id === id);

    if (index === -1) {
        return res.status(404).send('Note not found');
    }

    notes.splice(index, 1);

    res.send('Note deleted');
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//


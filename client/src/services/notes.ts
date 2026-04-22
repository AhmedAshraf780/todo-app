const BASE_URL = 'http://localhost:3000'

export interface Note {
    id: number
    title: string
    content: string // We will use 'content' to store 'pending' or 'completed'
}

const notesService = {
    getAll: async (): Promise<Note[]> => {
        const res = await fetch(`${BASE_URL}/notes`)
        if (!res.ok) throw new Error('Failed to fetch notes')
        return await res.json()
    },

    create: async (title: string): Promise<Note> => {
        const res = await fetch(`${BASE_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content: 'pending' })
        })
        if (!res.ok) throw new Error('Failed to create note')
        return await res.json()
    },

    updateCompletion: async (id: number, completed: boolean): Promise<Note> => {
        const res = await fetch(`${BASE_URL}/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: completed ? 'completed' : 'pending' })
        })
        if (!res.ok) throw new Error('Failed to update note')
        return await res.json()
    },

    delete: async (id: number): Promise<void> => {
        const res = await fetch(`${BASE_URL}/notes/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to delete note')
    }
}

export default notesService

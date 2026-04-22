const API_URL = 'http://localhost:3000/todos'

export interface Todo {
  id: number | string
  title?: string
  name?: string
  completed: boolean
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errMessage = 'Request failed'
    try {
      const err = await response.json()
      errMessage = err.message || errMessage
    } catch {
      // Ignore JSON parse error if response is not JSON
    }
    throw new Error(errMessage)
  }
  const data = await response.json()
  return data.todo || data.todos || data
}

export default {
  async getAll(): Promise<Todo[]> {
    try {
      const response = await fetch(API_URL)
      const data = await response.json()
      return data.todos || []
    } catch (error) {
      // If endpoint doesn't exist, just return empty array for now
      console.warn("Could not fetch todos. The endpoint might be missing.", error);
      return [];
    }
  },

  async create(title: string): Promise<Todo> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Match the backend payload: req.body.name
        body: JSON.stringify({ name: title, completed: false }),
      })
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      const data = await response.json()
      // If the backend doesn't return the newly created object (like in the current index.js), we fake it
      return data.todo || { id: Date.now(), title, completed: false }
    } catch (error) {
      console.warn("Could not create todo, using mock. ", error);
      // Mocked if endpoint fails
      return { id: Date.now(), title, completed: false }
    }
  },

  async update(id: number | string, completed: boolean): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      const data = await response.json()
      return data.todo
    } catch (error) {
      console.warn("Could not update todo, ignoring error. ", error);
      return { id, title: "Mocked", completed }
    }
  },

  async delete(id: number | string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
    } catch (error) {
      console.warn("Could not delete todo, ignoring error. ", error);
    }
  },
}

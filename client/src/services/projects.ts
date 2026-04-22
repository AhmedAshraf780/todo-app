const BASE_URL = 'http://localhost:3000'

export interface Project {
  id: number
  name: string
  description: string
}

export interface ApiResponse<T = undefined> {
  ok: boolean
  message: string
  project?: Project
  projects?: Project[]
}

const projectsService = {
  /** GET /projects — fetch all projects */
  getAll: async (): Promise<Project[]> => {
    const res = await fetch(`${BASE_URL}/projects`)
    const data: ApiResponse = await res.json()
    if (!data.ok) throw new Error(data.message)
    return data.projects ?? []
  },

  /** GET /projects/:id — fetch single project */
  getById: async (id: number): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`)
    const data: ApiResponse = await res.json()
    if (!data.ok) throw new Error(data.message)
    return data.project!
  },

  /** POST /projects — create a new project */
  create: async (name: string, description: string): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    const data: ApiResponse = await res.json()
    if (!data.ok) throw new Error(data.message)
    return data.project!
  },

  /** PUT /projects/:id — update an existing project */
  update: async (id: number, name: string, description: string): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    })
    const data: ApiResponse = await res.json()
    if (!data.ok) throw new Error(data.message)
    return data.project!
  },

  /** DELETE /projects/:id — delete a project */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/projects/${id}`, { method: 'DELETE' })
    const data: ApiResponse = await res.json()
    if (!data.ok) throw new Error(data.message)
  },
}

export default projectsService

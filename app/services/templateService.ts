/**
 * TEMPLATE - À suivre pour créer chaque nouveau service
 *
 * Copier ce fichier et le renommer : [resourceName]Service.ts
 * Remplacer les placeholders par les données réelles
 */

// 1. Définir les types (correspond à votre API .NET)
interface CustomResource {
  id: number
  // Ajouter tous les champs
  // Exemple:
  // name: string
  // email: string
  // createdAt: string
}

interface CreateCustomResource {
  name: string
  // Ajouter les champs créé par l'utilisateur (pas d'ID, ni timestamps)
  // Exemple:
  // name: string
  // email: string
}

/**
 * Service de gestion de [CustomResourceName]
 *
 * Les méthodes doivent correspondre à l'API REST :
 * - GET /[resource]          -> getAll()
 * - GET /[resource]/{id}     -> getById()
 * - POST /[resource]         -> create()
 * - PUT /[resource]/{id}     -> update()
 * - DELETE /[resource]/{id}  -> delete()
 */
export const yourResourceService = {
  /**
   * Récupère toutes les ressources
   * @returns Liste de toutes les ressources
   */
  async getAll(): Promise<CustomResource[]> {
    return useApi<CustomResource[]>('/your-resource')
  },

  /**
   * Récupère une ressource par son ID
   * @param id ID de la ressource
   * @returns La ressource trouvée
   */
  async getById(id: number): Promise<CustomResource> {
    return useApi<CustomResource>(`/your-resource/${id}`)
  },

  /**
   * Crée une nouvelle ressource
   * @param data Données de la ressource à créer
   * @returns La ressource créée (avec ID assigné par le serveur)
   */
  async create(data: CreateCustomResource): Promise<CustomResource> {
    return useApi<CustomResource>('/your-resource', {
      method: 'POST',
      body: data
    })
  },

  /**
   * Met à jour une ressource
   * @param id ID de la ressource
   * @param data Données à mettre à jour (partiel ok)
   * @returns La ressource mise à jour
   */
  async update(id: number, data: Partial<CreateCustomResource>): Promise<CustomResource> {
    return useApi<CustomResource>(`/your-resource/${id}`, {
      method: 'PUT',
      body: data
    })
  },
  // POUR DES CAS METIERS ----------------------
  /**
   * Supprime une ressource
   * @param id ID de la ressource
   */
  async delete(id: number): Promise<string> {
    return useApi<string>(`/your-resource/${id}`, {
      method: 'DELETE'
    })
  },

  /**
   * Exemple : Récupérer des ressources avec filtres
   */
  async getFiltered(filter: string): Promise<CustomResource[]> {
    return useApi<CustomResource[]>('/your-resource', {
      query: { filter }
    })
  },

  /**
   * Exemple : Récupérer des ressources paginées
   */
  async getPaginated(page: number, limit: number): Promise<{ data: CustomResource[], total: number }> {
    return useApi<{ data: CustomResource[], total: number }>('/your-resource', {
      query: { page, limit }
    })
  }
}

export default yourResourceService

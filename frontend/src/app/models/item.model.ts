// interfaces (user, item...)
// cómo es un item frontend, qué devuelve fastAPI para un item
export interface Item {
    // integer del backend
    id: number;
    title: string;
    description: string;
    category: string;
    // ? puede existir o no, evitamos errores si es null
    image_url?: string;
    owner_id: number;
}
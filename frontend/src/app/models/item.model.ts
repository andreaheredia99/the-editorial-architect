// interfaces (user, item...)
// cómo es un item frontend, qué devuelve fastAPI para un item
export interface Item {
    // integer del backend
    id: number;
    title: string;
    description: string;
    owner_id: number;
}
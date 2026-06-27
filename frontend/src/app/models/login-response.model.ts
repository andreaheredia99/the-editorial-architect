// qué devuelve el backend, devuelve JWT

export interface LoginResponse {
    access_token: string;
    role: string;
    user_id: number;
    email: string;
}
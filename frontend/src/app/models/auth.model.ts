// Definimos la forma de los datos, email y password de entrada y access_token de salida

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
}

// Backend devuelve JSON, Angular necesita tiparlo.
export interface RegisterResponse {
    message: string;
}
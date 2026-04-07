export interface Alimento {
    id?: string;            // El código de barras o ID interno
    nombre: string;
    marca: string;
    imagen: string;
    nutriscore?: string;    // La letra (A, B, C, D, E)
    calorias: number;       // kcal por 100g
    carbohidratos: number;
    proteinas: number;
    grasas: number;
    cantidadSeleccionada?: number; // Para cuando el usuario anote cuánto ha comido
}
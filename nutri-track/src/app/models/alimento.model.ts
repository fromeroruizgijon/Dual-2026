export interface Alimento {
    id?: string;
    nombre: string;
    categoria: string; // Antes era 'marca'
    imagen: string;
    calorias: number;
    carbohidratos: number;
    proteinas: number;
    grasas: number;
    cantidadSeleccionada?: number;
    instrucciones?: string; // Para los pasos de la receta
    listaIngredientes?: string[]; // Array limpio de ingredientes
}
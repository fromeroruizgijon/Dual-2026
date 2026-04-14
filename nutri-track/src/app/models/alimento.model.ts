export interface Alimento {
    id?: string;
    nombre: string;
    marca: string;
    imagen: string;
    nutriscore?: string;
    calorias: number;
    carbohidratos: number;
    proteinas: number;
    grasas: number;
    cantidadSeleccionada?: number;
    ingredientesTags?: string[];
    ingredientesTexto?: string; // Añadido para que coincida con el servicio
    alergenosTags?: string[];
}
/*
# Symbol
Symbol es un tipo de dato de JS que representa un valor único e 
irrepetible durante la ejecución del programa.
Los símbolos se crean llamando a la función: Symbol()
Noten que lleva mayúscula la primera letra, y no lleva un "new".

Opcionalmente, puede recibir un parámetro que es una descripción del
símbolo.
Funcionalmente, esa descripción *no hace nada*. Solo sirve para fines
de depuración (que la consola nos muestre esa descripción).

Se usan principalmente como identificadores únicos de alguna clave.
*/
// export const GLOBAL_FEEDBACK_PROVIDE_KEY = 'global-feedback';
export const GLOBAL_FEEDBACK_PROVIDE_KEY = Symbol('Global Feedback');
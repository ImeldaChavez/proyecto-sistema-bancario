//Punto de entrada de la aplicación
//Imports
import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";
import { generarId } from "./utils/helpers.js";
import {
	formatCurrency,
	formatDate,
	formatAccountNumber,
} from "./utils/formatters.js";

console.log("Sistema de Gestión Bancaria - V0.2.0");

// Validación de campo debe mostrar true
console.log("Campo obligatorio:", validarCampoObligatorio("Banco Digital"));

// Probar validación del monto debe regresar True
console.log("Monto válido:", validarMonto(1000));

// Generamos un identificador dinámico
console.log("ID generado:", generarId());

// Convertimos 1500 a formato monetario MXN
console.log("Monto formateado:", formatCurrency(1500));

// Formateamos la fecha actual
console.log("Fecha formateada:", formatDate(new Date()));

// Separamos visualmente cada cuatro dígitos
console.log("Número de cuenta:", formatAccountNumber("123456789012"));

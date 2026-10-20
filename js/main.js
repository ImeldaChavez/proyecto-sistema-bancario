//Punto de entrada de la aplicación
//Imports
import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";
import { generarId } from "./utils/helpers.js";
import {
	formatCurrency,
	formatDate,
	formatAccountNumber,
} from "./utils/formatters.js";

//Imports de clases
import { Usuario } from "./models/usuario.js";
import { Cuenta } from "./models/cuenta.js";
import { Movimiento } from "./models/movimiento.js";

//Imports banco
import { Banco } from "./models/banco.js";

//Banco
const bancoDemo = new Banco();

//Usuario
const usuarioDemo = new Usuario({
	nombre: "Imelda Chavez",
	email: "imeldaguadalupe.chavez@bbva.com",
	telefono: "4981011957",
	password: "sip07sip",
});

console.log("Usuario: ", usuarioDemo);

//Agragar usuario a banco
bancoDemo.agregarUsuario(usuarioDemo);

console.log("Uusuarios regsitrados en BancoDemo:", bancoDemo.usuarios);

//Cuenta asociada al usuario
const cuentaDemo = new Cuenta({
	numeroCuenta: "123456789012",
	usuarioId: usuarioDemo.id,
});

console.log("Cuenta: ", cuentaDemo);

//Agregar cuenta al banco
bancoDemo.agregarCuenta(cuentaDemo);

//Depositar
cuentaDemo.depositar(1000);

console.log("Saldo depositado: ", formatCurrency(cuentaDemo.saldo));

//Movimiento
const movimientoDemo = new Movimiento({
	tipo: "DEPOSITO",
	monto: 1000,
	descripcion: "Depósito inicial",
	cuentaOrigen: cuentaDemo.id,
	saldoResultante: cuentaDemo.saldo,
});

console.log("Movimiento: ", movimientoDemo);

console.log("Movs registrados: ", bancoDemo.movimientos);

//Busqueda por ID
const usuarioEncontrado = bancoDemo.buscarUsuarioPorId(usuarioDemo.id);

// MUESTRA SI LO ENCONTRO
console.log("Usuario encontrado:", usuarioEncontrado);

console.log(usuarioEncontrado === usuarioDemo);

// PRUEBA DE OBTENER LAS CUENTAS USUARIO
const cuentasUsuario = bancoDemo.obtenerCuentasDeUsuario(usuarioDemo.id);

// MOSTRAMOS CUALES SON SUS CUENTAS
console.log("Cuentas del usuario:", cuentasUsuario);

// PRUEBA CON REGAL NEGATIVA
// Intentamos realizar un depósito con un monto inválido.
try {
	bancoDemo.realizarDeposito({
		cuentaId: cuentaDemo.id,
		monto: -500,
	});
} catch (error) {
	console.log("Error controlado:", error.message);
}

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

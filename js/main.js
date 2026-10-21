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

//Imports Services
import { STORAGE_KEYS, storageService } from "./services/storageService.js";

//Guardar estado del banco
//Recibe una instancia de Banco y persiste sus tres coleccioes.
function guardarBanco(banco) {
	//Guardar usuarios
	storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);

	//Guardar cuentas
	storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);

	//Guardar movimientos
	storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);
}

//Cargar banco
//Recupera la información persistida, reconstruye cada instancia y finalmente crea nuevamente el banco.
function cargarBanco() {
	//Recuperar usuarios
	const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

	//Recuperar cuentas
	const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

	//Recuperar movimientos
	const movimientosGuardados = storageService.obtener(
		STORAGE_KEYS.MOVIMIENTOS,
		[],
	);

	//Reconstruir usuarios
	const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));

	//Reconstruir cuentas
	const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));

	//Reconstrour movimeintos
	const movimientos = movimientosGuardados.map(
		(movimiento) => new Movimiento(movimiento),
	);

	//Crear nuevamente el banco
	return new Banco({
		usuarios,
		cuentas,
		movimientos,
	});
}

//Banco
const bancoDemo = cargarBanco();

if (bancoDemo.usuarios.length === 0) {
	//Crear usuario inicial
	const usuarioDemo = new Usuario({
		nombre: "Juan Suarez",
		email: "juan@correo.com",
		telefono: "5512345678",
		password: "123456",
	});

	//Registrar usuario
	bancoDemo.agregarUsuario(usuarioDemo);

	//Crear cuenta inicial
	const cuentaDemo = new Cuenta({
		numeroCuenta: "123456789012",
		usuarioId: usuarioDemo.id,
	});

	//Registrar cuenta
	bancoDemo.agregarCuenta(cuentaDemo);

	//Deposito inicial
	bancoDemo.realizarDeposito({
		cuentaId: cuentaDemo.id,
		monto: 1000,
		descripcion: "Depósito inicial",
	});

	//Guardar banco
	guardarBanco(bancoDemo);

	//Mostrar banco recuperado
	console.log("Banco recuperado:", bancoDemo);

	//Mostrar usuarios
	console.log("Usuarios almacenados:", bancoDemo.usuarios);

	//Mostrar cuentas
	console.log("Cuentas almacenadas:", bancoDemo.cuentas);

	//Mostrar movimeintos
	console.log("Movimientos almacenados:", bancoDemo.movimientos);

	//Obtener primera  cuenta
	const cuentaPrincipal = bancoDemo.cuentas[0] || null;
}

//Usuario y cuenta de demostración ya cargados o creados al iniciar el banco.
const usuarioDemo = bancoDemo.usuarios[0] || null;

//Comprobar datos recuperados
// MOSTRAR BANCO RECUPERADO
console.log("Banco recuperado:", bancoDemo);

// MOSTRAR USUARIOS
console.log("Usuarios almacenados:", bancoDemo.usuarios);

// MOSTRAR CUENTAS
console.log("Cuentas almacenadas:", bancoDemo.cuentas);

// MOSTRAR MOVIMIENTOS
console.log("Movimientos almacenados:", bancoDemo.movimientos);

console.log("Usuario: ", usuarioDemo);
console.log("Usuarios registrados en BancoDemo:", bancoDemo.usuarios);

const cuentaPrincipal = bancoDemo.cuentas[0] || null;

//Mostrar saldo persistido
if (cuentaPrincipal) {
	console.log("Saldo persistido:", formatCurrency(cuentaPrincipal.saldo));
	console.log(
		"¿La cuenta recuperada sigue siendo una instancia de Cuenta?",
		cuentaPrincipal instanceof Cuenta,
	);
}

//Reutilizar la cuenta existente evita registrarla de nuevo en cada carga.
const cuentaDemo = cuentaPrincipal;

console.log("Cuenta: ", cuentaDemo);

if (cuentaDemo) {
	console.log("Saldo de la cuenta: ", formatCurrency(cuentaDemo.saldo));
}

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
	if (cuentaDemo) {
		bancoDemo.realizarDeposito({
			cuentaId: cuentaDemo.id,
			monto: -500,
		});
	}
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

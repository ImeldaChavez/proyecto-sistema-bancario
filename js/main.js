//Punto de entrada de la aplicación
//Imports

import { validarCampoObligatorio, validarMonto } from "./utils/validators.js";
import { generarId, generarNumeroCuenta } from "./utils/helpers.js";
//import {formatCurrency, formatDate, formatAccountNumber,} from "./utils/formatters.js";

//Imports de clases
import { Usuario } from "./models/usuario.js";
import { Cuenta } from "./models/cuenta.js";
//import { Movimiento } from "./models/movimiento.js";

//Imports banco
//import { Banco } from "./models/banco.js";

//Imports Services
import { STORAGE_KEYS, storageService } from "./services/storageService.js";

//Import AuthService
import { authService } from "./services/AuthService.js";

//Inicializar Storage
function inicializarStorage() {
	//Recuperar usuarios
	const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, null);

	//Recuperar cuentas
	const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, null);

	//Recuperar movimeintos
	const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, null);

	//Crear uauario si no existe
	if (usuarios === null) {
		storageService.guardar(STORAGE_KEYS.USUARIOS, []);
	}

	//Crear cuentas si no existe
	if (cuentas === null) {
		storageService.guardar(STORAGE_KEYS.CUENTAS, []);
	}

	//Crear movimeitos si no existe
	if (movimientos === null) {
		storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, []);
	}
}

//Manejar registro
function manejarRegistro(event) {
	event.preventDefault();

	//Elemntos del DOM
	const nombre = document.querySelector("#registroNombre").value.trim();
	const email = document
		.querySelector("#registroEmail")
		.value.trim()
		.toLowerCase();
	const telefono = document.querySelector("#registroTelefono").value.trim();
	const password = document.querySelector("#registroPassword").value;
	const confirmarPassword = document.querySelector(
		"#registroConfirmPassword",
	).value;

	//Validar campos
	if (
		!validarCampoObligatorio(nombre) ||
		!validarCampoObligatorio(email) ||
		!validarCampoObligatorio(password)
	) {
		//Mostrar alerta si faltan datos obligatorios
		Swal.fire({
			icon: "warning",
			title: "Campos incompletos",
			text: "Completa los campos obligatorios.",
		});

		return;
	}

	//Validar la longitud de la contraseña
	if (password.length < 6) {
		Swal.fire({
			icon: "warning",
			title: "Contraseña inválida",
			text: "La contraseña debe tener al menos 6 caracteres.",
		});

		return;
	}

	//Comparar contraseñas
	if (password !== confirmarPassword) {
		Swal.fire({
			icon: "warning",
			title: "Contraseñas diferentes",
			text: "Las contraseñas no coinciden.",
		});

		return;
	}

	//Recuperar registros
	const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

	//Buscar si existe un correo igua, es decir, correo duplicado
	const emailExistente = usuarios.some(
		(usuario) => usuario.email.toLowerCase() === email,
	);

	//Deter el correo duplicado
	if (emailExistente) {
		Swal.fire({
			icon: "error",
			title: "Correo registrado",
			text: "Ya existe un usuario con este correo.",
		});

		return;
	}

	//Instancia de usuario para crear un nuevo usuario
	const nuevoUsuario = new Usuario({
		nombre,
		email,
		telefono,
		password,
	});

	//Numero de cuneta
	let numeroCuenta;

	//Genera un numero de cuenta unico
	do {
		numeroCuenta = generarNumeroCuenta();
	} while (
		storageService
			.obtener(STORAGE_KEYS.CUENTAS, [])
			.some((cuenta) => cuenta.numeroCuenta === numeroCuenta)
	);

	//Crear cuenta
	//Relacionar la cuenta con un usuario
	const nuevaCuenta = new Cuenta({
		numeroCuenta,
		tipo: "Ahorro",
		saldo: 0,
		usuarioId: nuevoUsuario.id,
	});

	//Recuperar cuentas
	const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

	//Agragr usuario
	usuarios.push(nuevoUsuario);

	//Agregar cuenta
	cuentas.push(nuevaCuenta);

	//Guardar usuarios
	storageService.guardar(STORAGE_KEYS.USUARIOS, usuarios);

	//Guardra cuentas
	storageService.guardar(STORAGE_KEYS.CUENTAS, cuentas);

	//Registro creado existosamente
	Swal.fire({
		icon: "success",
		title: "Registro exitoso",
		text: "Tu usuario y cuenta bancaria fueron creados correctamente.",
		confirmButtonText: "Continuar",
	}).then(() => {
		//Limpiar forms
		document.querySelector("#formRegistro").reset();

		//Enviar correo al login
		document.querySelector("#loginEmail").value = email;
	});
}

//Manejar el Login / Inisio de sesión
function manejarLogin(event) {
	event.preventDefault();

	//Obtener elementos del DOM
	const email = document
		.querySelector("#loginEmail")
		.value.trim()
		.toLowerCase();
	const password = document.querySelector("#loginPassword").value;

	//Validar campos del formulario
	if (!validarCampoObligatorio(email) || !validarCampoObligatorio(password)) {
		Swal.fire({
			icon: "warning",
			title: "Campos incompletos",
			text: "Ingresa tu correo y contraseña.",
		});

		return;
	}

	//Iterar login
	try {
		//Autenticar usuario
		const usuario = authService.login(email, password);

		//Login exitoso
		Swal.fire({
			icon: "success",
			title: `Bienvenido, ${usuario.nombre}`,
			text: "Inicio de sesión correcto.",
			timer: 1500,
			showConfirmButton: false,
		}).then(() => {
			//Redirigir al Dashbord
			window.location.href = "dashboard.html";
		});
	} catch (error) {
		//Login incorrecto
		Swal.fire({
			icon: "error",
			title: "No fue posible iniciar sesión",
			text: error.message,
		});
	}
}

//Inicializar aplicación
function init() {
	//LocalStorage
	inicializarStorage();

	//Comprobar sesión
	if (authService.getCurrentUser()) {
		window.location.href = "dashboard.html";

		return;
	}

	//Obtener sesión
	const formLogin = document.querySelector("#formLogin");

	//Obtener registro
	const formRegistro = document.querySelector("#formRegistro");

	//Login
	if (formLogin) {
		formLogin.addEventListener("submit", manejarLogin);
	}

	//Registro
	if (formRegistro) {
		formRegistro.addEventListener("submit", manejarRegistro);
	}
}

//Iniciar aplicación
init();

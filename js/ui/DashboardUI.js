//Imports
import { authService } from "../services/AuthService.js";

//Mostrar usuario
function mostrarUsuario() {
	const usuario = authService.getCurrentUser();

	//Validar usuario
	if (!usuario) {
		return;
	}

	//Obtener elementos del DOM
	const nombreUsuario = document.querySelector("#nombreUsuario");

	//Mostrar el nombre del usuario
	if (nombreUsuario) {
		nombreUsuario.textContent = `Sesión iniciada como ${usuario.nombre}`;
	}
}

//Inicializar Logout
function inicializarLogout() {
	const logoutBtn = document.querySelector("#logoutBtn");

	//Validar boton
	if (!logoutBtn) {
		return;
	}

	//Evento click
	logoutBtn.addEventListener("click", () => {
		//Confirmar cerra sesión
		Swal.fire({
			icon: "question",
			title: "Cerrar sesión",
			text: "¿Seguro que deseas salir?",
			showCancelButton: true,
			confirmButtonText: "Sí, salir",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			//Boton cancelar
			if (!result.isConfirmed) {
				return;
			}

			//Cerrar cesión
			authService.logout();

			//Volver a login
			window.location.href = "index.html";
		});
	});
}

//Inicializar
function init() {
	const accesoPermitido = authService.protegerRuta();

	//Acceso permitido
	if (!accesoPermitido) {
		return;
	}

	//Mostrar usuario
	mostrarUsuario();

	//Activar cerra sesi´ón
	inicializarLogout();
}

//Inicializar
init();

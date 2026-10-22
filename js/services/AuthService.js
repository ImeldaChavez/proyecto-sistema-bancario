//Imports

//Import de StorageService
import { STORAGE_KEYS, storageService } from "./storageService.js";

//Servicio de autenticación
class AuthService {
	//Iniciar sesión
	//Recuperar todos los usuarios registrados, si todavia no existe alguno, se utilizará un Array vacío.
	login(email, password) {
		const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

		//Normalizar correo
		const emailNormalizado = String(email).trim().toLowerCase();

		//Buscar usuario que desea loguearse
		const usuario = usuarios.find(
			(u) =>
				u.email.toLowerCase() === emailNormalizado &&
				u.password === password &&
				u.activo !== false,
		);

		//Validación para credenciale sincorrectas
		if (!usuario) {
			throw new Error("Correo o contraseña incorrectos.");
		}

		//Crear/iniciar seción
		const sesion = {
			usuarioId: usuario.id,
			fechaInicio: new Date().toISOString(),
		};

		//Guardar sesión
		storageService.guardar(STORAGE_KEYS.SESION, sesion);

		return usuario;
	}

	//Cerrar sesión
	//Solo se elimina la clave de sesión
	logout() {
		storageService.eliminar(STORAGE_KEYS.SESION);
	}

	//Obtener usuario actual
	getCurrentUser() {
		//Recuperar sesión
		const sesion = storageService.obtener(STORAGE_KEYS.SESION, null);

		//Validar sesión
		if (!sesion) {
			return null;
		}

		//Recuperar usuarios
		const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

		//Buscar usuario de la sesión
		return usuarios.find((usuario) => usuario.id === sesion.usuarioId) || null;
	}

	//Proteger ruta
	protegerRuta() {
		//Obtener usuario autenticado
		const usuario = this.getCurrentUser();

		//Si no existe usuario autenticado, regresamos a index.html
		if (!usuario) {
			window.location.href = "index.html";

			return false;
		}

		return true;
	}
}

//Exportar AuthService
export const authService = new AuthService();

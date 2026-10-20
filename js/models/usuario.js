//Imports
import { generarId } from "../utils/helpers.js";

//Modelo de usuario
//Es un molde para representar a las personas registradas dentro del sistema.

export class Usuario {
	constructor({
		id = generarId(),
		nombre,
		email,
		telefono = "",
		password,
		activo = true,
	}) {
		//Asignar propiedades
		this.id = id;
		this.nombre = nombre;
		this.email = email;
		this.telefono = telefono;
		this.password = password;
		this.activo = activo;
	}
}

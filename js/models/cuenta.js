//Imports
import { generarId } from "../utils/helpers.js";

//Modelo cuenta
//Representa una cuenta bancaria perteneciente a un usuario

export class Cuenta {
	constructor({
		id = generarId(),
		numeroCuenta,
		tipo = "Ahorro",
		saldo = 0,
		usuarioId,
		fechaApertura = new Date().toDateString(),
		activa = true,
	}) {
		//Asignar propiedades
		this.id = id;
		this.numeroCuenta = numeroCuenta;
		this.tipo = tipo;
		this.saldo = Number(saldo);
		this.usuarioId = usuarioId;
		this.fechaApertura = fechaApertura;
		this.activa = activa;
	}

	//Incrementa el saldo actual utilizando el monto recibido
	depositar(monto) {
		this.saldo += Number(monto);

		return this.saldo;
	}

	//Disminuye el saldo actual utilizando el monto recibido
	retirar(monto) {
		this.saldo -= Number(monto);

		return this.saldo;
	}
}

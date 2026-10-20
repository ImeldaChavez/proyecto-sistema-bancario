//Imports

import { generarId } from "../utils/helpers.js";

//Modelo movimeinto
//Representa una operación relizada dentro del sistema bancario
/*
 * Tipo de operación realizada
 * Cantidad involucrada en la operación
 * Descripción opcional del movimiento.
 * Cuenta desde la cual se origina la operación.
 */

export class Movimiento {
	constructor({
		id = generarId(),
		tipo,
		monto,
		descripcion = "",
		cuentaOrigen = null,
		cuentaDestino = null,
		saldoResultante = null,
		fecha = new Date().toDateString(),
	}) {
		//Asignar propiedades
		this.id = id;
		this.tipo = tipo;
		this.monto = Number(monto);
		this.descripcion = descripcion;
		this.cuentaOrigen = cuentaOrigen;
		this.cuentaDestino = cuentaDestino;
		this.saldoResultante = saldoResultante;
		this.fecha = fecha;
	}
}

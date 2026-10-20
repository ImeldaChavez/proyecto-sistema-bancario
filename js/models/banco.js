//Imports
//Banco necesita crear movimientos automaticamente cuando se realicen operaciones como depósitos.

import { Movimiento } from "./movimiento.js";

//Modelo Banco
//Banco será el encargado de coordinar usuarios, cuentas y movimientos.

export class Banco {
	constructor({ usuarios = [], cuentas = [], movimientos = [] } = {}) {
		this.usuarios = usuarios;
		this.cuentas = cuentas;
		this.movimientos = movimientos;
	}

	//Agregarusuario
	//Registra un usuario dentro del banco siempre que no exista otro usuario con el mismo ID.
	agregarUsuario(usuario) {
		// some() comprueba si al menos un elemento del array cumple con la condición indicada.
		const existe = this.usuarios.some((u) => u.id === usuario.id);

		// Detenemos la operación si encontramos un usuario con el mismo identificador.
		if (existe) {
			throw new Error("El usuario ya existe.");
		}

		// Si no existe Agregamos el usuario al array
		this.usuarios.push(usuario);

		return usuario;
	}

	//Bucar usuario por ID
	//Busca un usuario utilizando su identificador interno.
	buscarUusarioPorId(usuarioId) {
		return this.usuarios.find((usuario) => usuario.id === usuarioId) || null;
	}

	//Agregar cuenta
	//Registra una cuenta bancaria después de comprobar que su propietario existe y que la cuenta no esta duplicada.
	agregarCuenta(cuenta) {
		// Buscamos el propietario o usuario
		const usuario = this.buscarUsuarioPorId(cuenta.usuarioId);

		// Si el usuario no existe termina el metodo aqui y mandame un mensaje
		if (!usuario) {
			throw new Error("El usuario propietario de la cuenta no existe.");
		}

		// Consideramos duplicada una cuenta si coincide su ID o su número.
		const existe = this.cuentas.some(
			(c) => c.id === cuenta.id || c.numeroCuenta === cuenta.numeroCuenta,
		);

		// Si eciste la cuenta duplicada termina el metodo y mandame un mensaje
		if (existe) {
			throw new Error("La cuenta ya existe.");
		}

		// Si no existe simplemente REGISTRAR CUENTA
		this.cuentas.push(cuenta);

		return cuenta;
	}

	//Buscar cuenta por ID
	//Localiza una cuenta mediante su ID
	buscarCuentaPorId(cuentaId) {
		return this.cuentas.find((cuenta) => cuenta.id === cuentaId) || null;
	}

	//Buscar cuenta por numero
	//Localiza una cuenta utilizando su número bancario visible
	buscarCuentaPorNumero(numeroCuenta) {
		return (
			this.cuentas.find((cuenta) => cuenta.numeroCuenta === numeroCuenta) ||
			null
		);
	}

	//Obetner todas las cuentas de un usuario
	//Recupera todas las cuentas que pertenecen al usuario
	obtenerCuentasDeUsuario(usuarioId) {
		return this.cuentas.filter((cuenta) => cuenta.usuarioId === usuarioId);
	}

	//Registrar movimiento
	//Agrega un movimiento al historial general del banco
	registrarMovimiento(movimiento) {
		this.movimientos.push(movimiento);

		return movimiento;
	}

	//Realizar deposito
	//Coordina toda la operación de depósito:
	//1. Validar monto.
	//2. Buscar cuenta.
	//3. Actualizar saldo.
	//4. Crear movimiento.
	//5. Registrar movimiento

	realizarMovimiento(cuentaId, monto, descripcion = "") {
		const montoNumerico = Number(monto);

		//El monto debe ser un número válido y mayor que cero.
		if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
			throw new Error("Monto inválido, el monto debe ser mayor a cero.");
		}

		//Buscar cuenta y validar
		const cuenta = this.buscarCuentaPorId(cuentaId);

		if (!cuenta) {
			throw new Error("La cuenta no existe.");
		}

		//Actualizar saldo
		cuenta.depositar(montoNumerico);

		//Después del depósito creamos automáticamente un registro de la operación
		const movimiento = new Movimiento({
			tipo: "DEPOSITO",
			monto: montoNumerico,
			descripcion,
			cuentaOrigen: cuenta.id,
			saldoResultante: cuenta.saldo,
		});

		//Registrar movimiento
		this.registrarMovimiento(movimiento);

		return movimiento;
	}

	//Obtener movimientos de una cuenta
	//Devuelve todos los movimientos en lo que la cuenta aparezca como origen o como destino.
	obtenerMovimientosDeCuenta(cuentaId) {
		return this.movimientos.filter(
			(movimiento) =>
				movimiento.cuentaOrigen === cuentaId ||
				movimiento.cuentaDestino === cuentaId,
		);
	}
}

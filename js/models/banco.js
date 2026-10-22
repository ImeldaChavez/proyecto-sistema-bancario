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
	buscarUsuarioPorId(usuarioId) {
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

	//Realizar depósito
	//Coordina toda la operación de depósito:
	//1. Validar monto.
	//2. Buscar cuenta.
	//3. Actualizar saldo.
	//4. Crear movimiento.
	//5. Registrar movimiento

	realizarDeposito({ cuentaId, monto, descripcion = "" }) {
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

	//Deppositos
	realizarDeposito({ cuentaId, monto, descripcion = "" }) {
		const montoNumerico = Number(monto);

		//Montos mayores a 0
		if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
			throw new Error("Monto inválido, el monto debe ser mayor a cero.");
		}

		//Cuenta donde se realiza el deposito
		const cuenta = this.buscarCuentaPorId(cuentaId);

		if (!cuenta) {
			throw new Error("La cuenta no existe.");
		}

		//Modificamos el saldo utilizando el comportamiento de Cuenta.
		cuenta.depositar(montoNumerico);

		//Registramos el depósito dentro del historial.
		const movimiento = new Movimiento({
			tipo: "DEPOSITO",
			monto: montoNumerico,
			descripcion,
			cuentaOrigen: cuenta.id,
			saldoResultante: cuenta.saldo,
		});

		this.registrarMovimiento(movimiento);

		return movimiento;
	}

	//Transferencias
	realizarTransferencia({
		cuentaOrigenId,
		cuentaDestinoId,
		monto,
		descripcion = "",
	}) {
		const montoNumerico = Number(monto);

		//Monto mayor a cero
		if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
			throw new Error("Monto inválido, el monto debe ser mayor a cero.");
		}

		//Cuentas que participan en la operación
		const origen = this.buscarCuentaPorId(cuentaOrigenId);
		const destino = this.buscarCuentaPorId(cuentaDestinoId);

		if (!origen) {
			throw new Error("La cuenta origen no existe.");
		}

		if (!destino) {
			throw new Error("La cuenta destino no existe.");
		}

		//Validación de cuentas activas
		if (!origen.activa) {
			throw new Error("La cuenta origen no está activa.");
		}

		if (!destino.activa) {
			throw new Error("La cuenta destino no está activa.");
		}

		//Validación para no transferir en la misma cuenta
		if (origen.id === destino.id) {
			throw new Error("No puedes transferir dinero a la misma cuenta");
		}

		//Validación de saldo de la cuenta origen, ya que necesita saldo suficiente para completar la operación.
		if (origen.saldo < montoNumerico) {
			throw new Error("Saldo insuficiente");
		}

		//Descontamos el dinero de la cuenta origen.
		origen.retirar(montoNumerico);

		//Depositamos el mismo monto en la cuenta destino.
		destino.depositar(montoNumerico);

		//Creamos el movimiento desde la perspectiva del emisor.
		const movimientoEnviado = new Movimiento({
			tipo: "TRANSFERENCIA_ENVIADA",
			monto: montoNumerico,
			descripcion,
			cuentaOrigen: origen.id,
			cuentaDestino: destino.id,
			saldoResultante: origen.saldo,
		});

		//Creamos el movimiento desde la perspectiva del receptor.
		const movimientoRecibido = new Movimiento({
			tipo: "TRANSFERENCIA_RECIBIDA",
			monto: montoNumerico,
			descripcion,
			cuentaOrigen: origen.id,
			cuentaDestino: destino.id,
			saldoResultante: destino.saldo,
		});

		// Guardamos ambos movimientos.
		this.registrarMovimiento(movimientoEnviado);

		this.registrarMovimiento(movimientoRecibido);

		return {
			origen,
			destino,
			movimientoEnviado,
			movimientoRecibido,
		};
	}
}

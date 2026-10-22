//Imports
import { Banco } from "../models/banco.js";
import { Usuario } from "../models/usuario.js";
import { Cuenta } from "../models/cuenta.js";
import { Movimiento } from "../models/movimiento.js";
import { STORAGE_KEYS, storageService } from "./storageService.js";

//Servicio bancario
//Guarda una instancia de banco
class BancoService {
	constructor() {
		this._banco = null;
	}

	cargarBanco() {
		//Recupera los usuarios almacenados. Si todavía no existen, devuelve [].
		const usuariosGuardados = storageService.obtener(STORAGE_KEYS.USUARIOS, []);

		//Recupera las cuentas almacenadas.
		const cuentasGuardadas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);

		//Recupera los movimientos almacenados.
		const movimientosGuardados = storageService.obtener(
			STORAGE_KEYS.MOVIMIENTOS,
			[],
		);

		//Convierte cada objeto plano recuperado en una instancia real de Usuario.
		const usuarios = usuariosGuardados.map((usuario) => new Usuario(usuario));

		//Reconstruye cada cuenta para recuperar también sus métodos
		const cuentas = cuentasGuardadas.map((cuenta) => new Cuenta(cuenta));

		//Reconstruye los movimientos utilizando la clase Movimiento
		const movimientos = movimientosGuardados.map(
			(movimiento) => new Movimiento(movimiento),
		);

		//Instancia de banco
		this._banco = new Banco({
			usuarios,
			cuentas,
			movimientos,
		});

		return this._banco;
	}

	//Obtener la instancia de Banco
	obtenerInstanciaBanco() {
		//Comprueba si _banco todavía es null. Reconstruye el Banco desde LocalStorage.
		if (!this._banco) {
			return this.cargarBanco();
		}

		return this._banco;
	}

	//Recargar banco
	recargarBanco() {
		//Elimina la referencia a la instancia actual.
		this._banco = null;

		return this.cargarBanco();
	}

	//Guardar banco, LocalStorage guarda el estado actual de las colecciones administradas por Banco.
	guardarBanco() {
		const banco = this.obtenerInstanciaBanco();

		//Guarda los usuarios.
		storageService.guardar(STORAGE_KEYS.USUARIOS, banco.usuarios);
		storageService.guardar(STORAGE_KEYS.CUENTAS, banco.cuentas);
		storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, banco.movimientos);

		//Indica que la operación terminó.
		return true;
	}

	realizarDeposito(datosDeposito) {
		const banco = this.obtenerInstanciaBanco();
		const movimiento = banco.realizarDeposito(datosDeposito);

		this.guardarBanco();

		return movimiento;
	}

	realizarTransferencia({
		cuentaOrigenId,
		numeroCuentaDestino,
		monto,
		descripcion = "",
	}) {
		const banco = this.obtenerInstanciaBanco();
		const cuentaDestino = banco.buscarCuentaPorNumero(numeroCuentaDestino);

		if (!cuentaDestino) {
			throw new Error("La cuenta destino no existe.");
		}

		const resultado = banco.realizarTransferencia({
			cuentaOrigenId,
			cuentaDestinoId: cuentaDestino.id,
			monto,
			descripcion,
		});

		this.guardarBanco();

		return resultado;
	}

	//Obtener datos de usuario
	//Obtine la información bancaria relacionada con una usuario determinado
	obtenerDatosUsuario(usuarioId) {
		//Obtiene la instancia actual del Banco.
		const banco = this.obtenerInstanciaBanco();

		//Busca al usuario utilizando una regla que ya existe en Banco.js.
		const usuario = banco.buscarUsuarioPorId(usuarioId);

		//Si el usuario no existe detenemos la operación mediante una excepción.
		if (!usuario) {
			throw new Error("El usuario no existe.");
		}

		//Obtiene únicamente las cuentas pertenecientes al usuario.
		const cuentas = banco.obtenerCuentasDeUsuario(usuarioId);

		// Obtiene todos los movimientos relacionados con todas las cuentas del usuario.
		const movimientosSinFiltrar = cuentas.flatMap((cuenta) =>
			banco.obtenerMovimientosDeCuenta(cuenta.id),
		);

		// Elimina movimientos duplicados. filter() decide qué elementos conservar. findIndex() encuentra la primera posición donde aparece un movimiento con el mismo id.
		const movimientos = movimientosSinFiltrar.filter(
			(movimiento, index, array) =>
				index === array.findIndex((item) => item.id === movimiento.id),
		);

		return {
			usuario,
			cuentas,
			movimientos,
		};
	}

	//Obtener resumen de usuario
	obtenerResumenUsuario(usuarioId) {
		//Destructuring: extraemos directamente las propiedades que necesitamos del objeto retornado.
		const { usuario, cuentas, movimientos } =
			this.obtenerDatosUsuario(usuarioId);

		//Suma el saldo de todas las cuentas. El acumulador comienza en 0.
		const saldoTotal = cuentas.reduce(
			(acumulado, cuenta) => acumulado + Number(cuenta.saldo),
			0,
		);

		//Entrega al Dashboard tanto los datos originales como los indicadores calculados.
		return {
			usuario,
			cuentas,
			movimientos,
			saldoTotal,
			totalCuentas:
				//Número de cuentas del usuario.
				cuentas.length,
			//Número de movimientos encontrados.
			totalMovimientos: movimientos.length,
		};
	}

	actualizarUsuario(usuarioId, { nombre, email, telefono }) {
		const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
		const usuario = usuarios.find((item) => item.id === usuarioId);

		if (!usuario) {
			throw new Error("El usuario no existe.");
		}

		const emailNormalizado = String(email).trim().toLowerCase();
		const emailDuplicado = usuarios.some(
			(item) =>
				item.email.toLowerCase() === emailNormalizado && item.id !== usuarioId,
		);

		if (emailDuplicado) {
			throw new Error("Ya existe un usuario con este correo.");
		}

		const usuariosActualizados = usuarios.map((item) =>
			item.id === usuarioId
				? {
						...item,
						nombre: nombre.trim(),
						email: emailNormalizado,
						telefono: telefono.trim(),
					}
				: item,
		);

		storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);
		this.recargarBanco();

		return usuariosActualizados.find((item) => item.id === usuarioId) || null;
	}

	cambiarPassword(usuarioId, passwordActual, passwordNueva) {
		const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
		const usuario = usuarios.find((item) => item.id === usuarioId);

		if (!usuario) {
			throw new Error("El usuario no existe.");
		}

		if (usuario.password !== passwordActual) {
			throw new Error("La contraseña actual no es correcta.");
		}

		if (passwordNueva === passwordActual) {
			throw new Error("La nueva contraseña debe ser diferente.");
		}

		if (passwordNueva.length < 6) {
			throw new Error("La nueva contraseña debe tener al menos 6 caracteres.");
		}

		const usuariosActualizados = usuarios.map((item) =>
			item.id === usuarioId
				? {
						...item,
						password: passwordNueva,
					}
				: item,
		);

		storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosActualizados);
		this.recargarBanco();

		return true;
	}

	eliminarUsuario(usuarioId) {
		const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
		const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
		const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);

		const usuario = usuarios.find((item) => item.id === usuarioId);

		if (!usuario) {
			throw new Error("El usuario no existe.");
		}

		const cuentasUsuario = cuentas.filter(
			(cuenta) => cuenta.usuarioId === usuarioId,
		);
		const tieneSaldo = cuentasUsuario.some(
			(cuenta) => Number(cuenta.saldo) > 0,
		);

		if (tieneSaldo) {
			throw new Error(
				"No puedes eliminar tu cuenta mientras tengas saldo disponible.",
			);
		}

		const cuentasUsuarioIds = cuentasUsuario.map((cuenta) => cuenta.id);

		const usuariosFiltrados = usuarios.filter((item) => item.id !== usuarioId);
		const cuentasFiltradas = cuentas.filter(
			(cuenta) => cuenta.usuarioId !== usuarioId,
		);
		const movimientosFiltrados = movimientos.filter(
			(movimiento) =>
				!cuentasUsuarioIds.includes(movimiento.cuentaOrigen) &&
				!cuentasUsuarioIds.includes(movimiento.cuentaDestino),
		);

		storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosFiltrados);
		storageService.guardar(STORAGE_KEYS.CUENTAS, cuentasFiltradas);
		storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, movimientosFiltrados);

		this.recargarBanco();

		return true;
	}

	//Eliminar usuario
	eliminarUsuario(usuarioId) {
		const usuarios = storageService.obtener(STORAGE_KEYS.USUARIOS, []);
		const cuentas = storageService.obtener(STORAGE_KEYS.CUENTAS, []);
		const movimientos = storageService.obtener(STORAGE_KEYS.MOVIMIENTOS, []);
		const usuario = usuarios.find((item) => item.id === usuarioId);

		if (!usuario) {
			throw new Error("El usuario no existe.");
		}

		const cuentasUsuario = cuentas.filter(
			(cuenta) => cuenta.usuarioId === usuarioId,
		);

		const tieneSaldo = cuentasUsuario.some(
			(cuenta) => Number(cuenta.saldo) > 0,
		);

		if (tieneSaldo) {
			throw new Error(
				"No puedes eliminar tu cuenta mientras tengas saldo disponible.",
			);
		}

		const cuentasUsuarioIds = cuentasUsuario.map((cuenta) => cuenta.id);
		const usuariosFiltrados = usuarios.filter((item) => item.id !== usuarioId);
		const cuentasFiltradas = cuentas.filter(
			(cuenta) => cuenta.usuarioId !== usuarioId,
		);
		const movimientosFiltrados = movimientos.filter(
			(movimiento) =>
				!cuentasUsuarioIds.includes(movimiento.cuentaOrigen) &&
				!cuentasUsuarioIds.includes(movimiento.cuentaDestino),
		);

		storageService.guardar(STORAGE_KEYS.USUARIOS, usuariosFiltrados);
		storageService.guardar(STORAGE_KEYS.CUENTAS, cuentasFiltradas);
		storageService.guardar(STORAGE_KEYS.MOVIMIENTOS, movimientosFiltrados);

		this.recargarBanco();

		return true;
	}
}

//Instancia
export const bancoService = new BancoService();

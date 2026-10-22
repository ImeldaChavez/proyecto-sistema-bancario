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
}

//Instancia
export const bancoService = new BancoService();

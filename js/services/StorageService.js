//Claves de almacenamiento

export const STORAGE_KEYS = {
	USUARIOS: "usuarios",
	CUENTAS: "cuentas",
	MOVIMIENTOS: "movimientos",
	SESION: "sesion",
};

//Centra la comunicación con LocalStorage

class StorageService {
	//Guadar información
	//clave → dónde guardaremos la información.
	//valor → dato que queremos almacenar.
	guardar(clave, valor) {
		const valorJSON = JSON.stringify(valor);

		/* Guardamos el JSON utilizando la clave recibida. */
		localStorage.setItem(clave, valorJSON);
	}

	//Obtener información
	//clave: indica qué información queremos recuperar.
	// valorPorDefecto: será retornado cuando no exista información almacenada.
	obtener(clave, valorPorDefecto = null) {
		const valor = localStorage.getItem(clave);

		//Validar si existe información
		if (valor === null) {
			return valorPorDefecto;
		}

		//Convertir a formato JSON
		try {
			return JSON.parse(valor);
		} catch (error) {
			console.error(
				`No fue posible leer la clave "${clave}" de LocalStorage.`,
				error,
			);

			return valorPorDefecto;
		}
	}

	//Eliminar información
	//Elimina unicamente la clave recibida sin afectar el resto del LocalStorage.
	eliminar(clave) {
		localStorage.removeItem(clave);
	}

	//Limpiar LocalStorage
	limpiar() {
		localStorage.clear();
	}
}

//Instancia del servicio
export const storageService = new StorageService();

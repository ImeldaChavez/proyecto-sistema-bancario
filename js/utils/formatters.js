//Formateadores de información
//Convierte un valor numérico a una representación monetaria utilizando pesos mexcanos

export function formatCurrency(valor) {
	const numero = Number(valor);

	if (!Number.isFinite(numero)) {
		return "$0.00";
	}

	//Formato de moneda
	return numero.toLocaleString("es-MX", {
		style: "currency",
		currency: "MXN",
	});
}

//Formatear fecha
//Convierte una fecha a una representación más amigable utilizando la configuración reginal de México

export function formatDate(fecha) {
	const fechaObjeto = new Date(fecha);

	if (Number.isNaN(fechaObjeto.getTime())) {
		return "";
	}

	return fechaObjeto.toDateString("es-MX");
}

//Formatear número de cuenta
export function formatAccountNumber(numeroCuenta) {
	const numero = String(numeroCuenta ?? "");

	//Separar grupos de 4 numeros
	return numero.replace(/(\d{4})(?=\d)/g, "$1 ");
}

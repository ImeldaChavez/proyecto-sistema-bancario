//Validaciones generales

//Validar la existencia de un valor
export function validarCampoObligatorio(valor) {
	//El valor no debe ser undefined ni null
	return valor !== undefined && valor !== null && String(valor).trim() !== "";
}

//Validar monto
export function validarMonto(monto) {
	const montoNumerico = Number(monto);

	return Number.isFinite(montoNumerico) && montoNumerico > 0;
}

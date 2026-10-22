//Imports
import { authService } from "../services/AuthService.js";
import { bancoService } from "../services/BancoService.js";
import { formatCurrency, formatAccountNumber } from "../utils/formatters.js";

//Renderiza visualmente la información bancaria recibida
function renderDashboard(resumen) {
	//Busca el contenedor principal.
	const root = document.querySelector("#dashboardRoot");

	//Si el elemento no existe, detenemos la función.
	if (!root) {
		return;
	}

	const { usuario, cuentas, saldoTotal, totalCuentas, totalMovimientos } =
		resumen;

	//Utilizamos la primera cuenta como cuenta principal si esta vacio null.
	const cuentaPrincipal = cuentas[0] || null;

	// Genera el contenido HTML del Dashboard mediante un template literal
	// Inserta dinámicamente el nombre del usuario autenticado.
	root.innerHTML = /*html */ `
        <section class="dashboard-welcome">
            <div>
                <p class="dashboard-label">
                    Bienvenido
                </p>

                <h2>
                    ${usuario.nombre}
                </h2>

                <p>
                    Consulta el estado actual de tus cuentas.
                </p>
            </div>
        </section>
        
        <!--Formatea el saldo total como moneda.-->
        <section class="summary-grid">

            <article class="summary-card">
                <span>
                    Saldo total
                </span>

                <strong>
                    ${formatCurrency(saldoTotal)}
                </strong>
            </article>


            <article class="summary-card">
                <span>
                    Cuentas
                </span>

                <strong>
                    ${totalCuentas}
                </strong>
            </article>


            <article class="summary-card">
                <span>
                    Movimientos
                </span>

                <strong>
                    ${totalMovimientos}
                </strong>
            </article>

        </section>

        <!--Cuenta principal-->
        <section class="dashboard-section">
            <header class="section-header">
                <div>
                    <span>
                        Cuenta principal
                    </span>

                    <h3>
                        Información bancaria
                    </h3>
                </div>
            </header>

        <!--Evalúa si existe una cuenta principal.
		    -Si existe genera la tarjeta.
		    -Si no existe genera el mensaje alternativo.
		-->
            ${
							cuentaPrincipal
								? /*html */ `
                        <article class="account-card">
                            <div>
                                <span>
                                    Número de cuenta
                                </span>

                                <strong>
                                    ${formatAccountNumber(cuentaPrincipal.numeroCuenta)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Tipo
                                </span>

                                <strong>
                                    ${cuentaPrincipal.tipo}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Saldo disponible
                                </span>

                                <strong>
                                    ${formatCurrency(cuentaPrincipal.saldo)}
                                </strong>
                            </div>
                        </article>
                    `
								: /*html */ `
                        <p>
                            No tienes cuentas bancarias registradas.
                        </p>
                    `
						}
            </section>
        `;
}

// Configura el botón utilizado para cerrar la sesión.
function initLogout() {
	const btn = document.querySelector("#logoutBtn");

	//Evita continuar si el botón no existe en el documento.
	if (!btn) {
		return;
	}

	btn.addEventListener("click", () => {
		Swal.fire({
			icon: "question",
			title: "Cerrar sesión",
			text: "¿Seguro que deseas salir?",
			showCancelButton: true,
			confirmButtonText: "Sí, salir",
			cancelButtonText: "Cancelar",
		}).then((result) => {
			//Si el usuario cancela, no hacemos nada.
			if (!result.isConfirmed) {
				return;
			}

			//Elimina la sesión actual.
			authService.logout();

			//Regresa a la página inicial.
			window.location.href = "index.html";
		});
	});
}

//Punto de entrada del Dashboard.
function init() {
	// Comprueba que exista una sesión válida.
	const accesoPermitido = authService.protegerRuta();

	//Si no existe sesión, la función termina.
	if (!accesoPermitido) {
		return;
	}

	const usuario = authService.getCurrentUser();

	//Validación adicional antes de consultar información bancaria.
	if (!usuario) {
		return;
	}

	try {
		bancoService.recargarBanco();

		//Obtiene el resumen correspondiente al usuario autenticado
		const resumen = bancoService.obtenerResumenUsuario(usuario.id);

		//Genera el contenido visual.
		renderDashboard(resumen);

		//Configura el botón de logout.
		initLogout();
	} catch (error) {
		//Informa cualquier error ocurrido durante la carga del Dashboard.
		Swal.fire({
			icon: "error",
			title: "No fue posible cargar el dashboard",
			text: error.message,
		});
	}
}

init();

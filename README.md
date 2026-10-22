# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.

El sistema se desarrolla progresivamente utilizando JavaScript moderno, programación orientada a objetos, programación funcional, arquitectura modular y persistencia local.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- LocalStorage
- SweetAlert2
- Node.js
- npm
- Git
- GitHub

## Arquitectura actual

```text
js/
├── main.js
│
├── models/
│   ├── Banco.js
│   ├── Cuenta.js
│   ├── Movimiento.js
│   └── Usuario.js
│
├── services/
│   ├── AuthService.js
│   ├── BancoService.js
│   └── StorageService.js
│
├── ui/
│   ├── CuentaUI.js
│   ├── DashboardUI.js
│   └── TransferenciasUI.js
│
└── utils/
    ├── formatters.js
    ├── helpers.js
    └── validators.js
```

## Páginas actuales

- `index.html`
- `dashboard.html`
- `cuenta.html`
- `transferencia.html`

## Operaciones bancarias

### Depósitos

El sistema permite depositar dinero en una cuenta.

La operación:

1. Valida el monto.
2. Busca la cuenta.
3. Actualiza el saldo.
4. Genera un movimiento `DEPOSITO`.
5. Guarda el saldo resultante.
6. Persiste la operación.

### Transferencias

El sistema permite transferir dinero entre cuentas.

La operación:

1. Valida el monto.
2. Localiza la cuenta origen.
3. Localiza la cuenta destino.
4. Comprueba que ambas cuentas estén activas.
5. Evita transferencias a la misma cuenta.
6. Comprueba saldo suficiente.
7. Retira dinero de la cuenta origen.
8. Deposita dinero en la cuenta destino.
9. Genera `TRANSFERENCIA_ENVIADA`.
10. Genera `TRANSFERENCIA_RECIBIDA`.
11. Persiste las cuentas y movimientos.

## Tipos de movimientos actuales

- `DEPOSITO`
- `TRANSFERENCIA_ENVIADA`
- `TRANSFERENCIA_RECIBIDA`

## SweetAlert2

En las transferencias se utiliza para:

- Validaciones.
- Confirmación previa.
- Saldo insuficiente.
- Cuenta inexistente.
- Transferencia a la misma cuenta.
- Transferencia exitosa.
- Depósito exitoso.
- Errores de operación.

## Funcionalidades implementadas

Actualmente la aplicación permite:

- Registrar usuarios.
- Crear cuentas bancarias.
- Iniciar sesión.
- Mantener sesión.
- Proteger páginas.
- Mostrar dashboard.
- Consultar información bancaria.
- Actualizar perfil.
- Cambiar contraseña.
- Eliminar usuario.
- Realizar depósitos.
- Realizar transferencias.
- Actualizar saldos.
- Registrar transferencias enviadas.
- Registrar transferencias recibidas.
- Persistir operaciones con LocalStorage.

## Versión actual

v0.9.0 — Operaciones bancarias y transferencias.
v0.8.0 — Gestión de cuenta, perfil y seguridad.
v0.7.0 — BancoService y Dashboard bancario.
v0.6.0 — Registro, autenticación, sesión y SweetAlert2.
v0.5.0 — Persistencia con LocalStorage y StorageService.

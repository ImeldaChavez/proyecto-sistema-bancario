# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.

El objetivo es desarrollar progresivamente un sistema bancario utilizando JavaScript moderno, arquitectura modular, programación orientada a objetos y programación funcional.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- Git
- GitHub

## Arquitectura

El proyecto utiliza las siguientes capas:

- Models
- Services
- UI
- Utils
- Tests

## Arquitectura actual

```text
js/
├── main.js
├── models/
│   ├── Banco.js
│   ├── Cuenta.js
│   ├── Movimiento.js
│   └── Usuario.js
└── utils/
    ├── formatters.js
    ├── helpers.js
    └── validators.js
```

## Modelos disponibles

### Usuario

Representa a una persona registrada dentro del sistema.

Propiedades principales:

- `id`
- `nombre`
- `email`
- `telefono`
- `password`
- `activo`

### Cuenta

Representa una cuenta bancaria perteneciente a un usuario.

Propiedades principales:

- `id`
- `numeroCuenta`
- `tipo`
- `saldo`
- `usuarioId`
- `fechaApertura`
- `activa`

Métodos:

- `depositar()`
- `retirar()`

### Movimiento

Representa una operación realizada sobre una cuenta bancaria.

Propiedades principales:

- `id`
- `tipo`
- `monto`
- `descripcion`
- `cuentaOrigen`
- `cuentaDestino`
- `saldoResultante`
- `fecha`

### Banco

Coordina los usuarios, cuentas y movimientos del sistema y aplica reglas del dominio bancario.

Métodos disponibles:

- `agregarUsuario()`
- `buscarUsuarioPorId()`
- `agregarCuenta()`
- `buscarCuentaPorId()`
- `buscarCuentaPorNumero()`
- `obtenerCuentasDeUsuario()`
- `registrarMovimiento()`
- `realizarDeposito()`
- `obtenerMovimientosDeCuenta()`

## Utilidades disponibles

### Validators

- `validarCampoObligatorio()`
- `validarMonto()`

### Helpers

- `generarId()`

### Formatters

- `formatCurrency()`
- `formatDate()`
- `formatAccountNumber()`

## Funcionalidades implementadas

Actualmente el sistema permite desde JavaScript:

- Crear usuarios.
- Crear cuentas.
- Relacionar cuentas con usuarios.
- Administrar usuarios mediante `Banco`.
- Administrar cuentas mediante `Banco`.
- Buscar usuarios.
- Buscar cuentas.
- Consultar las cuentas de un usuario.
- Realizar depósitos.
- Actualizar el saldo de una cuenta.
- Registrar movimientos de depósito.
- Consultar movimientos asociados a una cuenta.
- Aplicar reglas básicas del dominio.

## Funcionalidades previstas

Durante las siguientes versiones se desarrollarán:

- Persistencia con LocalStorage.
- Registro desde interfaz.
- Inicio de sesión.
- Dashboard.
- Transferencias.
- Historial visual de movimientos.
- Manipulación del DOM.
- Manejo de eventos.
- Librerías visuales.
- Pruebas automatizadas con Jest.
- Git y GitHub.

## Versión actual

v0.6.0 — Registro, autenticación, sesión y SweetAlert2.
v0.5.0 — Persistencia con LocalStorage y StorageService.

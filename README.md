# Sistema de Gestión Bancaria

Proyecto integrador correspondiente al Módulo 4.

El proyecto se desarrolla progresivamente utilizando JavaScript moderno, arquitectura modular, programación orientada a objetos y programación funcional.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- ECMAScript Modules
- Node.js
- npm
- LocalStorage
- SweetAlert2
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
│   └── DashboardUI.js
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

## Mi cuenta

La página `cuenta.html` permite consultar:

- Titular.
- Número de cuenta.
- Tipo de cuenta.
- Saldo.
- Fecha de apertura.
- Estado de la cuenta.

También permite administrar:

- Nombre.
- Correo electrónico.
- Teléfono.
- Contraseña.
- Eliminación de la cuenta.

## BancoService

Además de las operaciones anteriores, ahora incorpora:

- `actualizarUsuario()`
- `cambiarPassword()`
- `eliminarUsuario()`

### actualizarUsuario()

Actualiza:

- nombre
- email
- teléfono

y evita utilizar un correo registrado por otro usuario.

### cambiarPassword()

Comprueba:

- existencia del usuario
- contraseña actual
- nueva contraseña diferente
- longitud mínima

### eliminarUsuario()

Elimina:

- usuario
- cuentas asociadas
- movimientos asociados

La eliminación solo está permitida cuando las cuentas del usuario tienen saldo cero.

## SweetAlert2

En esta versión se utiliza para:

- Confirmar cierre de sesión.
- Confirmar eliminación de cuenta.
- Informar actualización exitosa.
- Informar cambio de contraseña.
- Informar eliminación exitosa.
- Mostrar errores de eliminación.

## Programación funcional aplicada

Se utilizan métodos como:

- `find()`
- `some()`
- `map()`
- `filter()`
- `includes()`
- `forEach()`

También se utiliza Spread Operator para actualizar objetos sin eliminar propiedades existentes.

## Funcionalidades implementadas

Actualmente el sistema permite:

- Registrar usuarios.
- Crear cuentas automáticamente.
- Autenticarse.
- Mantener sesión.
- Cerrar sesión.
- Consultar Dashboard.
- Consultar datos bancarios.
- Consultar información personal.
- Actualizar información personal.
- Evitar correos duplicados.
- Cambiar contraseña.
- Eliminar usuarios con saldo cero.
- Eliminar datos relacionados.
- Persistir los cambios en LocalStorage.

## Versión actual

v0.8.0 — Gestión de cuenta, perfil y seguridad.
v0.7.0 — BancoService y Dashboard bancario.
v0.6.0 — Registro, autenticación, sesión y SweetAlert2.
v0.5.0 — Persistencia con LocalStorage y StorageService.

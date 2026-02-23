# Manual de Usuario - SCRAM Soporte

**Mesa de Servicio SCRAM**
**URL:** https://soporte.scram2k.com
**Version:** 1.0
**Fecha:** Febrero 2026

---

## Tabla de Contenidos

1. [Introduccion](#1-introduccion)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Roles y Permisos](#3-roles-y-permisos)
4. [Panel Principal (Dashboard)](#4-panel-principal-dashboard)
5. [Crear un Ticket](#5-crear-un-ticket)
6. [Lista de Tickets](#6-lista-de-tickets)
7. [Detalle del Ticket](#7-detalle-del-ticket)
8. [Mis Tickets (Clientes)](#8-mis-tickets-clientes)
9. [Tablero Kanban](#9-tablero-kanban)
10. [Flujos de Trabajo](#10-flujos-de-trabajo)
11. [Referencia Rapida](#11-referencia-rapida)
12. [Administracion de GLPI](#12-administracion-de-glpi)
13. [Preguntas Frecuentes](#13-preguntas-frecuentes)

---

## 1. Introduccion

SCRAM Soporte es la mesa de servicio para gestionar incidentes y solicitudes de soporte tecnico. Permite a los clientes reportar problemas y a los tecnicos darles seguimiento hasta su resolucion.

### Que puedes hacer

- **Clientes:** Crear tickets de soporte, dar seguimiento a tus solicitudes
- **Tecnicos:** Gestionar tickets, asignar responsables, resolver incidentes
- **Administradores:** Todo lo anterior + eliminar tickets, ver metricas globales, gestionar asignaciones

---

## 2. Acceso al Sistema

### Iniciar Sesion

1. Abre https://soporte.scram2k.com en tu navegador
2. Ingresa tu **usuario** y **contrasena** de GLPI
3. Haz clic en **Iniciar Sesion**

> El sistema detecta automaticamente tu rol (Admin, Tecnico o Cliente) segun tu perfil en GLPI.

### Cerrar Sesion

1. En la barra lateral izquierda, haz clic en **Cerrar Sesion** al final del menu

### Usuarios por defecto

| Usuario | Contrasena | Rol |
|---------|------------|-----|
| glpi | glpi | Super-Admin |
| tech | tech | Tecnico |
| normal | normal | Observador (Cliente) |
| post-only | postonly | Self-Service (Cliente) |

> **IMPORTANTE:** Cambia estas contrasenas desde el panel de GLPI (https://glpi.scram2k.com) antes de poner en uso el sistema.

---

## 3. Roles y Permisos

El sistema tiene 3 roles principales. Tu rol se muestra como una etiqueta de color junto a tu nombre.

### Cliente (etiqueta verde)

- Ver el Dashboard con acciones rapidas
- Crear tickets nuevos
- Ver sus propios tickets en "Mis Tickets"
- Agregar comentarios a sus tickets

### Tecnico (etiqueta azul)

Todo lo del Cliente, mas:

- Ver **todos** los tickets del sistema
- Editar tickets (titulo, descripcion, estado, prioridad)
- Asignar tickets a tecnicos y grupos
- Agregar notas privadas (no visibles para clientes)
- Marcar tickets como resueltos con soluciones
- Enviar notificaciones por correo
- Ver el Tablero Kanban
- Ver tickets sin asignar

### Administrador (etiqueta roja)

Todo lo del Tecnico, mas:

- Eliminar tickets
- Ver metricas completas
- Acceso total a todas las funciones

### Matriz de Permisos

| Funcion | Cliente | Tecnico | Admin |
|---------|:-------:|:-------:|:-----:|
| Ver dashboard | Si | Si | Si |
| Crear ticket | Si | Si | Si |
| Ver sus tickets | Si | Si | Si |
| Ver todos los tickets | No | Si | Si |
| Editar tickets | No | Si | Si |
| Eliminar tickets | No | No | Si |
| Asignar tecnicos/grupos | No | Si | Si |
| Agregar notas privadas | No | Si | Si |
| Agregar soluciones | No | Si | Si |
| Ver Tablero Kanban | No | Si | Si |
| Ver tickets sin asignar | No | Si | Si |
| Enviar correo al cliente | No | Si | Si |

---

## 4. Panel Principal (Dashboard)

El Dashboard es la pantalla de inicio despues de iniciar sesion. Su contenido varia segun tu rol.

### Dashboard para Clientes

Al entrar veras:

- **Saludo personalizado** con tu nombre (Buenos dias/tardes/noches)
- **Dos tarjetas de accion rapida:**
  - **Reportar Incidente** - Te lleva a crear un ticket nuevo
  - **Mis Tickets** - Te lleva a ver tus tickets
- **Tickets recientes** - Los ultimos 5 tickets que has creado

Si no tienes tickets, veras un mensaje invitandote a crear tu primer ticket.

### Dashboard para Tecnicos y Administradores

#### Tarjetas de metricas (parte superior)

| Tarjeta | Que muestra |
|---------|-------------|
| **Tickets Activos** | Total de tickets nuevos + en curso |
| **Mis Asignados** | Tickets asignados a ti personalmente |
| **Sin Atender** | Tickets nuevos sin asignar (con boton "Atender") |
| **Tasa de Resolucion** | Porcentaje de tickets resueltos/cerrados vs total |

#### Secciones informativas

**Tickets Urgentes**
- Muestra hasta 5 tickets con prioridad alta o muy alta
- Haz clic en cualquiera para ver el detalle
- Enlace "Ver todos" para ir a la lista filtrada

**Resumen por Estado**
- Barras con el conteo de tickets por estado:
  - Nuevos, En Curso, Resueltos, Cerrados
- Haz clic en cualquier barra para ver esos tickets filtrados

**Acciones Rapidas**
4 botones para acceso directo:
- **Crear Ticket** - Nuevo ticket
- **Sin Asignar** - Ver tickets pendientes de asignacion
- **Mis Tickets** - Ver tus tickets asignados
- **Todos** - Ver todos los tickets

**Mis Tickets Recientes**
- Tabla con los ultimos 5 tickets asignados a ti
- Columnas: ID, Titulo, Estado, Prioridad, Fecha
- Haz clic en cualquiera para ver el detalle

> El Dashboard se actualiza automaticamente cada 30 segundos. Tambien puedes usar el boton de refrescar manual.

---

## 5. Crear un Ticket

**Ruta:** Menu lateral > "Nuevo Ticket" (o desde cualquier boton "Crear Ticket")

### Campos del formulario

#### Seccion: Informacion del Incidente

| Campo | Obligatorio | Descripcion |
|-------|:-----------:|-------------|
| **Titulo** | Si | Resumen breve del problema (ej: "No puedo acceder al correo") |
| **Descripcion** | Si | Detalle del problema. Incluye pasos para reproducir, mensajes de error, etc. |
| **Tipo** | No | "Incidente" (algo que falla) o "Solicitud" (algo que necesitas). Por defecto: Incidente |
| **Categoria** | No | Selecciona la categoria ITIL que mejor describa el problema |

#### Seccion: Asignacion

| Campo | Obligatorio | Descripcion |
|-------|:-----------:|-------------|
| **Proyecto / Ubicacion** | No | Selecciona la ubicacion o proyecto relacionado |
| **Area / Grupo** | No | Grupo de soporte responsable |
| **Asignar a (Tecnico)** | No | Tecnico especifico que atendera el ticket |

#### Seccion: Priorizacion

| Campo | Valor por defecto | Opciones |
|-------|:-----------------:|---------|
| **Urgencia** | Media | Muy baja, Baja, Media, Alta, Muy alta |
| **Impacto** | Medio | Muy bajo, Bajo, Medio, Alto, Muy alto |
| **Prioridad** | Media | Muy baja, Baja, Media, Alta, Muy alta, Mayor |

### Como crear un ticket

1. Haz clic en **Nuevo Ticket** en el menu lateral
2. Escribe un **titulo** claro y descriptivo
3. En la **descripcion**, detalla el problema:
   - Que estabas haciendo cuando ocurrio
   - Que mensaje de error viste
   - Desde cuando pasa
   - Que ya intentaste para resolverlo
4. Selecciona el **tipo** (Incidente o Solicitud)
5. Opcionalmente selecciona categoria, ubicacion y grupo
6. Ajusta la **urgencia** si es algo critico
7. Haz clic en **Crear Ticket**

Despues de crearlo, seras redirigido al detalle del ticket donde podras ver su estado y agregar informacion adicional.

---

## 6. Lista de Tickets

**Ruta:** Menu lateral > "Todos los Tickets" (Tecnicos/Admins) o "Mis Asignados"

### Barra de estadisticas

En la parte superior veras mini tarjetas con:
- **Todos** - Total de tickets
- **Mis Asignados** - Tus tickets (tecnico/admin)
- **Sin Asignar** - Tickets sin responsable
- **Nuevos** - Tickets recien creados

### Busqueda y filtros

**Buscar por ID**
- Escribe el numero de ticket en el campo con #
- Haz clic en **Ir** para saltar directamente a ese ticket

**Buscar por titulo**
- Escribe palabras clave en el campo de busqueda
- Haz clic en **Buscar**

**Filtros desplegables**
- **Estado:** Todos, Nuevo, Asignado, Planificado, En espera, Resuelto, Cerrado
- **Prioridad:** Todas, Muy alta, Alta, Media, Baja, Muy baja

**Limpiar filtros**
- Boton "Limpiar filtros" para restablecer todos los filtros

### Tabla de tickets

| Columna | Descripcion |
|---------|-------------|
| **ID** | Numero de ticket con prefijo # |
| **Titulo** | Nombre del ticket (haz clic para ver detalle) |
| **Estado** | Etiqueta con color e icono del estado actual |
| **Prioridad** | Etiqueta con color de la prioridad |
| **SLA** | Tiempo restante para resolver. Colores: Verde (OK), Amarillo (En riesgo), Rojo (Vencido) |
| **Asignado a** | Nombre del tecnico o "Sin asignar" con boton de asignacion rapida |
| **Fecha** | Fecha de creacion |
| **Acciones** | Boton "Ver" + boton "Asignar" (si no tiene tecnico) |

### SLA (Acuerdos de Nivel de Servicio)

La columna SLA muestra el tiempo restante con colores:

| Color | Significado | Tiempo restante |
|-------|-------------|:---------------:|
| Verde | En tiempo | Mas de 8 horas |
| Amarillo | En riesgo | Entre 2 y 8 horas |
| Rojo | Vencido | Menos de 2 horas o ya vencio |

Formato del tiempo: "2d 5h" (2 dias, 5 horas), "12h" (12 horas), "45m" (45 minutos)

### Asignacion rapida

1. En la columna "Asignado a", haz clic en el boton **Asignar** de un ticket sin asignar
2. Se abre un dialogo con:
   - Desplegable de **Tecnico** disponible
   - Desplegable de **Grupo** disponible
3. Selecciona uno o ambos
4. Haz clic en **Asignar**

### Paginacion

- 25 tickets por pagina
- Botones **Anterior** y **Siguiente** en la parte inferior
- Indicador "Pagina X de Y"

---

## 7. Detalle del Ticket

**Ruta:** Haz clic en cualquier ticket desde las listas o el dashboard

La pantalla de detalle se divide en dos columnas: contenido principal (izquierda) y panel lateral (derecha).

### Encabezado

- Boton **Volver** para regresar a la lista
- Numero de ticket **#ID**
- Etiqueta de **estado** actual
- Boton **Refrescar** para actualizar la informacion
- Boton **Editar** (tecnicos/admins) para modificar el ticket
- Boton **Eliminar** (solo admins) con confirmacion

### Columna principal (izquierda)

#### Vista normal

- **Titulo** del ticket
- **Descripcion** completa
- **Informacion meta:**
  - Fecha de creacion
  - Fecha de ultima modificacion
  - Prioridad
  - Urgencia

#### Modo edicion (tecnicos/admins)

Al hacer clic en **Editar**, los campos se vuelven editables:

| Campo | Tipo |
|-------|------|
| Titulo | Campo de texto |
| Descripcion | Area de texto |
| Estado | Desplegable (Nuevo, En Curso, Planificado, En Espera, Resuelto, Cerrado) |
| Urgencia | Desplegable (Muy baja a Muy alta) |
| Prioridad | Desplegable (Muy baja a Mayor) |

Botones: **Guardar** y **Cancelar**

> Todos los cambios se registran automaticamente en la linea de actividad.

#### Linea de actividad (Timeline)

Historial cronologico de todas las acciones del ticket. Cada entrada muestra:
- **Tipo** de accion (con icono y color)
- **Usuario** que realizo la accion
- **Fecha y hora**
- **Contenido** del comentario o descripcion del cambio

**Tipos de actividad:**

| Tipo | Icono | Color | Descripcion |
|------|-------|-------|-------------|
| Solucion | Foco | Verde | Solucion propuesta. Cambia el estado a Resuelto |
| Cambio de Estado | Flecha | Azul | Se cambio el estado del ticket |
| Asignacion | Usuario+ | Primario | Se asigno un tecnico o grupo |
| Desasignacion | Usuario- | Amarillo | Se removio un tecnico o grupo |
| Actualizacion | Engranaje | Gris | Se modificaron propiedades del ticket |
| Nota Privada | Candado | Amarillo | Nota interna (solo visible para tecnicos) |
| Comentario | Mensaje | Default | Comentario general |

#### Documentos adjuntos

- Lista de archivos adjuntos al ticket
- Muestra nombre del archivo y tipo
- Boton de **descarga** para cada archivo

#### Formulario para agregar comentarios

**Pestanas de tipo de comentario:**
- **Nota** - Comentario normal
- **Solucion** (solo tecnicos/admins) - Marca el ticket como resuelto

**Opciones del comentario:**

| Opcion | Disponible para | Descripcion |
|--------|:---------------:|-------------|
| Nota privada | Tecnicos/Admins | Marca la nota como privada (no visible para clientes) |
| Enviar correo al cliente | Tecnicos/Admins | Abre el cliente de correo para notificar al solicitante |

**Adjuntar archivos:**
- Zona de arrastrar y soltar archivos
- O haz clic para seleccionar archivos
- Tipos aceptados: imagenes, PDF, documentos de Office, texto
- Muestra lista de archivos seleccionados con tamano y boton para remover

**Botones de envio:**
- **Agregar Nota** - Envia comentario normal
- **Agregar y Notificar** - Envia comentario + abre correo electronico
- **Agregar Solucion** - Envia solucion y cambia estado a Resuelto

### Panel lateral (derecha)

#### Acciones rapidas de estado (tecnicos/admins)

Botones para cambiar el estado con un clic:

| Boton | Accion |
|-------|--------|
| **En Curso** | Cambia a estado "En Curso" (2) |
| **En Espera** | Cambia a estado "En Espera" (4) |
| **Resolver** | Cambia a estado "Resuelto" (5) |
| **Cerrar** | Cambia a estado "Cerrado" (6) |

> El boton del estado actual se oculta automaticamente.

#### SLA / Metricas

**Tiempo para Resolucion (TTR)**
- Fecha objetivo de resolucion
- Estado: En tiempo, En riesgo, Vencido, Critico
- Tiempo restante

**Primera Respuesta (TTO)**
- Fecha objetivo de primera respuesta
- Estado del cumplimiento

**Estadisticas del ticket:**
- Fecha de creacion
- Tiempo de toma (minutos hasta primera asignacion)
- Fecha de resolucion
- Tiempo total de vida del ticket

#### Informacion del solicitante

- Nombre completo
- Correo electronico (con boton para copiar)
- Telefono (si esta registrado)
- Boton **Enviar Correo** (abre el cliente de correo)

#### Tecnicos asignados

- Lista de tecnicos actualmente asignados
- Boton **X** para remover cada tecnico
- Desplegable para agregar nuevo tecnico
- Boton **+** para confirmar asignacion

#### Grupos asignados

- Lista de grupos actualmente asignados
- Boton **X** para remover cada grupo
- Desplegable para agregar nuevo grupo
- Boton **+** para confirmar asignacion

---

## 8. Mis Tickets (Clientes)

**Ruta:** Menu lateral > "Mis Tickets"

Esta seccion es exclusiva para usuarios con rol de Cliente.

### Encabezado

- Titulo: "Mis Tickets"
- Subtitulo: "Consulta el estado de tus solicitudes de soporte"
- Tarjeta de informacion del usuario con nombre, correo y perfil

### Tarjetas de resumen

| Tarjeta | Que muestra |
|---------|-------------|
| **Total** | Todos tus tickets |
| **Abiertos** | Tickets con estado < Resuelto |
| **Cerrados** | Tickets con estado Resuelto o Cerrado |

Haz clic en cualquier tarjeta para filtrar la lista.

### Filtros y acciones

- **Campo de busqueda** para filtrar por titulo
- Boton **Refrescar** para actualizar la lista
- Boton **Nuevo Ticket** para crear uno nuevo

### Pestanas de filtro

- **Todos** (con conteo)
- **Abiertos** (con conteo)
- **Cerrados** (con conteo)

### Tarjetas de tickets

Cada ticket se muestra como una tarjeta con:
- Numero de ticket (#ID)
- Etiqueta de estado con color
- Titulo del ticket
- Fecha de creacion
- Fecha de ultima actualizacion (si es diferente)

Haz clic en cualquier tarjeta para ver el detalle completo.

### Estado vacio

Si no tienes tickets, veras:
- Mensaje "No tienes tickets aun"
- Sugerencia para crear tu primer ticket
- Boton directo para crear ticket

---

## 9. Tablero Kanban

**Ruta:** Menu lateral > "Tablero Kanban" (solo Tecnicos y Admins)

Vista visual de tickets organizados en columnas por estado. Ideal para tener una vision general del flujo de trabajo.

### Filtros

Desplegable en la parte superior:
- **Todos los Tickets** - Muestra todos
- **Mis Asignados** - Solo tus tickets
- **Sin Asignar** - Tickets sin responsable

Boton de **refrescar** para actualizar.

### Columnas

| Columna | Estado | Icono |
|---------|--------|-------|
| **Nuevo** | Recien creado, sin atender | Alerta (circulo) |
| **En Curso** | Siendo atendido | Reloj |
| **En Espera** | Pausado o esperando informacion | Reloj |
| **Resuelto** | Solucion aplicada | Check (circulo) |
| **Cerrado** | Finalizado | X (circulo) |

Cada columna muestra un contador con la cantidad de tickets.

### Tarjetas del Kanban

Cada tarjeta muestra:
- **Numero de ticket** (#ID)
- **Punto de prioridad** (indicador de color)
- **Titulo** del ticket
- **Fecha** de creacion
- **Enlace** para abrir el detalle

**Colores por prioridad:**
- Rojo: Muy alta / Alta
- Amarillo: Media
- Verde: Baja / Muy baja

Si una columna esta vacia, muestra "Sin tickets".

---

## 10. Flujos de Trabajo

### Flujo para Clientes

```
1. Iniciar sesion
   |
2. Dashboard → Ver acciones rapidas
   |
3. "Reportar Incidente" → Llenar formulario → Crear Ticket
   |
4. "Mis Tickets" → Monitorear estado
   |
5. Ver detalle → Leer respuestas del tecnico → Agregar comentarios
   |
6. Ticket resuelto → Verificar solucion
```

### Flujo para Tecnicos

```
1. Iniciar sesion
   |
2. Dashboard → Ver metricas y tickets urgentes
   |
3. "Mis Asignados" o "Todos los Tickets" → Seleccionar ticket
   |
4. Ver detalle del ticket
   |
5. Opcion A: "En Curso" → Trabajar en solucion
   Opcion B: Asignar a otro tecnico/grupo
   |
6. Agregar notas de progreso / notas privadas
   |
7. Encontrar solucion → Tab "Solucion" → Describir solucion → Enviar
   |
8. Ticket se marca como Resuelto automaticamente
   |
9. (Opcional) Enviar notificacion por correo al cliente
```

### Flujo de asignacion rapida

```
1. "Todos los Tickets" → Ver lista
   |
2. Encontrar ticket "Sin asignar"
   |
3. Clic en "Asignar" → Seleccionar tecnico y/o grupo → Confirmar
   |
4. Ticket aparece en "Mis Asignados" del tecnico seleccionado
```

### Flujo de resolucion con notificacion

```
1. Abrir ticket → Tab "Solucion"
   |
2. Escribir descripcion de la solucion
   |
3. Activar "Enviar correo al cliente"
   |
4. Clic en "Agregar Solucion"
   |
5. Estado cambia a Resuelto + Se abre correo con datos del ticket pre-llenados
   |
6. Enviar correo desde tu cliente de email
```

---

## 11. Referencia Rapida

### Estados del Ticket

| Estado | Color | Significado |
|--------|-------|-------------|
| Nuevo | Rojo | Recien creado, nadie lo ha atendido |
| En Curso | Naranja | Un tecnico esta trabajando en el |
| Planificado | Morado | Se atenderan en una fecha programada |
| En Espera | Amarillo | Pausado (esperando informacion del cliente, etc.) |
| Resuelto | Verde | Se aplico una solucion |
| Cerrado | Gris | Ticket finalizado completamente |

### Niveles de Prioridad

| Prioridad | Color | Cuando usarla |
|-----------|-------|---------------|
| Muy baja | Gris claro | Consultas informativas, sin urgencia |
| Baja | Gris | Molestias menores, hay alternativas |
| Media | Amarillo | Problema que afecta el trabajo pero no es critico |
| Alta | Naranja | Problema que impide trabajar a una persona |
| Muy alta | Rojo | Problema que afecta a varias personas |
| Mayor | Rojo oscuro | Emergencia que afecta toda la operacion |

### Niveles de Urgencia

| Urgencia | Cuando seleccionarla |
|----------|---------------------|
| Muy baja | Puede esperar dias |
| Baja | Puede esperar hasta manana |
| Media | Deberia atenderse hoy |
| Alta | Necesita atencion en las proximas horas |
| Muy alta | Necesita atencion inmediata |

### Niveles de Impacto

| Impacto | Cuando seleccionarlo |
|---------|---------------------|
| Muy bajo | Afecta solo a mi en algo menor |
| Bajo | Afecta solo a mi |
| Medio | Afecta a mi equipo |
| Alto | Afecta a un departamento |
| Muy alto | Afecta a toda la empresa |

### Navegacion por rol

**Menu lateral - Cliente:**
- Dashboard
- Nuevo Ticket
- Mis Tickets

**Menu lateral - Tecnico:**
- Dashboard
- Nuevo Ticket
- Mis Asignados
- Todos los Tickets
- Tablero Kanban

**Menu lateral - Administrador:**
- Dashboard
- Nuevo Ticket
- Mis Asignados
- Sin Asignar
- Todos los Tickets
- Tablero Kanban

---

## 12. Administracion de GLPI

El backend de GLPI esta disponible en https://glpi.scram2k.com para administracion avanzada.

### Acceso

Ingresa con las credenciales de administrador (usuario `glpi`).

### Tareas administrativas comunes

**Crear usuarios nuevos:**
1. GLPI > Administracion > Usuarios > Agregar
2. Llenar nombre de usuario, contrasena, nombre real, correo
3. Asignar un perfil:
   - **Super-Admin** o **Admin** → Rol Administrador en el portal
   - **Technician** o **Supervisor** → Rol Tecnico en el portal
   - **Self-Service** u **Observer** → Rol Cliente en el portal

**Cambiar contrasenas:**
1. GLPI > Administracion > Usuarios
2. Seleccionar usuario > Cambiar contrasena

**Configurar categorias de tickets:**
1. GLPI > Configuracion > Desplegables > Categorias ITIL
2. Agregar las categorias relevantes (ej: Red, Hardware, Software, Correo)

**Configurar ubicaciones:**
1. GLPI > Configuracion > Desplegables > Ubicaciones
2. Agregar oficinas, sucursales, etc.

**Configurar grupos:**
1. GLPI > Administracion > Grupos
2. Crear grupos como "Soporte N1", "Soporte N2", "Infraestructura"
3. Asignar tecnicos a cada grupo

**Configurar SLAs:**
1. GLPI > Configuracion > SLAs
2. Definir tiempos de respuesta y resolucion por prioridad

**Generar tokens de API:**
1. GLPI > Configuracion > General > API
2. Verificar que la API REST este habilitada
3. Administrar clientes de API y sus tokens

---

## 13. Preguntas Frecuentes

**P: No puedo iniciar sesion**
R: Verifica que tu usuario y contrasena sean correctos. Si eres nuevo, pide al administrador que te cree una cuenta en GLPI.

**P: No veo la opcion "Todos los Tickets"**
R: Solo los tecnicos y administradores pueden ver todos los tickets. Los clientes solo ven sus propios tickets en "Mis Tickets".

**P: Como se que mi ticket fue recibido?**
R: Despues de crear el ticket, seras redirigido a su detalle donde veras el numero de ticket asignado. Puedes consultarlo en cualquier momento desde "Mis Tickets".

**P: Como agrego un archivo a mi ticket?**
R: En el detalle del ticket, baja hasta la seccion de comentarios. Veras una zona donde puedes arrastrar archivos o hacer clic para seleccionarlos. Soporta imagenes, PDF y documentos de Office.

**P: Que significan los colores del SLA?**
R: Verde = en tiempo, Amarillo = en riesgo de vencerse, Rojo = ya se vencio el tiempo limite.

**P: Como resuelvo un ticket?**
R: Como tecnico, abre el ticket y en la seccion de comentarios selecciona la pestana "Solucion". Describe lo que hiciste para resolver el problema y haz clic en "Agregar Solucion". El ticket se marcara como Resuelto automaticamente.

**P: Puedo enviar un correo al cliente desde el sistema?**
R: Si. Al agregar una nota o solucion, activa la opcion "Enviar correo al cliente". Se abrira tu cliente de correo con un mensaje pre-llenado con los datos del ticket.

**P: Que es una nota privada?**
R: Es un comentario interno que solo pueden ver los tecnicos y administradores. Los clientes no veran estas notas. Util para coordinar entre el equipo de soporte.

**P: Como asigno un ticket a otro tecnico?**
R: En el detalle del ticket, en el panel lateral derecho, busca "Tecnicos Asignados". Usa el desplegable para seleccionar al tecnico y haz clic en el boton +.

**P: Puedo asignar un ticket a un grupo?**
R: Si. En el panel lateral del ticket, busca "Grupos Asignados" y agrega el grupo deseado.

**P: El dashboard no muestra datos actualizados**
R: El dashboard se actualiza automaticamente cada 30 segundos. Tambien puedes hacer clic en el boton de refrescar para forzar una actualizacion.

**P: Donde cambio mi contrasena?**
R: Las contrasenas se gestionan desde el panel de GLPI (https://glpi.scram2k.com). Inicia sesion y ve a Preferencias > Contrasena.

---

*Manual generado para SCRAM Soporte v1.0 - Mesa de Servicio*
*https://soporte.scram2k.com*

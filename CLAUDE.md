# SCRAM Soporte - Mesa de Servicio

## Que es esto
Frontend React + Backend GLPI para la mesa de servicio de SCRAM (scram2k.com).
Instancia independiente clonada desde mesa-servicio-entersys.

## URLs
- **Frontend:** https://soporte.scram2k.com
- **Backend GLPI:** https://glpi.scram2k.com
- **Servidor:** 34.59.193.54 (prod)

## Contenedores
| Contenedor | Imagen | Dominio |
|-----------|--------|---------|
| `scram-glpi-db` | mariadb:10.11 | (interno) |
| `scram-glpi-app` | diouxx/glpi:latest | glpi.scram2k.com |
| `scram-helpdesk-frontend` | build local (React+Nginx) | soporte.scram2k.com |

## Stack
- React 19 + Vite 5 + React Router 7
- Nginx (para servir build estático)
- GLPI (backend ITSM)
- MariaDB 10.11
- Traefik v2.10 (reverse proxy + SSL)

## Variables de entorno
Copiar `.env.example` a `.env` y configurar:
- `MARIADB_ROOT_PASSWORD` - Password root de MariaDB
- `MARIADB_PASSWORD` - Password del usuario GLPI
- `VITE_GLPI_URL` - URL del backend GLPI (https://glpi.scram2k.com)
- `VITE_GLPI_APP_TOKEN` - API token generado en GLPI
- `VITE_GLPI_USER_TOKEN` - (opcional) Token de usuario para auto-login

## Desarrollo local
```bash
npm install
npm run dev
```

## Deploy a produccion
```bash
# 1. Subir al servidor
gcloud compute scp --recurse . prod-server:/srv/scram-soporte/ --zone=us-central1-c

# 2. En el servidor: crear .env con credenciales reales
# 3. Levantar servicios
cd /srv/scram-soporte && docker compose up -d

# 4. Primera vez: completar wizard GLPI en https://glpi.scram2k.com
#    - DB host: scram-glpi-db
#    - DB name: glpi
#    - DB user: glpi_user
#    - DB pass: (de .env)
# 5. Generar API token en GLPI → Configuración → General → API
# 6. Actualizar .env con VITE_GLPI_APP_TOKEN
# 7. Rebuild frontend: docker compose up -d --build scram-helpdesk-frontend
```

## DNS (Cloudflare)
- `soporte.scram2k.com` → A → 34.59.193.54 (proxied)
- `glpi.scram2k.com` → A → 34.59.193.54 (proxied)

## Troubleshooting
- **Frontend no carga:** Verificar que `scram-helpdesk-frontend` esté healthy
- **API 401:** Verificar VITE_GLPI_APP_TOKEN en .env y rebuild
- **GLPI no conecta a DB:** Verificar que `scram-glpi-db` esté healthy, revisar credenciales
- **SSL error:** Verificar labels de Traefik y que el DNS apunte al servidor

## Reglas
- NUNCA exponer credenciales en el código - usar variables de entorno
- SIEMPRE verificar que el target es prod antes de ejecutar operaciones destructivas
- Los backups de GLPI se hacen en el servidor remoto, no localmente

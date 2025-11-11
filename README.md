# RutaÓptima Frontend# RutaÓptima Frontend# React + TypeScript + Vite



Sistema de optimización de rutas de entrega desarrollado con React, TypeScript y Vite. Proporciona una interfaz web moderna para la gestión y optimización de rutas de distribución utilizando algoritmos avanzados.



## DescripciónSistema web de optimización de rutas de entrega construido con React, TypeScript, y Vite.This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



RutaÓptima Frontend es la interfaz de usuario del sistema de optimización de rutas que permite a los usuarios gestionar clientes, órdenes de entrega, vehículos y generar planes de ruta optimizados. La aplicación se comunica con un backend REST API para procesar la lógica de optimización y persistencia de datos.



## Stack Tecnológico## 🚀 CaracterísticasCurrently, two official plugins are available:



**Framework y Lenguaje:**

- React 19 - Librería de interfaz de usuario

- TypeScript - Tipado estático para JavaScript- **Autenticación JWT**: Sistema de login seguro- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- Vite - Herramienta de construcción y servidor de desarrollo

- **Dashboard interactivo**: Visualización de estadísticas en tiempo real- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

**Librerías Principales:**

- React Router DOM - Enrutamiento y navegación- **Optimización de rutas**: Algoritmos para minimizar distancia, tiempo o costo

- Zustand - Gestión de estado global

- Axios - Cliente HTTP para API REST- **Mapa interactivo**: Visualización de rutas con Leaflet## React Compiler

- React Leaflet - Visualización de mapas interactivos

- TailwindCSS - Framework de estilos utilitarios- **Gestión de órdenes**: Administración completa de pedidos y entregas

- Lucide React - Conjunto de iconos

- React Hook Form - Manejo de formularios- **Responsive**: Diseño adaptable a diferentes dispositivosThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- Zod - Validación de esquemas de datos



## Requisitos Previos

## 🛠️ Tecnologías## Expanding the ESLint configuration

- Node.js versión 18.x o superior

- npm versión 9.x o superior

- Backend API ejecutándose en puerto 8080 (dockerizado o local)

- **React 19** - Framework UIIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## Instalación

- **TypeScript** - Tipado estático

### 1. Clonar el repositorio

- **Vite** - Build tool y dev server```js

```bash

git clone https://github.com/Gian-windr/front-rutaOptima.git- **TailwindCSS** - Estilos utilitariosexport default defineConfig([

cd front-rutaOptima

```- **React Router** - Navegación SPA  globalIgnores(['dist']),



### 2. Instalar dependencias- **Zustand** - Gestión de estado  {



```bash- **Axios** - Cliente HTTP    files: ['**/*.{ts,tsx}'],

npm install

```- **React Leaflet** - Mapas interactivos    extends: [



### 3. Configurar variables de entorno- **Lucide React** - Iconos      // Other configs...



Crear un archivo `.env` en la raíz del proyecto con la siguiente configuración:- **React Hook Form** - Manejo de formularios



```env- **Zod** - Validación de esquemas      // Remove tseslint.configs.recommended and replace with this

VITE_API_URL=http://localhost:8080/api

```      tseslint.configs.recommendedTypeChecked,



Para producción, ajustar la URL según el entorno de despliegue.## 📋 Requisitos      // Alternatively, use this for stricter rules



## Uso      tseslint.configs.strictTypeChecked,



### Modo Desarrollo- Node.js 18.x o superior      // Optionally, add this for stylistic rules



Iniciar el servidor de desarrollo con recarga automática:- npm 9.x o superior      tseslint.configs.stylisticTypeChecked,



```bash

npm run dev

```## 🔧 Instalación      // Other configs...



La aplicación estará disponible en `http://localhost:5173`    ],



### Construcción para Producción1. Clonar el repositorio:    languageOptions: {



Compilar el proyecto para producción:```bash      parserOptions: {



```bashgit clone <repository-url>        project: ['./tsconfig.node.json', './tsconfig.app.json'],

npm run build

```cd ruta-optima-frontend        tsconfigRootDir: import.meta.dirname,



Los archivos optimizados se generarán en la carpeta `dist/````      },



### Vista Previa de Producción      // other options...



Previsualizar la versión de producción localmente:2. Instalar dependencias:    },



```bash```bash  },

npm run preview

```npm install])



### Análisis de Código``````



Ejecutar ESLint para verificar la calidad del código:



```bash3. Configurar variables de entorno:You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

npm run lint

``````bash



## Estructura del Proyecto# Crear archivo .env en la raíz del proyecto```js



```VITE_API_URL=http://localhost:8080/api// eslint.config.js

ruta-optima-frontend/

├── public/                 # Archivos estáticos públicos```import reactX from 'eslint-plugin-react-x'

├── src/

│   ├── assets/            # Recursos (imágenes, fuentes, etc.)import reactDom from 'eslint-plugin-react-dom'

│   ├── components/        # Componentes reutilizables

│   │   ├── auth/         # Componentes de autenticación## 🚀 Uso

│   │   ├── dashboard/    # Componentes del dashboard

│   │   ├── layout/       # Componentes de layout (sidebar, navbar)export default defineConfig([

│   │   └── routes/       # Componentes de visualización de rutas

│   ├── pages/            # Páginas principales de la aplicación### Desarrollo  globalIgnores(['dist']),

│   │   ├── DashboardPage.tsx

│   │   ├── LoginPage.tsx```bash  {

│   │   └── OptimizeRoutePage.tsx

│   ├── services/         # Servicios de API y lógica de negocionpm run dev    files: ['**/*.{ts,tsx}'],

│   │   ├── api.ts

│   │   ├── authService.ts```    extends: [

│   │   └── dataService.ts

│   ├── store/            # Estado global de la aplicaciónEl servidor de desarrollo se iniciará en `http://localhost:5173`      // Other configs...

│   │   └── useStore.ts

│   ├── types/            # Definiciones de tipos TypeScript      // Enable lint rules for React

│   │   └── api.types.ts

│   ├── App.tsx           # Componente raíz de la aplicación### Build de producción      reactX.configs['recommended-typescript'],

│   ├── main.tsx          # Punto de entrada de la aplicación

│   └── index.css         # Estilos globales```bash      // Enable lint rules for React DOM

├── index.html            # Plantilla HTML

├── package.json          # Dependencias y scriptsnpm run build      reactDom.configs.recommended,

├── tsconfig.json         # Configuración de TypeScript

├── vite.config.ts        # Configuración de Vite```    ],

└── tailwind.config.js    # Configuración de TailwindCSS

```    languageOptions: {



## Características Principales### Preview de producción      parserOptions: {



### Autenticación```bash        project: ['./tsconfig.node.json', './tsconfig.app.json'],



El sistema implementa autenticación basada en JWT (JSON Web Tokens):npm run preview        tsconfigRootDir: import.meta.dirname,



- Almacenamiento seguro del token en localStorage```      },

- Inclusión automática del token en todas las peticiones HTTP mediante interceptores

- Redirección automática al login cuando el token expira o es inválido      // other options...

- Protección de rutas mediante componentes de orden superior

### Linting    },

**Credenciales de prueba:**

- Usuario: `admin@rutaoptima.com````bash  },

- Contraseña: `password`

npm run lint])

### Dashboard

``````

Panel de control que presenta:



- Estadísticas generales del sistema (clientes, órdenes, vehículos)## 📁 Estructura del Proyecto

- Indicadores de órdenes pendientes

- Acceso rápido a funcionalidades principales```

- Visualización en tiempo real de métricas clavesrc/

├── components/      # Componentes reutilizables

### Optimización de Rutas│   ├── auth/       # Componentes de autenticación

│   ├── dashboard/  # Componentes del dashboard

Módulo principal que permite:│   ├── layout/     # Layouts (sidebar, navbar)

│   └── routes/     # Componentes de rutas (mapa)

- Selección de órdenes pendientes para incluir en la optimización├── pages/          # Páginas principales

- Selección de vehículos disponibles para asignación│   ├── DashboardPage.tsx

- Configuración de objetivos de optimización:│   ├── LoginPage.tsx

  - Minimizar distancia total recorrida│   └── OptimizeRoutePage.tsx

  - Minimizar tiempo total de entrega├── services/       # Servicios API

  - Minimizar costo operativo│   ├── api.ts

- Visualización del plan de rutas optimizado en mapa interactivo│   ├── authService.ts

- Detalle de paradas con tiempos estimados de llegada (ETA) y salida (ETD)│   └── dataService.ts

- Información de distancias parciales y acumuladas├── store/          # Estado global (Zustand)

│   └── useStore.ts

### Visualización de Mapas├── types/          # Definiciones TypeScript

│   └── api.types.ts

Integración con Leaflet para:├── App.tsx         # Componente raíz

└── main.tsx        # Punto de entrada

- Visualización geográfica de rutas optimizadas```

- Marcadores de depósito central y puntos de entrega

- Líneas de ruta con codificación por vehículo## 🔐 Autenticación

- Popups informativos con datos de cada parada

- Interactividad completa (zoom, pan, selección)El sistema usa JWT (JSON Web Tokens) para la autenticación:



## Integración con Backend- El token se almacena en localStorage

- Se incluye automáticamente en todas las peticiones HTTP

El frontend se comunica con una API REST del backend. La configuración de la URL base se gestiona mediante variables de entorno.- Redirección automática al login si el token expira



**URL Base por Defecto:** `http://localhost:8080/api`**Credenciales de prueba:**

- Email: `admin@rutaoptima.com`

### Endpoints Principales- Password: `password`



- `POST /auth/login` - Autenticación de usuarios## 🗺️ Características Principales

- `GET /customers` - Listar clientes

- `POST /customers` - Crear nuevo cliente### Dashboard

- `GET /orders` - Listar órdenes- Estadísticas generales del sistema

- `POST /orders` - Crear nueva orden- Contadores de clientes, órdenes, vehículos

- `GET /vehicles` - Listar vehículos- Acceso rápido a funcionalidades principales

- `GET /vehicles/activos` - Listar vehículos activos

- `POST /route-plans/optimize` - Generar plan de rutas optimizado### Optimización de Rutas

- `GET /route-plans/{id}` - Obtener detalle de un plan de rutas- Selección de órdenes pendientes

- Selección de vehículos disponibles

## Consideraciones de Despliegue- Objetivos de optimización:

  - Minimizar distancia

### CORS (Cross-Origin Resource Sharing)  - Minimizar tiempo

  - Minimizar costo

Para desarrollo local, asegurarse de que el backend permita peticiones desde:- Visualización del plan optimizado en mapa

- `http://localhost:5173` (desarrollo)- Detalles de paradas con tiempos estimados

- Dominio de producción correspondiente

## 🎨 Temas y Estilos

### Construcción de Producción

El proyecto usa TailwindCSS con una paleta de colores personalizada:

La construcción de producción genera:

- JavaScript minificado y optimizado con tree-shaking- **Primary**: Azul (#0284c7)

- CSS optimizado con purga de clases no utilizadas- Diseño limpio y moderno

- Assets con hashing para control de caché- Componentes con hover states

- Análisis de bundle size para optimización- Transiciones suaves



### Variables de Entorno## 🔄 Integración con Backend



En producción, configurar `VITE_API_URL` con la URL del backend desplegado.El frontend se conecta con una API REST:



## Solución de Problemas**Base URL**: `http://localhost:8080/api`



### Error de conexión al backend### Endpoints principales:

- `POST /auth/login` - Autenticación

**Síntoma:** Error de red o timeout en peticiones API- `GET /customers` - Listar clientes

- `GET /orders` - Listar órdenes

**Solución:**- `GET /vehicles` - Listar vehículos

1. Verificar que el backend esté ejecutándose: `docker ps`- `POST /route-plans/optimize` - Optimizar rutas

2. Confirmar que el puerto 8080 esté accesible

3. Revisar la configuración de CORS en el backend## 🐛 Solución de Problemas

4. Verificar la variable de entorno `VITE_API_URL`

### Error de CORS

### Iconos de mapa no visiblesSi encuentras errores de CORS, asegúrate de que el backend permita peticiones desde `http://localhost:5173`



**Síntoma:** Marcadores del mapa no se muestran correctamente### Iconos de Leaflet no se muestran

Los iconos se cargan desde CDN. Verifica tu conexión a internet.

**Solución:**

- Los iconos de Leaflet se cargan desde CDN### Token expirado

- Verificar conexión a internetEl sistema redirige automáticamente al login. Vuelve a iniciar sesión.

- Revisar la consola del navegador para errores de carga

## 📝 Licencia

### Token JWT expirado

© 2025 RutaÓptima. Todos los derechos reservados.

**Síntoma:** Redirección automática al login

## 👥 Contribuir

**Solución:**

- Comportamiento esperado del sistema1. Fork el proyecto

- Volver a iniciar sesión con credenciales válidas2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)

- El token se renovará automáticamente3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)

4. Push a la rama (`git push origin feature/AmazingFeature`)

## Contribución5. Abre un Pull Request



### Flujo de Trabajo## 📞 Soporte



1. Fork del repositorioPara reportar problemas o solicitar características, abre un issue en el repositorio.

2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Realizar cambios con commits descriptivos
4. Ejecutar tests y linter: `npm run lint`
5. Push a la rama: `git push origin feature/nueva-funcionalidad`
6. Crear Pull Request con descripción detallada

### Estándares de Código

- Seguir convenciones de TypeScript y React
- Mantener componentes pequeños y enfocados
- Documentar funciones y componentes complejos
- Asegurar tipado estricto (sin `any`)
- Escribir código auto-explicativo

## Licencia

Copyright (c) 2025 RutaÓptima. Todos los derechos reservados.

## Contacto y Soporte

Para reportar problemas, solicitar funcionalidades o contribuir al proyecto:

- GitHub Issues: [https://github.com/Gian-windr/front-rutaOptima/issues](https://github.com/Gian-windr/front-rutaOptima/issues)
- Pull Requests: [https://github.com/Gian-windr/front-rutaOptima/pulls](https://github.com/Gian-windr/front-rutaOptima/pulls)

## Changelog

### Versión 0.0.0 (Actual)

- Implementación inicial del sistema
- Autenticación JWT
- Dashboard con estadísticas
- Módulo de optimización de rutas
- Visualización de mapas con Leaflet
- Integración completa con backend REST API

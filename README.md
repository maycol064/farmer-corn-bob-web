# Bob's Corn Web (React + TypeScript + Vite + Tailwind)

Frontend para la tienda de maíz de Bob. Implementa:

- **Autenticación** con **access + refresh tokens** y **rotación segura**.
- **Interceptores Axios** con cola de refresh para evitar condiciones de carrera.
- **Ruteo protegido**: `/` muestra **Login** si no hay sesión; con sesión redirige a **/app** (Dashboard).
- **Compra** con **rate limit**: UI muestra contador regresivo, barra de progreso y cabeceras `X-RateLimit-*`.
- **Tailwind CSS** + **dark mode** con toggle en la navbar.

---

## Requisitos

- Node.js **>= 20**
- npm **>= 9**
- API corriendo (por defecto en `http://localhost:3000`) con CORS habilitado y headers expuestos:
  - `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Instalación

```bash
npm i
```

Crea un archivo .env en la raíz del proyecto con:
```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

Scripts
```bash
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```

Estructura del proyecto
```
src/
├─ App.tsx
├─ main.tsx
├─ index.css
├─ api/
│  ├─ http.ts               
│  ├─ auth.ts               
│  ├─ corn.ts               
│  └─ headers.ts            
├─ auth/
│  ├─ AuthProvider.tsx      
│  ├─ context.ts            
│  ├─ tokenStorage.ts       
│  └─ useAuth.ts            
├─ components/
│  ├─ Navbar.tsx            
│  ├─ ProtectedRoute.tsx    
│  ├─ PublicOnlyRoute.tsx   
│  ├─ LoginForm.tsx
│  ├─ RegisterForm.tsx
│  ├─ PurchaseCard.tsx      
│  └─ RateLimitInfo.tsx     
├─ hooks/
│  └─ useCountdown.ts
├─ pages/
│  ├─ SignIn.tsx
│  ├─ SignUp.tsx
│  └─ Dashboard.tsx
└─ utils/
   ├─ jwt.ts                
   └─ time.ts               
```

Ejecución
``` bash
# Ejecutar en dev
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```
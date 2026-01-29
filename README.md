# Activity Tracker - Calendario Mensual

Aplicación web para el seguimiento diario de Sueño, Alimentación y Deporte, desarrollada con **Next.js (App Router)**, **TypeScript**, **Tailwind CSS** y **Supabase**.

## 🚀 Inicio Rápido

### 1. Configuración de Supabase

Crea una tabla en tu instancia de Supabase ejecutando el siguiente SQL en el Editor SQL:

```sql
create table daily_scores (
  date date primary key,
  sleep int check (sleep >= 0 and sleep <= 10) default 0,
  food int check (food >= 0 and food <= 10) default 0,
  sport int check (sport >= 0 and sport <= 10) default 0,
  updated_at timestamp with time zone default now()
);

-- Habilitar RLS (Políticas Públicas para App Anon)
alter table daily_scores enable row level security;
create policy "Public Select" on daily_scores for select using (true);
create policy "Public Insert" on daily_scores for insert with check (true);
create policy "Public Update" on daily_scores for update using (true);
```

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz con tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_publica
```

### 3. Ejecutar con Docker

```bash
docker compose up --build
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🎨 Lógica de Colores

La puntuación total se calcula sumando los tres parámetros (0-10 cada uno, máximo 30):

- 🟢 **Verde (Top)**: Total > 21
- 🟡 **Amarillo (Ok)**: Total > 15 y ≤ 21
- 🔴 **Rojo (Oops)**: Total ≤ 15

## 🚢 Despliegue con Dokploy

Para desplegar esta app en tu VPS usando Dokploy:

1. **Crear Aplicación**: Selecciona el repositorio de GitHub y la rama `main`.
2. **Tipo de Despliegue**: Docker.
3. **Variables y Build Args**: Debes añadir `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` tanto en **Environment Variables** como en **Build Arguments** (esto último es vital para Next.js).
4. **Puerto**: 3000.
5. **Dominios**: Configura tu dominio y pulsa **Deploy**.

## 🔒 Seguridad (Aviso)

Esta aplicación no requiere autenticación y utiliza la clave pública de Supabase. Esto significa que **cualquier persona con acceso a la URL de la app puede ver y editar los datos**. Esta configuración es ideal para un uso personal o MVP público, pero no para datos privados o sensibles.

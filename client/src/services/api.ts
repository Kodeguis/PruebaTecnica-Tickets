const BASE_URL = "http://localhost:3000/api";

// Helper genérico para realizar peticiones HTTP seguras al backend
export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  // Si enviamos cuerpo y no es FormData, configuramos por defecto JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // Clave: incluye cookies de sesión JWT en cada petición
  });

  // Intentamos capturar el cuerpo JSON, si no hay cuerpo retorna null
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Lanzamos el error devuelto por Express
    throw new Error(data?.error || "Ocurrió un error en el servidor");
  }

  return data as T;
}

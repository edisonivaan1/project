const API_BASE_URL = 'http://localhost:5000/api';

// Interfaz para las respuestas de la API
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  errors?: any[];
  // Propiedades específicas de diferentes endpoints
  securityQuestion?: string;
  email?: string;
}

// Función helper para hacer peticiones HTTP
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Error en la petición',
        errors: data.errors || [],
      };
    }

    return data;
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    
    // Error de red o servidor no disponible
    throw {
      status: 500,
      message: 'Error de conexión. Verifica que el servidor esté ejecutándose.',
      errors: [],
    };
  }
};

// Servicios de autenticación
export const authService = {
  // Registro de usuario
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    securityQuestion: string;
    securityAnswer: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login de usuario
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Obtener pregunta de seguridad
  forgotPassword: async (email: string) => {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Resetear contraseña
  resetPassword: async (resetData: {
    email: string;
    securityAnswer: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    });
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

// Helper para manejar errores de autenticación
export const handleAuthError = (error: any): string => {
  switch (error.status) {
    case 400:
      if (error.message.includes('already exists')) {
        return 'Ya existe una cuenta con este email';
      }
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        return error.errors[0].msg || error.errors[0];
      }
      return error.message || 'Error en la validación de datos';
    
    case 401:
      return 'Credenciales incorrectas. Verifica tu email y contraseña.';
    
    case 404:
      return 'No se encontró una cuenta con este email.';
    
    case 500:
      return error.message || 'Error del servidor. Inténtalo de nuevo más tarde.';
    
    default:
      return error.message || 'Error inesperado. Inténtalo de nuevo.';
  }
};

export default { authService, handleAuthError }; 
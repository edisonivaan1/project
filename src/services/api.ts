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

// Servicios de progreso del juego
export const progressService = {
  // Obtener progreso completo del usuario
  getProgress: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    try {
      const response = await apiRequest('/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Progress API response:', response);
      return response;
    } catch (error) {
      console.error('Error in getProgress:', error);
      throw error;
    }
  },

  // Completar un nivel
  completeLevel: async (levelData: {
    topicId: string;
    difficulty: 'easy' | 'medium' | 'hard';
    correct: number;
    total: number;
  }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Validar datos de entrada
    if (!levelData.topicId || !levelData.difficulty) {
      throw new Error('Topic ID and difficulty are required');
    }
    
    if (typeof levelData.correct !== 'number' || typeof levelData.total !== 'number') {
      throw new Error('Correct and total must be numbers');
    }
    
    if (levelData.correct < 0 || levelData.total <= 0 || levelData.correct > levelData.total) {
      throw new Error('Invalid score values');
    }
    
    try {
      console.log('Sending level completion data:', levelData);
      
      const response = await apiRequest('/progress/complete-level', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(levelData),
      });
      
      console.log('Complete level API response:', response);
      return response;
    } catch (error) {
      console.error('Error in completeLevel:', error);
      throw error;
    }
  },

  // Obtener progreso de un nivel específico
  getLevelProgress: async (topicId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/progress/level/${topicId}/${difficulty}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Obtener dificultades desbloqueadas
  getUnlockedDifficulties: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/progress/unlocked-difficulties', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Obtener estadísticas del usuario
  getStats: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/progress/stats', {
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

export default { authService, progressService, handleAuthError }; 
import { CompleteLevelData } from '../types';

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
    // Obtener el token de autenticación
    const token = localStorage.getItem('authToken');
    
    // Preparar los headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Si es error de autenticación, limpiar el token
      if (response.status === 401) {
        localStorage.removeItem('authToken');
      }
      
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
      message: 'Connection error. Verify that the server is running.',
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

  // Actualizar imagen de perfil
  updateProfileImage: async (profileImageBase64: string) => {
    return apiRequest('/auth/profile-image', {
      method: 'PUT',
      body: JSON.stringify({ profileImage: profileImageBase64 }),
    });
  },

  // Eliminar imagen de perfil
  deleteProfileImage: async () => {
    return apiRequest('/auth/profile-image', {
      method: 'DELETE',
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

  // Obtener historial de intentos del usuario
  getAttempts: async (filters?: {
    topicId?: string;
    difficulty?: string;
    limit?: number;
    skip?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = `/progress/attempts${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await apiRequest(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Attempts API response:', response);
      return response;
    } catch (error) {
      console.error('Error in getAttempts:', error);
      throw error;
    }
  },

  // Completar un nivel
  completeLevel: async (data: CompleteLevelData): Promise<ApiResponse> => {
    try {
      console.log('🚀 Iniciando completeLevel');
      
      // Verificar autenticación
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('❌ No se encontró token de autenticación');
        throw new Error('No authentication token found');
      }

      console.log('🔑 Token encontrado');
      console.log('📦 Datos recibidos:', data);
      
      // Formatear los datos según el esquema esperado
      const formattedData = {
        topicId: data.topicId.replace('_', '-'), // Convertir guión bajo a guión
        difficulty: data.difficulty,
        correct: data.correct, // Mover fuera del objeto score
        total: data.total, // Mover fuera del objeto score
        timeSpent: data.timeSpent || 0,
        hintsUsed: data.hintsUsed || 0,
        questionsDetails: data.questionsDetails?.map(q => ({
          ...q,
          timeSpent: q.timeSpent || 0,
          hintsUsed: q.hintsUsed || 0
        })) || []
      };

      console.log('📝 Datos formateados:', formattedData);
      
      try {
        const response = await apiRequest('/progress/complete-level', {
          method: 'POST',
          body: JSON.stringify(formattedData)
        });

        console.log('✅ Respuesta del servidor:', response);
        return response;
      } catch (error: any) {
        console.error('❌ Error en la petición:', error);
        if (error.status === 401) {
          console.error('❌ Error de autenticación - Token inválido o expirado');
        }
        throw error;
      }
    } catch (error) {
      console.error('❌ Error en completeLevel:', error);
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

// Achievement Service
export const achievementService = {
  // Obtener todos los achievements disponibles
  getAllAchievements: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Obtener achievements del usuario
  getUserAchievements: async (includeAll: boolean = true) => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/achievements/user?includeAll=${includeAll}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Obtener estadísticas de achievements del usuario
  getUserAchievementStats: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements/user/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Obtener achievements no notificados
  getUnnotifiedAchievements: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements/user/unnotified', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Verificar achievements manualmente
  checkAchievements: async (context?: any) => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements/check', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context }),
    });
  },

  // Marcar achievements como notificados
  markAsNotified: async (achievementIds: string[]) => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements/mark-notified', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ achievementIds }),
    });
  },

  // Obtener leaderboard de achievements
  getLeaderboard: async (limit: number = 10) => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/achievements/leaderboard?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Obtener achievements por categoría
  getAchievementsByCategory: async (category: string) => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/achievements/category/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // ADMIN/DEV endpoints
  initializeAchievements: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  resetUserAchievements: async () => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/achievements/reset-user', {
      method: 'POST',
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
        return 'This email is already registered';
      }
      if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        return error.errors[0].msg || error.errors[0];
      }
      return error.message || 'Data validation error';
    
    case 401:
      return 'Incorrect credentials. Verify your email and password.';
    
    case 404:
      return 'No account was found with this email address.';
    
    case 500:
      return error.message || 'Server error. Please try again later.';
    
    default:
      return error.message || 'Unexpected error. Please try again.';
  }
};

// Servicios para intentos en progreso
export const inProgressAttemptService = {
  // Obtener intento en progreso
  getInProgressAttempt: async (topicId: string, difficulty: string) => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/progress/in-progress/${topicId}/${difficulty}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Crear o actualizar intento en progreso
  saveInProgressAttempt: async (attemptData: {
    topicId: string;
    difficulty: string;
    totalQuestions: number;
    currentQuestionIndex?: number;
    answers?: Record<string, string>;
    usedHints?: number[];
    timePerQuestion?: Record<string, number>;
    hintsPerQuestion?: Record<string, number>;
  }) => {
    const token = localStorage.getItem('authToken');
    return apiRequest('/progress/in-progress', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attemptData),
    });
  },

  // Eliminar intento en progreso
  deleteInProgressAttempt: async (topicId: string, difficulty: string) => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/progress/in-progress/${topicId}/${difficulty}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Guardar respuesta individual
  saveAnswer: async (topicId: string, difficulty: string, answerData: {
    questionIndex: number;
    answer: string;
    timeSpent?: number;
    hintsUsed?: number;
  }) => {
    const token = localStorage.getItem('authToken');
    return apiRequest(`/progress/in-progress/${topicId}/${difficulty}/answer`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(answerData),
    });
  }
};

// Support Service
export const supportService = {
  // Enviar mensaje de soporte
  submitMessage: async (messageData: {
    message: string;
    category?: string;
    userEmail?: string;
  }) => {
    return apiRequest('/support/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Obtener mensajes de soporte (para administradores)
  getMessages: async (params?: {
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiRequest(`/support/messages${queryString}`);
  },

  // Actualizar estado de mensaje (para administradores)
  updateMessageStatus: async (messageId: string, status: string, adminNotes?: string) => {
    return apiRequest(`/support/messages/${messageId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  },

  // Obtener estadísticas de soporte (para administradores)
  getStats: async () => {
    return apiRequest('/support/stats');
  }
};

export default { authService, progressService, achievementService, inProgressAttemptService, supportService, handleAuthError }; 
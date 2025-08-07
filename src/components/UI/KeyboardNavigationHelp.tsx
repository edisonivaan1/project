import React, { useState, useEffect } from 'react';
import { Keyboard, X, Info } from 'lucide-react';

interface KeyboardHelpProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const KeyboardNavigationHelp: React.FC<KeyboardHelpProps> = ({ 
  isVisible = false, 
  onClose 
}) => {
  const [showHelp, setShowHelp] = useState(isVisible);

  useEffect(() => {
    setShowHelp(isVisible);
  }, [isVisible]);

  // Eliminado: Mostrar ayuda automáticamente la primera vez
  // useEffect(() => {
  //   const hasSeenHelp = localStorage.getItem('keyboardHelpSeen');
  //   if (!hasSeenHelp) {
  //     const timer = setTimeout(() => {
  //       setShowHelp(true);
  //     }, 2000);
  //     return () => clearTimeout(timer);
  //   }
  // }, []);

  const handleClose = () => {
    setShowHelp(false);
    localStorage.setItem('keyboardHelpSeen', 'true');
    onClose?.();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Abrir ayuda con F1
      if (event.key === 'F1') {
        event.preventDefault();
        setShowHelp(true);
      }
      // Cerrar ayuda con Escape
      if (event.key === 'Escape' && showHelp) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 z-40"
        aria-label="Mostrar ayuda de navegación por teclado (F1)"
        title="Presiona F1 para ayuda de navegación"
      >
        <Keyboard className="h-6 w-6" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-help-title"
      aria-describedby="keyboard-help-description"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Keyboard className="h-6 w-6 text-blue-600" aria-hidden="true" />
              <h2 
                id="keyboard-help-title" 
                className="text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                tabIndex={0}
                role="heading"
                aria-level={2}
              >
                Ayuda de Navegación por Teclado
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg p-1"
              aria-label="Cerrar ayuda"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div id="keyboard-help-description" className="space-y-6">
                          <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p 
                    className="text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    role="text"
                  >
                    Esta aplicación es completamente accesible por teclado. Todos los elementos pueden ser navegados sin usar el mouse.
                  </p>
                </div>
              </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 
                  className="font-semibold text-gray-900 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                  tabIndex={0}
                  role="heading"
                  aria-level={3}
                >
                  Navegación General
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      tabIndex={0}
                      role="text"
                    >
                      Elemento siguiente:
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      tabIndex={0}
                      role="text"
                    >
                      Elemento anterior:
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + Tab</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      tabIndex={0}
                      role="text"
                    >
                      Activar elemento:
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter / Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span 
                      className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                      tabIndex={0}
                      role="text"
                    >
                      Saltar al contenido:
                    </span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Skip links</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Navegación Avanzada</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arriba/Abajo:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑ / ↓</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Izquierda/Derecha:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">← / →</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ir al inicio:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Home</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ir al final:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">End</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Navegación Rápida</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Página anterior:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Page Up</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Página siguiente:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Page Down</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Esta ayuda:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F1</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cerrar modal:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Elementos Específicos</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Botones:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter / Space</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enlaces:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campos de texto:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Focus + Type</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Checkboxes:</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Funciones de Accesibilidad</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Lector de Pantalla</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Todas las imágenes tienen texto alternativo</li>
                    <li>Botones tienen etiquetas descriptivas</li>
                    <li>Encabezados organizados jerárquicamente</li>
                    <li>Estados de elementos anunciados</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Indicadores Visuales</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Anillos de foco visibles en todos los elementos</li>
                    <li>Estados hover y focus diferenciados</li>
                    <li>Soporte para alto contraste</li>
                    <li>Respeta preferencias de movimiento reducido</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Presiona <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F1</kbd> en cualquier momento para ver esta ayuda
              </p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardNavigationHelp;

import { useEffect } from 'react';

interface UseKeyboardNavigationOptions {
  enableArrowKeys?: boolean;
  enableHomeEnd?: boolean;
  enablePageUpDown?: boolean;
  onNavigate?: (direction: 'next' | 'previous' | 'first' | 'last') => void;
}

/**
 * Hook personalizado para mejorar la navegación por teclado
 * Permite navegar entre todos los elementos focalizables de la página
 */
export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}) => {
  const {
    enableArrowKeys = true,
    enableHomeEnd = true,
    enablePageUpDown = true,
    onNavigate
  } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Obtener todos los elementos focalizables
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="text"], [role="img"], [role="heading"], h1, h2, h3, h4, h5, h6'
      ) as NodeListOf<HTMLElement>;

      const focusableArray = Array.from(focusableElements).filter(
        el => !el.hasAttribute('disabled') && el.offsetParent !== null
      );

      const currentIndex = focusableArray.indexOf(document.activeElement as HTMLElement);

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          if (enableArrowKeys) {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % focusableArray.length;
            focusableArray[nextIndex]?.focus();
            onNavigate?.('next');
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          if (enableArrowKeys) {
            event.preventDefault();
            const prevIndex = currentIndex <= 0 ? focusableArray.length - 1 : currentIndex - 1;
            focusableArray[prevIndex]?.focus();
            onNavigate?.('previous');
          }
          break;

        case 'Home':
          if (enableHomeEnd) {
            event.preventDefault();
            focusableArray[0]?.focus();
            onNavigate?.('first');
          }
          break;

        case 'End':
          if (enableHomeEnd) {
            event.preventDefault();
            focusableArray[focusableArray.length - 1]?.focus();
            onNavigate?.('last');
          }
          break;

        case 'PageDown':
          if (enablePageUpDown) {
            event.preventDefault();
            const pageDownIndex = Math.min(currentIndex + 10, focusableArray.length - 1);
            focusableArray[pageDownIndex]?.focus();
            onNavigate?.('next');
          }
          break;

        case 'PageUp':
          if (enablePageUpDown) {
            event.preventDefault();
            const pageUpIndex = Math.max(currentIndex - 10, 0);
            focusableArray[pageUpIndex]?.focus();
            onNavigate?.('previous');
          }
          break;
      }
    };

    // Agregar el event listener
    document.addEventListener('keydown', handleKeyDown);

    // Función para anunciar el elemento actual al lector de pantalla
    const announceCurrentElement = () => {
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) {
        const ariaLabel = activeElement.getAttribute('aria-label');
        const textContent = activeElement.textContent?.trim();
        const role = activeElement.getAttribute('role');
        const tagName = activeElement.tagName.toLowerCase();

        // Crear un mensaje descriptivo
        let announcement = '';
        if (ariaLabel) {
          announcement = ariaLabel;
        } else if (textContent) {
          announcement = `${role || tagName}: ${textContent}`;
        } else {
          announcement = `${role || tagName} element`;
        }

        // Crear un elemento temporal para anunciar al lector de pantalla
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = announcement;
        document.body.appendChild(announcer);

        // Remover el anunciador después de un breve retraso
        setTimeout(() => {
          document.body.removeChild(announcer);
        }, 1000);
      }
    };

    // Anunciar cambios de foco
    document.addEventListener('focusin', announceCurrentElement);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', announceCurrentElement);
    };
  }, [enableArrowKeys, enableHomeEnd, enablePageUpDown, onNavigate]);

  // Función para enfocar el primer elemento
  const focusFirst = () => {
    const firstFocusable = document.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="text"], [role="img"], [role="heading"], h1'
    ) as HTMLElement;
    firstFocusable?.focus();
  };

  // Función para enfocar el último elemento
  const focusLast = () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="text"], [role="img"], [role="heading"], h1, h2, h3, h4, h5, h6'
    ) as NodeListOf<HTMLElement>;
    const lastFocusable = focusableElements[focusableElements.length - 1];
    lastFocusable?.focus();
  };

  // Función para obtener estadísticas de navegación
  const getNavigationStats = () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="text"], [role="img"], [role="heading"], h1, h2, h3, h4, h5, h6'
    );
    
    return {
      totalFocusableElements: focusableElements.length,
      currentElementIndex: Array.from(focusableElements).indexOf(document.activeElement as HTMLElement),
      hasActiveElement: document.activeElement !== document.body
    };
  };

  return {
    focusFirst,
    focusLast,
    getNavigationStats
  };
};

export default useKeyboardNavigation;

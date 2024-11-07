import { createContext, type ReactNode, useContext, useState, useRef, useEffect } from 'react';
import onClickOutside from 'react-onclickoutside';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const { type: activeType, close } = useAside();
  const expanded = type === activeType;
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target as Element)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); 

    };
  }, []);

  return (
    <div
      aria-modal
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        expanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      role="dialog"
    >
      <div
        className={`absolute top-0 right-0 overflow-y-auto w-90 h-full bg-white shadow-md p-6 transition-transform duration-300 ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`} // Add transition and transform classes
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-5xl"
          onClick={close}
        >
          &times;
        </button>
        
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

// ... rest of the Aside component


const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

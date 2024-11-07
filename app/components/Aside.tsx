import { createContext, type ReactNode, useContext, useState, useRef, useEffect } from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

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
        className={`absolute top-0 right-0 w-90 h-full bg-white shadow-md p-6 transition-transform duration-300 flex flex-col ${
          expanded ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={overlayRef}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-5xl"
          onClick={close}
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-semibold mb-4">{heading}</h2>
        
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

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

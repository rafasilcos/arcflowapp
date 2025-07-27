import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ✅ TYPES PARA UI STATE
interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Modal states
  modalClienteOpen: boolean;
  modalClienteId: string | null;
  modalClienteMode: 'create' | 'edit' | 'view';
  
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  
  // Filters state
  clientesFilters: {
    search: string;
    tipoPessoa: 'todos' | 'pf' | 'pj';
    page: number;
    limit: number;
  };
  
  // Theme state
  theme: 'light' | 'dark';
  
  // Notification state
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
  }>;
}

// ✅ ACTIONS PARA UI STATE
interface UIActions {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  
  // Modal actions
  openModalCliente: (mode: 'create' | 'edit' | 'view', id?: string) => void;
  closeModalCliente: () => void;
  
  // Loading actions
  setLoading: (loading: boolean, message?: string) => void;
  
  // Filters actions
  setClientesSearch: (search: string) => void;
  setClientesTipoPessoa: (tipo: 'todos' | 'pf' | 'pj') => void;
  setClientesPage: (page: number) => void;
  setClientesLimit: (limit: number) => void;
  resetClientesFilters: () => void;
  
  // Theme actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Notification actions
  addNotification: (notification: Omit<UIState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ✅ INITIAL STATE
const initialState: UIState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  modalClienteOpen: false,
  modalClienteId: null,
  modalClienteMode: 'create',
  
  isLoading: false,
  loadingMessage: '',
  
  clientesFilters: {
    search: '',
    tipoPessoa: 'todos',
    page: 1,
    limit: 50,
  },
  
  theme: 'light',
  
  notifications: [],
};

// ✅ ZUSTAND STORE COM DEVTOOLS
export const useUIStore = create<UIState & UIActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Sidebar actions
      toggleSidebar: () => set(
        (state) => ({ sidebarOpen: !state.sidebarOpen }),
        false,
        'sidebar/toggle'
      ),
      
      setSidebarOpen: (open: boolean) => set(
        { sidebarOpen: open },
        false,
        'sidebar/setOpen'
      ),
      
      toggleSidebarCollapsed: () => set(
        (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
        false,
        'sidebar/toggleCollapsed'
      ),
      
      // Modal actions
      openModalCliente: (mode: 'create' | 'edit' | 'view', id?: string) => set(
        {
          modalClienteOpen: true,
          modalClienteMode: mode,
          modalClienteId: id || null,
        },
        false,
        'modal/openCliente'
      ),
      
      closeModalCliente: () => set(
        {
          modalClienteOpen: false,
          modalClienteId: null,
          modalClienteMode: 'create',
        },
        false,
        'modal/closeCliente'
      ),
      
      // Loading actions
      setLoading: (loading: boolean, message?: string) => set(
        {
          isLoading: loading,
          loadingMessage: message || '',
        },
        false,
        'loading/set'
      ),
      
      // Filters actions
      setClientesSearch: (search: string) => set(
        (state) => ({
          clientesFilters: {
            ...state.clientesFilters,
            search,
            page: 1, // Reset page quando busca
          },
        }),
        false,
        'filters/setSearch'
      ),
      
      setClientesTipoPessoa: (tipoPessoa: 'todos' | 'pf' | 'pj') => set(
        (state) => ({
          clientesFilters: {
            ...state.clientesFilters,
            tipoPessoa,
            page: 1, // Reset page quando filtra
          },
        }),
        false,
        'filters/setTipoPessoa'
      ),
      
      setClientesPage: (page: number) => set(
        (state) => ({
          clientesFilters: {
            ...state.clientesFilters,
            page,
          },
        }),
        false,
        'filters/setPage'
      ),
      
      setClientesLimit: (limit: number) => set(
        (state) => ({
          clientesFilters: {
            ...state.clientesFilters,
            limit,
            page: 1, // Reset page quando muda limit
          },
        }),
        false,
        'filters/setLimit'
      ),
      
      resetClientesFilters: () => set(
        {
          clientesFilters: initialState.clientesFilters,
        },
        false,
        'filters/reset'
      ),
      
      // Theme actions
      toggleTheme: () => set(
        (state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }),
        false,
        'theme/toggle'
      ),
      
      setTheme: (theme: 'light' | 'dark') => set(
        { theme },
        false,
        'theme/set'
      ),
      
      // Notification actions
      addNotification: (notification) => {
        const id = Date.now().toString();
        const timestamp = Date.now();
        
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id, timestamp },
            ],
          }),
          false,
          'notifications/add'
        );
        
        // Auto-remove após 5 segundos
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      },
      
      removeNotification: (id: string) => set(
        (state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }),
        false,
        'notifications/remove'
      ),
      
      clearNotifications: () => set(
        { notifications: [] },
        false,
        'notifications/clear'
      ),
    }),
    {
      name: 'arcflow-ui-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

// ✅ HOOKS ESPECÍFICOS PARA PERFORMANCE
export const useSidebar = () => useUIStore((state) => ({
  sidebarOpen: state.sidebarOpen,
  sidebarCollapsed: state.sidebarCollapsed,
  toggleSidebar: state.toggleSidebar,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebarCollapsed: state.toggleSidebarCollapsed,
}));

export const useModalCliente = () => useUIStore((state) => ({
  modalClienteOpen: state.modalClienteOpen,
  modalClienteId: state.modalClienteId,
  modalClienteMode: state.modalClienteMode,
  openModalCliente: state.openModalCliente,
  closeModalCliente: state.closeModalCliente,
}));

export const useLoading = () => useUIStore((state) => ({
  isLoading: state.isLoading,
  loadingMessage: state.loadingMessage,
  setLoading: state.setLoading,
}));

export const useClientesFilters = () => useUIStore((state) => ({
  filters: state.clientesFilters,
  setSearch: state.setClientesSearch,
  setTipoPessoa: state.setClientesTipoPessoa,
  setPage: state.setClientesPage,
  setLimit: state.setClientesLimit,
  resetFilters: state.resetClientesFilters,
}));

export const useTheme = () => useUIStore((state) => ({
  theme: state.theme,
  toggleTheme: state.toggleTheme,
  setTheme: state.setTheme,
}));

export const useNotifications = () => useUIStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
}));

// ✅ PERFORMANCE HELPERS
export const getUIState = () => useUIStore.getState();
export const subscribeToUIChanges = useUIStore.subscribe; 
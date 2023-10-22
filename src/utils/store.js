import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import promotions from './promotions.json';

const useShopConnectStore = create()(
  devtools(
    (set) => ({
      listenerInitialized: false,
      promotions: window.chrome.runtime === undefined ? promotions : [],
      updateListenerInitialized: (listenerInitialized) => set(() => ({ listenerInitialized })),
      updatePromotions: (promotions) => set(() => ({ promotions })),
    }),
    {
      name: 'shop-connect-storage',
    }
  )
)

export {
  useShopConnectStore
};

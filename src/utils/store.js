import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useShopConnectStore = create()(
  devtools(
    (set) => ({
      listenerInitialized: false,
      promotions: [],
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
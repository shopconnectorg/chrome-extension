import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import promotions from './promotions.json';

const useShopConnectStore = create()(
  devtools(
    (set) => ({
      applyingPromotion: false,
      promotionApplied: null,
      listenerInitialized: false,
      promotions: window.chrome.runtime === undefined ? promotions : [],
      updateApplyingPromotion: (applyingPromotion) => set(() => ({ applyingPromotion })),
      updateListenerInitialized: (listenerInitialized) => set(() => ({ listenerInitialized })),
      updatePromotions: (promotions) => set(() => ({ promotions })),
      updatePromotionApplied: (promotionApplied) => set(() => ({ promotionApplied }))
    }),
    {
      name: 'shop-connect-storage',
    }
  )
)

export {
  useShopConnectStore
};

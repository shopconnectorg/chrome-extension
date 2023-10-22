import { useEffect } from "react";
import { useShopConnectStore } from "./store";
import { approveMethod } from '../services/Approve.service';

export const useShopConnect = () => {
  const updatePromotions = useShopConnectStore((state) => state.updatePromotions);
  const promotions = useShopConnectStore((state) => state.promotions);
  const updateApplyingPromotion = useShopConnectStore((state) => state.updateApplyingPromotion);
  const updatePromotionApplied = useShopConnectStore((state) => state.updatePromotionApplied);

  const applyPromotion = async (promotion) => {
    updateApplyingPromotion(true);
    updatePromotionApplied(promotion.id);
    const msgBytes = new TextEncoder().encode(
      JSON.stringify(promotions.authRequest)
    );
    const authResponse = await approveMethod(msgBytes);
    sendMessage({
      topic: 'applyPromotion',
      data: {
        promotionId: promotion.id,
        authResponse,
      }
    });
  };

  const sendMessage = (payload) => {
    console.log('Send message', payload);
    if (typeof(chrome.runtime) !== 'undefined') {
      chrome.runtime.sendMessage({ action: "appToBackground", payload });
    }
  };

  useEffect(() => {
    // Receive and process messages coming from the web page
    if (typeof(chrome.runtime) !== 'undefined') {
      chrome.runtime.onMessage.addListener(
        (request) => {
          if (request.action === "backgroundToApp") {
            console.log(request.payload);
            const { topic, data } = request.payload;

            if (topic === 'loadPromotions' && promotions.length === 0) {
              updatePromotions(data);
            }

            if (topic === 'confirmPromotion') {
              updateApplyingPromotion(false);
            }
          }
        }
      );
    }

    if (promotions.length === 0) {
      sendMessage({ topic: 'fetchPromotions' });
    }
  }, []);

  return {
    applyPromotion,
    sendMessage,
  };
};

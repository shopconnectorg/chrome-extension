import { useEffect } from "react";
import { useShopConnectStore } from "./store";

export const useShopConnect = () => {
  const updatePromotions = useShopConnectStore((state) => state.updatePromotions);
  const promotions = useShopConnectStore((state) => state.promotions);

  const applyPromotion = (promotionId) => {
    sendMessage({
      topic: 'applyPromotion',
      data: {
        promotionId: promotionId
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

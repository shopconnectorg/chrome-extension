import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";
import { useShopConnectStore } from '../../utils/store';
import { useShopConnect } from "../../utils/hooks";

export default function DealList() {
  const [error, setError] = useState(null);
  const promotions = useShopConnectStore((state) => state.promotions);
  const applyingPromotion = useShopConnectStore((state) => state.applyingPromotion);
  const promotionApplied = useShopConnectStore((state) => state.promotionApplied);
  const sc = useShopConnect();

  const applyPromotion = async (event, promotion) => {
    event.preventDefault();
    event.stopPropagation();
    setError(null);
    try {
      await sc.applyPromotion(promotion);
    } catch (err) {
      setError(err.message);
    }
  }

  const promotionButton = (promotion) => {
    if (promotionApplied === promotion.id) {
      if (applyingPromotion) return (
        <span>Applying...</span>
      );
      return (
        <span>Applied</span>
      );
    }

    return (
      <Button onClick={(event) => applyPromotion(event, promotion)}>Apply</Button>
    );
  }

  return (
    <div>
      {error && <div style={{ padding: "20px", color: "red" }}>{error}</div>}
      {promotions.map((promotion, index) => (
        <div key={promotion.id}>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="w-full flex p-4 justify-between items-center text-left">
                  <div className="flex space-x-3">
                    <img
                      src={promotion.image}
                      alt="deal"
                      className="w-20 h-20 rounded-lg"
                    />
                    <div className="flex flex-col items-start	space-y-1">
                      <Badge variant="outlined">{promotion.discountType === 'percentage' ? `${promotion.discount}%`: `$${promotion.discount}`} OFF</Badge>
                      <span className="font-bold">{promotion.title}</span>
                      <span>Expires in 7 days</span>
                    </div>
                  </div>
                  {promotionButton(promotion)}
                </div>
              </AccordionTrigger>
              <AccordionContent value="item-1">
                <div className="pl-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={true} disabled />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {promotion.requirement}
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {index < promotions.length - 1 && <hr className="my-4" />}
        </div>
      ))}
    </div>
  );
}

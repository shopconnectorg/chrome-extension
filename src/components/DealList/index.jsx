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
import { useShopConnectStore } from "../../utils/store";
import { useShopConnect } from "../../utils/hooks";

export default function DealList({ promotions, applicable }) {
  const [error, setError] = useState(null);
  const { applyingPromotion, promotionApplied } = useShopConnectStore((state) => state);
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
      if (applyingPromotion) return <span>Applying...</span>;
      return <span>Applied</span>;
    }

    return (
      <Button onClick={(event) => applyPromotion(event, promotion)}>
        Apply
      </Button>
    );
  };

  return (
    <>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {promotions.length > 0 ? (
        <div>
          {promotions.map((promotion, index) => (
            <div key={promotion.id}>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="w-full flex p-4 justify-between items-center text-left">
                      <div className="flex space-x-4 items-center">
                        <img
                          src={promotion.image}
                          alt="deal"
                          className="w-20 h-20 rounded-lg"
                        />
                        <div className="flex flex-col items-start	space-y-1 pr-4">
                          <Badge variant="outlined">
                            {promotion.discountType === "percentage"
                              ? `${promotion.discount}%`
                              : `$${promotion.discount}`}{" "}
                            OFF
                          </Badge>
                          <span className="font-bold">{promotion.title}</span>
                          <span className="text-sm">Expires in 7 days</span>
                        </div>
                      </div>
                      {applicable && promotionButton(promotion)}
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
                          {promotion.requirements}
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
      ) : (
        <div className="flex justify-center mt-10 text-slate-400">
          <span>There are no active deals on this site.</span>
        </div>
      )}
    </>
  );
}

import { Badge } from "../ui/badge";
import { Table, TableBody, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Checkbox } from "../ui/checkbox";

export default function DealList({ data }) {
  return (
    <Table>
      <TableBody>
        {data.map((deal, index) => (
          <TableRow key={index}>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="w-full flex p-4 justify-between items-center text-left">
                    <div className="flex space-x-3">
                      <img
                        src={deal.image}
                        alt="deal"
                        className="w-20 h-20 rounded-lg"
                      />
                      <div className="flex flex-col items-start	space-y-1">
                        <Badge variant="outlined">{deal.discount} OFF</Badge>
                        <span className="font-bold">{deal.title}</span>
                        <span>Expires in {deal.expiry}</span>
                      </div>
                    </div>
                    <Button className="mr-3">{deal.action}</Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent value="item-1">
                  <div className="pl-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" checked={deal.action == "Apply"} disabled />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {deal.description}
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

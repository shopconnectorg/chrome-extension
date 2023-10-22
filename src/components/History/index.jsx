import { Badge } from "../ui/badge";
import { Table, TableBody, TableRow } from "../ui/table";
import { Button } from "../ui/button";

export default function PurchaseHistory(props) {
  const { credentials } = props;
  const purchases = credentials.filter(
    (credential) => credential.type.includes("ShopPurchase")
  );

  return (
    <Table>
      <TableBody>
        {purchases.map((purchase, index) => {
          const data = purchase.credentialSubject;
          return (
            <TableRow key={index}>
              <div className="w-full flex p-4 justify-between items-center text-left">
                <div className="flex space-x-3">
                  <img
                    src={data.item.image}
                    alt={data.item.name}
                    className="w-20 h-20 rounded-lg"
                  />
                  <div className="flex flex-col items-start	space-y-1">
                    <span className="text-xs">
                      {purchase.issuanceDate.split("T")[0]}
                    </span>
                    <span className="font-bold">{data.item.name}</span>
                    <span>${data.price}</span>
                    <div className="flex space-x-1">
                      <Badge variant="outlined">{data.item.category}</Badge>
                    </div>
                  </div>
                </div>
                <Button className="mr-3">Visit</Button>
              </div>
              {/* <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <TableCell>
                    <Badge variant="outlined">{purchase.date}</Badge>
                  </TableCell>
                  <TableCell>{purchase.item}</TableCell>
                  <TableCell align="right">{purchase.price}</TableCell>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex mx-5">
                    <span>Categories:</span>
                    {purchase.categories.map((category, index) => (
                      <Badge key={index} variant="outlined" className="ml-2">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion> */}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

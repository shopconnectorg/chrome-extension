import { Badge } from "../ui/badge";
import { Table, TableBody, TableRow } from "../ui/table";
import { Button } from "../ui/button";

export default function PurchaseHistory() {
  const mockData = [
    {
      image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/bfc04b0f-32d9-48a9-b4b7-7acb7fbcb54b/air-max-90-shoes-bnz7pN.png",
      date: "2023-10-17",
      site: "nike.com",
      item: "Nike Air Max 90",
      price: "$100",
      categories: ["Clothing", "Shoes"],
    },
    {
      image: "https://images-eu.ssl-images-amazon.com/images/I/71PMC4DWWFL._AC_UL232_SR232,232_.jpg",
      date: "2023-10-16",
      site: "amazon.com",
      item: "Playstation 5",
      price: "$499",
      categories: ["Electronics", "Gaming"],
    },
  ];

  return (
    <Table>
      <TableBody>
        {mockData.map((purchase, index) => (
          <TableRow key={index}>
            <div className="w-full flex p-4 justify-between items-center text-left">
              <div className="flex space-x-3">
                <img
                  src={purchase.image}
                  alt={purchase.item}
                  className="w-20 h-20 rounded-lg"
                />
                <div className="flex flex-col items-start	space-y-1">
                  <span className="text-xs">{purchase.date}</span>
                  <span className="font-bold">{purchase.item}</span>
                  <span>{purchase.price}</span>
                  <div className="flex space-x-1">
                    {purchase.categories.map((category, index) => (
                      <Badge variant="outlined">{category}</Badge>
                    ))}
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
        ))}
      </TableBody>
    </Table>
  );
}

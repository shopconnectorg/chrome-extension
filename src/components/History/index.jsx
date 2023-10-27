import { Badge } from "../ui/badge";
import { Table, TableBody, TableRow } from "../ui/table";
import { getCategoryName } from '../../utils';

export default function PurchaseHistory(props) {
  const { credentials } = props;
  const purchases = credentials.filter((credential) =>
    credential.type.includes("ShopPurchase")
  );

  console.log(credentials);

  return (
    <div>
      {purchases.length > 0 ? (
        <Table>
          <TableBody>
            {purchases.map((purchase, index) => {
              const data = purchase.credentialSubject;
              return (
                <TableRow key={index}>
                  <div className="w-full flex p-4 justify-between items-center text-left">
                    <div className="flex space-x-3">
                      <div className="w-20 h-20 rounded-lg">
                        <img
                          src={data.item.image}
                          alt={data.item.name}
                          className="object-contain w-20 h-20"
                        />
                      </div>
                      <div className="flex flex-col items-start	space-y-1">
                        <span className="text-xs">
                          {purchase.issuanceDate.split("T")[0]}
                        </span>
                        <span className="font-bold">{data.item.name}</span>
                        <span>${data.price / 100}</span>
                        <div className="flex space-x-1">
                          <Badge variant="outlined">{getCategoryName(data.item.category)}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex justify-center mt-10 text-slate-400">
          <span>Your purchase history is empty.</span>
        </div>
      )}
    </div>
  );
}

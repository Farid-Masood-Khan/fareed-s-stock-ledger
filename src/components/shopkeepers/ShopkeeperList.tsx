
import React from "react";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";
import { Shopkeeper } from "@/types";
import { Search } from "lucide-react";

interface ShopkeeperListProps {
  shopkeepers: Shopkeeper[];
  selectedShopkeeper: Shopkeeper | null;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectShopkeeper: (shopkeeper: Shopkeeper) => void;
}

const ShopkeeperList = ({
  shopkeepers,
  selectedShopkeeper,
  searchTerm,
  onSearchChange,
  onSelectShopkeeper,
}: ShopkeeperListProps) => {
  const filteredShopkeepers = shopkeepers.filter(
    (shopkeeper) =>
      shopkeeper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shopkeeper.contact || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shopkeeper.address || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="lg:col-span-1 h-fit">
      <CardHeader>
        <CardTitle>Shopkeeper List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search shopkeepers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="space-y-2">
          {filteredShopkeepers.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No shopkeepers found</p>
          ) : (
            filteredShopkeepers.map((shopkeeper) => (
              <div
                key={shopkeeper.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedShopkeeper?.id === shopkeeper.id
                    ? "bg-brand-100 border-brand-300"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => onSelectShopkeeper(shopkeeper)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">{shopkeeper.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {shopkeeper.contact}
                      </div>
                    </div>
                  </div>
                  <div>
                    {shopkeeper.balance < 0 ? (
                      <Badge variant="destructive" className="whitespace-nowrap">
                        {formatCurrency(Math.abs(shopkeeper.balance))} Due
                      </Badge>
                    ) : shopkeeper.balance > 0 ? (
                      <Badge variant="outline" className="whitespace-nowrap">
                        {formatCurrency(shopkeeper.balance)} Owed
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="whitespace-nowrap">
                        No Balance
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopkeeperList;

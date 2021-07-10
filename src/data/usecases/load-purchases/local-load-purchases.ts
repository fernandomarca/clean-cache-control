import { ICacheStore } from "@/data/protocols/cache";
import { SavePurchases } from "@/domain/usecases";

class LocalLoadPurchases implements SavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.delete("purchases");
    this.cacheStore.insert("purchases", purchases);
  }
}

export { LocalLoadPurchases };

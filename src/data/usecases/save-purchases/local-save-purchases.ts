import { ICacheStore } from "@/data/protocols/cache";

class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}
  async save(): Promise<void> {
    this.cacheStore.delete("purchases");
  }
}

export { LocalSavePurchases };

import { LocalLoadPurchases } from "@/data/usecases";
import { mockPurchases, CacheStoreSpy } from "@/data/tests";

type SutTypes = {
  sut: LocalLoadPurchases;
  cacheStore: CacheStoreSpy;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore,timestamp);
  return {
    sut,
    cacheStore,
  };
};

describe("LocalLoadPurchases", () => {
  test("Should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });

  test("Should call delete with correct key", async () => {
    const { sut, cacheStore } = makeSut();
    await sut.save(mockPurchases());
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  test("Should not insert new cache if delete fails",async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
    await expect(promise).rejects.toThrow();
  });

  test("Should insert new Cache if delete succeeds", async () => {
    const timestamp = new Date();
    const { sut, cacheStore } = makeSut(timestamp);
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value:purchases
    });
  });

  test("Should throw if insert thorws", async () => {
    const { sut, cacheStore } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
   await expect(promise).rejects.toThrow();
  });
});

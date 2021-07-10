import {PurchasesModel} from '@/domain/models'

export interface LoadPurchases {
  loadAll: () => Promise<Array<SavePurchases.Result>>;
}

export namespace SavePurchases {
  export type Result = PurchasesModel
}

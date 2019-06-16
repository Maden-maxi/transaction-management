export interface Transaction {
    _id?: string;
    id?: number;
    cardHolderHash?: string;
    datetime?: string | Date;
    amount?: number;
}

export interface PayloadItem {
  title: string;
  sourceUrl: string;
  summary: string;
  content: string;
}

export interface Payload {
  [key: string]: PayloadItem;
}

export interface ProcessedItem extends Omit<PayloadItem, "content"> {
  content: string;
}

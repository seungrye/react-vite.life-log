
export interface IArchiveItemProps {
  date: string,
  title: string,
  description: string,
  imageUrls?: string[]
}


export interface IArchiveItem {
  id: string,
  author: string;
  category: string;
  title: string;
  description: string;
  createdAt: string;
  imageUrls?: string[];
}




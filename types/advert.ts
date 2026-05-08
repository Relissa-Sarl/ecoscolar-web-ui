import { AdvertType } from '../app/utils/enum/advertType';
import { AdvertStatus } from '../app/utils/enum/advertStatus';

export interface Advert {
    id: number;
    type: AdvertType;
    title: string;
    price: number;
    publicationDate: Date;
    notificationDate: Date;
    status: AdvertStatus;
    userId: number;
    sellerPseudo: string;
    primaryImage: string;
}
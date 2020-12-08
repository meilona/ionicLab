import {SafeResourceUrl} from '@angular/platform-browser';

export class Contact {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    latitude: string;
    longitude: string;
    imageUrl: SafeResourceUrl;
    constructor(
        id: string,
        name: string,
        phoneNumber: string,
        email: string,
        latitude: string,
        longitude: string,
        imageUrl: string
) {}
}
// export interface Contact {
//     id: string;
//     name: string;
//     phoneNumber: string[];
//     email: string[];
// }


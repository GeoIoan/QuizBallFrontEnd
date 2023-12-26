/**
 * Objects that implement this interface 
 * transfer data concerning the Category 
 * entity
 */

export interface Categories {
    [key: number]: {
        [key: number]: boolean;
      };
}

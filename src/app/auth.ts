/**
 * Objects that implement this interface 
 * transfer data concerning the authentication 
 * and authorization process.
 */

export interface Auth {
    id : number,
    gamemasterName: string,
    gamemasterEmail: string
    securityToken: string
}

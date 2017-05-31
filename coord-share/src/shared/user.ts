import shortid = require('shortid');



/**
 * Id type alias
 */
export type Id = string;

/**
 * Users represented as Ids
 */
export interface User {
    readonly id: Id
}

/**
 * User static helpers
 */
export class User {
    /**
     * Create a new user
     */
    static Create(): User {
        return {
            id: shortid.generate()
        };
    }
}

/**
 * ShareLink represented as a url
 */
export interface ShareLink {
    url: string
}

/**
 * ShareLink static helpers
 */
export class ShareLink {
    /**
     * Create a share link for the user
     * @param path Path for url
     * @param user User to share location for
     */
    static Create(path: string, user: User): ShareLink {
        return {
            url: `${path}${user.id}`
        };
    }
}

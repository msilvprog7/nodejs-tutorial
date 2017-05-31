import $ = require("jquery");

import {User} from "../../../shared/user";



/**
 * Static helper Copy class
 */
export class Copy {
    /**
     * Copy the selector's content to clipboard
     * @param selector JQuery selector
     */
    static ToClipboard(selector: string, callback?: () => void): void {
        $(selector).show();

        $(selector).select();
        document.execCommand("copy");

        $(selector).hide();

        if (callback) {
            callback();
        }
    }
}

/**
 * Static helper Show class
 */
export class Show {
    /**
     * Show selector for a specified number of seconds
     * @param selector JQuery selector
     * @param seconds Seconds to show
     */
    static ForSeconds(selector: string, seconds: number): void {
        $(selector).show();
        setTimeout(() => $(selector).hide(), 1000 * seconds);
    }
}

/**
 * Static helper Page class
 */
export class Page {
    /**
     * Get the user, stored on the page
     * in the selector's value
     */
     static GetUser(selector): User {
        return {
            id: $(selector).val()
        };
     }
}

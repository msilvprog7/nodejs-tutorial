import $ = require('jquery');



/**
 * Request class
 */
export class Request {
    /**
     * Request method
     */
    private method: string;

    /**
     * The url to request
     */
    private url: string;

    /**
     * Construct a request
     */
    constructor(method: string, url: string) {
        this.method = method;
        this.url = url;
    }

    /**
     * Send the request
     */
    send(json?: any, callback?: (status: number, data: any) => void) {
        $.ajax({
            method: this.method,
            url: this.url,
            data: (json) ? json : undefined,
            dataType: (json) ? 'json' : undefined,
            success: (data: any, textStatus: string, jqXhr: JQueryXHR) => {
                if (callback) {
                    callback(jqXhr.status, data);
                }
            },
            error: (jqXhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                console.error(`${jqXhr.status}: ${textStatus}`);

                if (callback) {
                    callback(jqXhr.status, textStatus);
                }
            }
        })
    }
}

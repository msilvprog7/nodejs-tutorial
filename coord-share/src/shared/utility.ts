/**
 * Utility static helpers
 */
export class Utility {
    /**
     * Log a message with time info
     * to the console
     * @param msg Message to log
     */
    static Log(msg: string): void {
        console.log(`${new Date().toLocaleString()}\t${msg}`);
    }
}

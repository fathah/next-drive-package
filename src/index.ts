import startServer from "./server";

export default class NextDriveServer{

    public PORT:number;
    public API_KEY:string;
    public FOLDER?:string = '';
    

/**
 * Constructs a new instance of the NextDriveServer class.
 * @param {Object} config - An object containing the configs for the server.
 * @param {number} config.port - The port number for the server.
 * @param {string} config.apiKey - The API key for the server.
 * @param {string} [config.folder] - The folder name for the server (optional).
 */
    constructor(config:{
        port: number;
        apiKey: string;
        folder?:string;
    }){
        this.PORT = config.port;
        this.API_KEY = config.apiKey;
        if(config.folder) this.FOLDER = config.folder
    }
    public async start(){
        startServer(this.FOLDER!, this.API_KEY, this.PORT);
    }
}
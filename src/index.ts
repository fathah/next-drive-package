import startServer from "./server";

export default class NextDriveServer{

    public port:number;
    public apiKey:string;
    public folder?:string = '';
    public options?:{cors?:boolean} = {}
    

/**
 * Constructs a new instance of the NextDriveServer class.
 * @param {Object} config - An object containing the configs for the server.
 * @param {number} config.port - The port number for the server.
 * @param {string} config.apiKey - The API key for the server.
 * @param {string} [config.folder] - The folder name for the server (optional).
 * @returns {void}
 */
    constructor(config:{
        port: number;
        apiKey: string;
        folder?:string;
        options?:{cors?:boolean}
    }){
        this.port = config.port;
        this.apiKey = config.apiKey;
        if(config.folder) this.folder = config.folder
        if(config.options) this.options = config.options
    }
    public async start(){
        startServer(this.folder!, this.apiKey, this.port, this.options?.cors??false);
    }
}
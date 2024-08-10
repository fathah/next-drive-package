
export default class NextDriveUploader {

    private api: string;
    private root: string;

    constructor({ rootUrl,
        apiKey
    }:
        {
            rootUrl: string,
            apiKey: string,
        }
    ) {

        this.api = apiKey;
        this.root = rootUrl;

    }

    async upload(p:{
        folder: string, files:  File[]
    }) {
        {
            const finalUrl = this.root.endsWith("/")?this.root:`${this.root}/`
            const URL = `${finalUrl}upload/${p.folder}`;

            try {
                const formData = new FormData();

                for(const file of p.files){
                    formData.append('files', file);
                }

                const resp = await fetch(URL, {
                    method: "POST",
                    body: formData,
                    headers:{
                        'x-api-key': this.api
                    }
                });
                const data = await resp.json();
                return data;
            } catch (error) {
                console.error("Upload Error:",error);
                return { success: false, message: "Failed to upload" }

            }


        }
    }
}
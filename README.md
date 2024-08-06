<img src="https://github.com/user-attachments/assets/cf92e206-0cee-4f38-abfd-959c27ac3232"
height="100px"
/>

A lightweight Node.js based file server for modern apps


## Install
```
npm install nextdrive
```

## Usage
```ts
import NextDriveServer from 'nextdrive';

const server = new NextDriveServer({
    port:3000,
    apiKey: process.ev.API_KEY,
});

```
### Optional Parameters

`folder`:  default to '*{working dir}/uploads*'

`options.cors`: Allow CORS




## API Endpoints

### `/upload/{foldername}`
To upload files to the drive.
Just send as Formdata. Rest will be handled and returns the file name to store in your db.
```ts
const formData = new FormData();
formData.append('files', file);


fetch('http://localhost:3000/upload/{foldername}', 
{
    method: 'POST',
    body : formData,
    {
        headers : {
            'X-API-KEY' : 'API_KEY_ADDED_IN_CONFIGS'
        }
    }
});

// OUTPUTS: File name & details
```


File access: 
```
http://{root_url}/uploads/{foldername}/{filename}
```


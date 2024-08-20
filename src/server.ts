// server/server.js
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { IncomingForm, File } from 'formidable';
import cors, { CorsOptions } from 'cors';



export default function startServer(foldername:string, apikey:string, port:number,allowCors: boolean, allowFor?:string[]) {
    const app = express();

    
    if (allowCors) {
      let corsOptions:CorsOptions  = {
        origin: true,
        optionsSuccessStatus: 200
      };

      if(allowFor && allowFor.length>0){
         corsOptions = {
          origin: function (origin:any, callback:any) {
            if (!origin || allowFor.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('Not allowed by CORS'));
            }
          },
          optionsSuccessStatus: 200
        };
      }
  
        app.use(cors(corsOptions));
      }
  
    const rootPath = path.join(process.cwd(), foldername, 'uploads');
  
    if (!fs.existsSync(rootPath)) {
      fs.mkdirSync(rootPath, { recursive: true });
    }
  
    app.use('/uploads', express.static(rootPath));
  
    // Custom file upload handling
    app.post('/upload/:folder', (req: Request, res: Response) => {
      const folder = req.params.folder;
      const api = req.headers['x-api-key'] as string;
  
      if (api !== apikey) {
        return res.status(400).json({ success: false, error: 'Unauthorized Access' });
      }
      if (!folder) {
        return res.status(400).json({ success: false, error: 'Please provide a folder name' });
      }
  
      const uploadPath = path.join(rootPath, folder);
  
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
  
      try {
        const form = new IncomingForm({
            uploadDir: uploadPath,
            keepExtensions: true,
        });
       
  
        form.parse(req, (err, fields, files) => {
          if (err) {
            res.status(500).json({ success: false, error: err });
            return;
          }
  
          const fileArray = files.files as File | File[];
  
          if (!fileArray) {
            return res.status(400).json({ success: false, error: 'Please provide a file' });
          }
  
          const newFiles = Array.isArray(fileArray) ? fileArray : [fileArray];
          const updatedFiles = newFiles.map(file => {
            const newFilePath = path.join(uploadPath, file.newFilename);
            fs.renameSync(file.filepath, newFilePath);
            return {
              ...file,
              filepath: newFilePath,
              originalFilename: file.originalFilename,
              newFilename: file.newFilename,
            };
          });
  
          const finalFiles = updatedFiles.map(file => ({
            name: file.newFilename,
            ogName: file.originalFilename,
            mimetype: file.mimetype,
            size: file.size,
          }));
  
          return res.status(200).json({ success: true, files: finalFiles });
        });
      } catch (error) {
        return res.status(500).json({ success: false, error });
      }
    });

    app.delete('/:folder', (req: Request, res: Response) => {
      const folder = req.params.folder;

      const api = req.headers['x-api-key'] as string;
  
      if (api !== apikey) {
        return res.status(400).json({ success: false, error: 'Unauthorized Access' });
      }
      if (!folder) {
        return res.status(400).json({ success: false, error: 'Please provide a folder name' });
      }
  
      const uploadPath = path.join(rootPath, folder);
  
      if (!fs.existsSync(uploadPath)) {
        return res.status(404).json({ success: false, error: 'Folder not found' });
      }

      const filesnames = req.body.files;

      if (!filesnames || filesnames.length === 0) {
        return res.status(400).json({ success: false, error: 'Please provide file names' });
      }
  
      if (!Array.isArray(filesnames)) {
        return res.status(400).json({ success: false, error: 'File names must be an array' });
      }
  
      if (filesnames.length === 0) {
        return res.status(400).json({ success: false, error: 'Please provide at least one file name' });
      }
   try {
    let failed:string[] = [];

    for (const filename of filesnames) {
      const filePath = path.join(uploadPath, filename);

      if (!fs.existsSync(filePath)) {
        failed.push(filename);
        continue;
      }else{
        fs.unlinkSync(filePath);
      }
    }

    return res.status(200).json({ success: true, deleted: filesnames, failed });

   } catch (error) {
    return res.status(500).json({ success: false, error:`${error}` });
   }
  
     
    });
  
  
    app.listen(port, () => {
        console.log("\x1b[32m ⚡ Starting Next Drive \x1b[0m");
        console.log(' ');
        console.log(`\x1b[42m 📦 Next Drive Running on PORT: ${port} \x1b[0m`);
    });
  };







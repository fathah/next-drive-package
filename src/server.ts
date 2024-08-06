// server/server.js
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { IncomingForm, File } from 'formidable';
import cors from 'cors';



export default function startServer(foldername:string, apikey:string, port:number,allowCors: boolean) {
    const app = express();

    
    if (allowCors) {
        app.use(cors());
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
            const ext = path.extname(file.originalFilename as string);
            const newFilePath = path.join(uploadPath, `${file.newFilename}${ext}`);
            fs.renameSync(file.filepath, newFilePath);
            return {
              ...file,
              filepath: newFilePath,
              originalFilename: file.originalFilename,
              newFilename: `${file.newFilename}${ext}`,
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
  
    app.listen(port, () => {
        console.log(`\x1b[43m 📦 Next Drive Running on PORT: ${port} \x1b[0m`)
    });
  };
  













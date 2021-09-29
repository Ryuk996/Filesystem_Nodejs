const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()


const PORT = process.env.PORT || 3006;
//middleware => connects the server and client side and also parses the req.body input from client to server
 app.use(express.json())

const path = require('path');
const fs = require('fs');

app.use(cors({ 
    origin: "*"
}))


app.post("/create-file", async (req, res) => {
    try { 
            const { fileName } = req.body;
            if (!fileName) 
            return res.status(400).json({ msg: "Please enter file name" })
            // create file on your directory with path name and folder name where file needs to be created
              let data = fs.writeFileSync(path.join(__dirname,"Drive/New folder",fileName), "This is an example text","UTF8")

            res.json({ msg: "Register Success! Please activate your email to start." })
        
    } catch (error) {
        res.status(500).json({ msg: "internal server error" })
    }

})

app.get(('/getfiles/:user'),async(req,res)=>{
    // const FILE = req.params.user; 
    try {
        const FILE = req.params.user;
        const user_directory = path.join(__dirname,"Drive",FILE)
        // const user_directory = path.join(__dirname,"Drive","New folder")
        let files=[];
        const dirents =  fs.readdir(user_directory,{withFileTypes:true},(err,dirents)=>{
            for (const dirent of dirents){
                files.push({
                    name: dirent.name,
                    type: dirent.isDirectory() ? "folder" : "file",
                    ext: path.extname(dirent.name).slice(1) 
                })
                if (dirent.isDirectory()){
                    files = files.concat(path.join(user_directory, dirent.name))
                    
                }
             }res.json(files)  
        })
    } catch (error) {
        res.status(500).json({
            message : "something went wrong"
        })
    }
})
app.delete("/delete-file/:user",async(req,res)=>{
    try {
        const FILE = req.params.user;
        const user_directory = path.join(__dirname,"Drive",FILE)
        let  deletefile = fs.rmdirSync(user_directory)
        
    } catch (error) {
        
    }
})

app.listen(PORT,function(){
    console.log(`The app is listening in port ${PORT}`)
})
import { PrismaClient } from "@prisma/client";
import path from 'path'
import fs from 'fs'

const prisma = new PrismaClient();
const safeDelete = (path) => {
    console.log(`Attempting to delete: ${path}`); 
    try {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
            console.log(`Deleted: ${path}`);
        } else {
            console.log(`${path} not found, but continuing.`);
        }
    } catch (error) {
        throw new Error(`Failed to delete ${path}: ${error.message}`);
    }
  };

export const getDealer = async (req,res) => {
    try {
        const response = await prisma.dealer.findMany()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg:error.message})
        
    }
}

export const getDealerByid = async (req,res) => {
    try {
        const response = await prisma.dealer.findUnique({
            where:{
                id: Number(req.params.id)
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg:error.message})
        
    }
}
export const createDealer = async (req,res) => {
    const {name,address,urlFacebook,whatsapp,urlMaps,urlInstagram} = req.body
    const imgDealer = req.file

    if (!imgDealer){
        return res.status(400).json({ msg: "Image file is required." });
    }

    const imgSize = imgDealer.size;
    const imgExt = path.extname(imgDealer.originalname);
    const imgName = imgDealer.filename;
    const imgUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/dealer/${imgName}`;
    const allowedImgTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedImgTypes.includes(imgExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image type." });
    }
    if (imgSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB." });
    }


   try {
    const newDealer = await prisma.dealer.create({
        data: {
            name,
            address,
            urlFacebook,
            whatsapp,
            urlMaps,
            urlInstagram,
            imgDealer: imgName,
            urlImageDealer: imgUrl,
        }
    })
    
        res.status(200).json({ msg: "Data dealer created successfully", data: newDealer });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to create dealer.", error: error.message });
    }
    }


    export const updateDealer = async (req, res) => {
        const { id } = req.params;
        const { name, address, urlFacebook, whatsapp, urlMaps, urlInstagram } = req.body;
        const imgDealer = req.file;
    
        try {
            const existingDealer = await prisma.dealer.findUnique({
                where: {
                    id: Number(id)
                }
            });
    
            if (!existingDealer) {
                return res.status(404).json({ msg: "Dealer not found" });
            }
    
            const imgUpdateData = {};
            if (imgDealer) {
                const imgSize = imgDealer.size;
                const imgExt = path.extname(imgDealer.originalname);
                const imgName = imgDealer.filename;
                const imgUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/dealer/${imgName}`;
                const allowedImgTypes = ['.png', '.jpg', '.jpeg'];
    
                if (!allowedImgTypes.includes(imgExt.toLowerCase())) {
                    return res.status(422).json({ msg: "Invalid image type." });
                }
                if (imgSize > 5000000) {
                    return res.status(422).json({ msg: "Image must be less than 5 MB." });
                }
    
                imgUpdateData.imgDealer = imgName;
                imgUpdateData.urlImageDealer = imgUrl;
                safeDelete(`./public/dealer/${existingDealer.imgDealer}`);
            }
    
            const updatedDealer = await prisma.dealer.update({
                where: {
                    id: Number(id),
                },
                data: {
                    name,
                    address,
                    urlFacebook,
                    whatsapp,
                    urlMaps,
                    urlInstagram,
                    ...imgUpdateData
                }
            });
    
            res.status(200).json({ msg: "Dealer updated successfully", data: updatedDealer });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: "Failed to update dealer.", error: error.message });
        }
    }
    
export const deleteDealer = async (req,res) => {
    try {
        const dealers = await prisma.dealer.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!dealers) {
            return res.status(404).json({ msg: "Data not found" });
        }

        console.log(`Working Directory: ${process.cwd()}`); 
        const dealerImage = `./public/dealer/${dealers.imgDealer}`;

        safeDelete(dealerImage);

        await prisma.dealer.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(200).json({ msg: "dealer data deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to delete dealer data. " + error.message });
    }
}
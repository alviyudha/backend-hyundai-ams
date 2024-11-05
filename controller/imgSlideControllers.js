import { PrismaClient } from "@prisma/client";
import path from 'path'
import fs from 'fs'


const prisma = new PrismaClient()

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


export const getImgSlide = async (req,res) =>{
    try {
        const response = await prisma.imgSlide.findMany()
        res.status(200).json(response)
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
export const getImgSlideById = async (req,res) =>{
    try {
        const response = await prisma.imgSlide.findUnique({
            where:{
                id :Number( req.params.id )
            }
        })

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
export const createImgSlide = async (req, res) => {
    const imgSlide = req.file;

    if (!imgSlide) {
        return res.status(400).json({ msg: "Image file is required." });
    }

    const imgSize = imgSlide.size;
    const imgExt = path.extname(imgSlide.originalname);
    const imgName = imgSlide.filename;
    const imgUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/image-slide/${imgName}`;
    const allowedImgTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedImgTypes.includes(imgExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image type." });
    }
    if (imgSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB." });
    }

    try {
        const newImgSlide = await prisma.imgSlide.create({
            data: {
                image: imgName,
                urlImage: imgUrl  
            }
        });

        res.status(201).json({ msg: "Image Slide created successfully", data: newImgSlide });
    } catch (error) {
        console.error("Error creating image slide: ", error);
        safeDelete(`./public/image-slide/${imgSlide?.filename}`);
        res.status(500).json({ msg: "Failed to create image slide." + error.message});
    }
};

export const updateImgSlide = async (req, res) => {
    const { id } = req.params;
    const newImage = req.file;  

    try {
        const currentData = await prisma.imgSlide.findUnique({
            where: { id: parseInt(id) }
        });

        if (!currentData) {
            return res.status(404).json({ msg: "Gambar tidak ditemukan" });
        }

        const updatedData = {};  

        if (newImage) {
            const imgSize = newImage.size;
            const imgExt = path.extname(newImage.originalname);
            const allowedImgTypes = ['.png', '.jpg', '.jpeg'];

            if (!allowedImgTypes.includes(imgExt.toLowerCase()) || imgSize > 5000000) {
                return res.status(422).json({ msg: "Tipe atau ukuran gambar tidak valid. Gambar harus kurang dari 5 MB dan berjenis PNG, JPG, atau JPEG." });
            }

            updatedData.image = newImage.filename;  // Menyimpan nama file baru
            updatedData.urlImage = `${req.protocol}://${req.get(
        "host"
      )}/api/image-slide/${newImage.filename}`;  // Menyimpan URL baru

            safeDelete(`./public/image-slide/${currentData.image}`);  // Menghapus gambar lama
        }

        const updateImage = await prisma.imgSlide.update({
            where: { id: parseInt(id) },
            data: updatedData
        });

        res.status(200).json({ msg: "Gambar berhasil diperbarui", data: updateImage });
    } catch (error) {
        console.error("Kesalahan saat memperbarui gambar: ", error);
        res.status(500).json({ msg: "Gagal memperbarui gambar.", error: error.message });
    }
};


export const deleteImgSlide = async (req,res) =>{
    try {
        const imageSlide = await prisma.imgSlide.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!imageSlide) {
            return res.status(404).json({ msg: "Data not found" });
        }

        console.log(`Working Directory: ${process.cwd()}`); 
        const imageSlides = `./public/image-slide/${imageSlide.image}`;

        safeDelete(imageSlides);

        await prisma.imgSlide.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(200).json({ msg: "Image Slide deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to delete Image Slide. " + error.message });
    }
}
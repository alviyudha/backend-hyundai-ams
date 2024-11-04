import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from 'path';

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

export const getTrims = async (req, res) => {
    try {
        const response = await prisma.trim.findMany();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTrimsByID = async (req, res) => {
    try {
        const response = await prisma.trim.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deletetTrims = async (req, res) => {
    try {
        const vehicle = await prisma.trim.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!vehicle) {
            return res.status(404).json({ msg: "Data not found" });
        }

        console.log(`Working Directory: ${process.cwd()}`); 

        const warrantyPath = `./public/warranty/${vehicle.warrantyImg}`;
        const imagePath = `./public/images/${vehicle.backgroundImg}`;
        const pdfPath = `./public/pdf/${vehicle.brochure}`;

        safeDelete(warrantyPath);
        safeDelete(imagePath);
        safeDelete(pdfPath);

        await prisma.trim.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(200).json({ msg: "Trims deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to delete Trims data. " + error.message });
    }
};

export const createTrims = async (req, res) => {
    const { trim, trimDetail, vehicleId, otr, otrPrice } = req.body;
    const backgroundImg = req.files.backgroundImg ? req.files.backgroundImg[0] : null;
    const brochure = req.files.brochure ? req.files.brochure[0] : null;
    const warranty = req.files.warrantyImg ? req.files.warrantyImg[0] : null;

    if (!backgroundImg || !brochure || !warranty) {
        return res.status(400).json({ msg: "Background image, warranty image, and brochure are required." });
    }

    const imgSize = backgroundImg.size;
    const imgExt = path.extname(backgroundImg.originalname);
    const imgName = backgroundImg.filename;
    const imgUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/images/${imgName}`;
    const allowedImgTypes = ['.png', '.jpg', '.jpeg'];

    if (!allowedImgTypes.includes(imgExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid image type." });
    }
    if (imgSize > 5000000) {
        return res.status(422).json({ msg: "Image must be less than 5 MB." });
    }

    const pdfSize = brochure.size;
    const pdfExt = path.extname(brochure.originalname);
    const pdfName = brochure.filename;
    const pdfUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/pdf/${pdfName}`;
    const allowedPdfTypes = ['.pdf'];
    if (!allowedPdfTypes.includes(pdfExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid PDF type." });
    }
    if (pdfSize > 80000000) {
        return res.status(422).json({ msg: "PDF must be less than 80 MB." });
    }

    const warrantySize = warranty.size;
    const warrantyExt = path.extname(warranty.originalname);
    const warrantyName = warranty.filename;
    const warrantyUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/warranty/${warrantyName}`;

    if (!allowedImgTypes.includes(warrantyExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid warranty type." });
    }
    if (warrantySize > 5000000) {
        return res.status(422).json({ msg: "Warranty must be less than 5 MB." });
    }

    try {
        const newTrim = await prisma.trim.create({
            data: {
                trim,
                trimDetail,
                otr,
                otrPrice: parseInt(otrPrice, 10),
                warrantyImg: warrantyName,
                urlWarrantyImg: warrantyUrl,
                backgroundImg: imgName,
                urlBackgroundImg: imgUrl,
                brochure: pdfName,
                urlBrochure: pdfUrl,
                vehicle: {
                    connect: { id: vehicleId }
                }
            }
        });

        res.status(201).json({ msg: "Trims created successfully", data: newTrim });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to create Trims." });
    }
};

export const updateTrims = async (req, res) => {
    const { trim, trimDetail, otr, otrPrice } = req.body;
    const updatedData = {
        trim,
        trimDetail,
        otr,
        otrPrice: parseInt(otrPrice, 10),
    };

    const newBackgroundImg = req.files.backgroundImg ? req.files.backgroundImg[0] : null;
    const newBrochure = req.files.brochure ? req.files.brochure[0] : null;
    const newWarrantyImg = req.files.warrantyImg ? req.files.warrantyImg[0] : null;

    try {
        const currentData = await prisma.trim.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!currentData) {
            return res.status(404).json({ msg: "Trim not found" });
        }

        if (newBackgroundImg) {
            updatedData.backgroundImg = newBackgroundImg.filename;
            updatedData.urlBackgroundImg = `${req.protocol}://${req.get(
        "host"
      )}/api/images/${newBackgroundImg.filename}`;
            safeDelete(`./public/images/${currentData.backgroundImg}`);
        }

        if (newBrochure) {
            updatedData.brochure = newBrochure.filename;
            updatedData.urlBrochure = `${req.protocol}://${req.get(
        "host"
      )}/api/pdf/${newBrochure.filename}`;
            safeDelete(`./public/pdf/${currentData.brochure}`);
        }

        if (newWarrantyImg) {
            updatedData.warrantyImg = newWarrantyImg.filename;
            updatedData.urlWarrantyImg = `${req.protocol}://${req.get(
        "host"
      )}/api/warranty/${newWarrantyImg.filename}`;
            safeDelete(`./public/warranty/${currentData.warrantyImg}`);
        }

        const updatedVehicle = await prisma.trim.update({
            where: {
                id: Number(req.params.id),
            },
            data: updatedData,
        });

        res.status(200).json({ msg: "Trim updated successfully", data: updatedVehicle });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to update trim." });
    }
};

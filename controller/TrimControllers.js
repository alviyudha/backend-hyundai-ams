import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

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
        id: Number(req.params.id),
      },
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
        id: Number(req.params.id),
      },
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
        id: Number(req.params.id),
      },
    });

    res.status(200).json({ msg: "Trims deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ msg: "Failed to delete Trims data. " + error.message });
  }
};

export const createTrims = async (req, res) => {
  const { trim, trimDetail, vehicleId, otr, otrPrice } = req.body;
  const backgroundImg = req.files?.backgroundImg?.[0] || null;
  const brochure = req.files?.brochure?.[0] || null;
  const warranty = req.files?.warrantyImg?.[0] || null;

  if (!backgroundImg || !brochure || !warranty) {
    return res.status(400).json({
      msg: "Background image, warranty image, and brochure are required.",
    });
  }

  const allowedImgTypes = [".png", ".jpg", ".jpeg"];
  const allowedPdfTypes = [".pdf"];

  const imgExt = path.extname(backgroundImg.originalname).toLowerCase();
  const imgSize = backgroundImg.size;
  if (!allowedImgTypes.includes(imgExt) || imgSize > 5000000) {
    return res.status(422).json({ msg: "Invalid image type or image size exceeds 5 MB." });
  }

  const pdfExt = path.extname(brochure.originalname).toLowerCase();
  const pdfSize = brochure.size;
  if (!allowedPdfTypes.includes(pdfExt) || pdfSize > 80000000) {
    return res.status(422).json({ msg: "Invalid PDF type or PDF size exceeds 80 MB." });
  }

  const warrantyExt = path.extname(warranty.originalname).toLowerCase();
  const warrantySize = warranty.size;
  if (!allowedImgTypes.includes(warrantyExt) || warrantySize > 5000000) {
    return res.status(422).json({ msg: "Invalid warranty image type or image size exceeds 5 MB." });
  }

  try {
    // Ambil model dari Vehicle terkait
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { model: true }
    });

    if (!vehicle) {
      return res.status(404).json({ msg: "Vehicle not found" });
    }

    // Gabungkan model dengan trim untuk membentuk LinkPage
    const LinkPage = `${vehicle.model.replace(/\s+/g, '')}-${trim.replace(/\s+/g, '')}`;

    const newTrim = await prisma.trim.create({
      data: {
        trim,
        trimDetail,
        otr,
        otrPrice: parseInt(otrPrice, 10),
        LinkPage,
        warrantyImg: warranty.filename,
        urlWarrantyImg: `${process.env.APP_HOST}/api/warranty/${warranty.filename}`,
        backgroundImg: backgroundImg.filename,
        urlBackgroundImg: `${process.env.APP_HOST}/api/images/${backgroundImg.filename}`,
        brochure: brochure.filename,
        urlBrochure: `${process.env.APP_HOST}/api/pdf/${brochure.filename}`,
        vehicle: { connect: { id: vehicleId } },
      },
    });

    res.status(201).json({ msg: "Trim created successfully", data: newTrim });
  } catch (error) {
    console.error(error.message);

    safeDelete(`./public/images/${backgroundImg?.filename}`);
    safeDelete(`./public/pdf/${brochure?.filename}`);
    safeDelete(`./public/warranty/${warranty?.filename}`);

    res.status(500).json({ msg: "Failed to create Trim data. Error: " + error.message });
  }
};


export const updateTrims = async (req, res) => {
  const { trim, trimDetail, otr, otrPrice, vehicleId } = req.body;
  const updatedData = {
    trim,
    trimDetail,
    otr,
    otrPrice: parseInt(otrPrice, 10),
  };

  const newBackgroundImg = req.files?.backgroundImg?.[0] || null;
  const newBrochure = req.files?.brochure?.[0] || null;
  const newWarrantyImg = req.files?.warrantyImg?.[0] || null;

  try {
    const currentData = await prisma.trim.findUnique({
      where: { id: Number(req.params.id) },
      include: { vehicle: true }
    });

    if (!currentData) {
      return res.status(404).json({ msg: "Trim not found" });
    }

    // Jika vehicleId atau trim diubah, buat LinkPage baru
    if (vehicleId || trim) {
      const vehicle = vehicleId
        ? await prisma.vehicle.findUnique({ where: { id: vehicleId } })
        : currentData.vehicle;

      if (!vehicle) {
        return res.status(404).json({ msg: "Vehicle not found" });
      }

      updatedData.LinkPage = `${vehicle.model.replace(/\s+/g, '')}-${trim ? trim.replace(/\s+/g, '') : currentData.trim.replace(/\s+/g, '')}`;
    }

    const allowedImgTypes = [".png", ".jpg", ".jpeg"];
    const allowedPdfTypes = [".pdf"];

    if (newBackgroundImg) {
      const imgExt = path.extname(newBackgroundImg.originalname).toLowerCase();
      const imgSize = newBackgroundImg.size;
      if (!allowedImgTypes.includes(imgExt) || imgSize > 5000000) {
        return res.status(422).json({ msg: "Invalid background image type or size exceeds 5 MB." });
      }
      updatedData.backgroundImg = newBackgroundImg.filename;
      updatedData.urlBackgroundImg = `${process.env.APP_HOST}/api/images/${newBackgroundImg.filename}`;
    }

    if (newBrochure) {
      const pdfExt = path.extname(newBrochure.originalname).toLowerCase();
      const pdfSize = newBrochure.size;
      if (!allowedPdfTypes.includes(pdfExt) || pdfSize > 80000000) {
        return res.status(422).json({ msg: "Invalid brochure PDF type or size exceeds 80 MB." });
      }
      updatedData.brochure = newBrochure.filename;
      updatedData.urlBrochure = `${process.env.APP_HOST}/api/pdf/${newBrochure.filename}`;
    }

    if (newWarrantyImg) {
      const warrantyExt = path.extname(newWarrantyImg.originalname).toLowerCase();
      const warrantySize = newWarrantyImg.size;
      if (!allowedImgTypes.includes(warrantyExt) || warrantySize > 5000000) {
        return res.status(422).json({ msg: "Invalid warranty image type or size exceeds 5 MB." });
      }
      updatedData.warrantyImg = newWarrantyImg.filename;
      updatedData.urlWarrantyImg = `${process.env.APP_HOST}/api/warranty/${newWarrantyImg.filename}`;
    }

    const updatedTrim = await prisma.trim.update({
      where: { id: Number(req.params.id) },
      data: updatedData,
    });

    if (newBackgroundImg) safeDelete(`./public/images/${currentData.backgroundImg}`);
    if (newBrochure) safeDelete(`./public/pdf/${currentData.brochure}`);
    if (newWarrantyImg) safeDelete(`./public/warranty/${currentData.warrantyImg}`);

    res.status(200).json({ msg: "Trim updated successfully", data: updatedTrim });
  } catch (error) {
    console.error(error.message);
    safeDelete(`./public/images/${newBackgroundImg?.filename}`);
    res.status(500).json({ msg: "Failed to update trim. Error: " + error.message });
  }
};

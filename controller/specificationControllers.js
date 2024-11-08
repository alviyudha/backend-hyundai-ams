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
export const getSpecificationEV = async (req, res) => {
    const { type } = req.query;  // Dapatkan 'type' dari query params

    try {
        if (type && type !== 'all') {
            // Jika 'type' ada dan bukan 'all', gunakan query dengan placeholder
            const response = await prisma.$queryRaw`
                SELECT
                    a.id as 'uuid',
                    b.id,                    
                    a.model,
                    a.year,
                    a.trim,
                    a.type,
                    a.otr,
                    a.otrPrice,
                    b.headTitle1,
                    b.text1,
                    b.headTitle2,
                    b.text2,
                    b.headTitle3,
                    b.text3,
                    b.headTitle4,
                    b.text4,
                    b.headTitle5,
                    b.text5,
                    b.urlImgView,
                    a.link
                FROM
                    vehicle a
                JOIN
                    specification b ON a.id = b.vehicleId
                WHERE
                    a.type = ${type}
            `;
            res.status(200).json(response);
        } else {
            // Jika 'type' adalah 'all' atau tidak ada, jalankan query tanpa WHERE clause
            const response = await prisma.$queryRaw`
                SELECT
                    a.id as 'uuid',
                    b.id,
                    a.model,
                    a.year,
                    a.trim,
                    a.type,
                    a.otr,
                    a.otrPrice,
                    b.headTitle1,
                    b.text1,
                    b.headTitle2,
                    b.text2,
                    b.headTitle3,
                    b.text3,
                    b.headTitle4,
                    b.text4,
                    b.headTitle5,
                    b.text5,
                    b.urlImgView,
                    a.link
                FROM
                    vehicle a
                JOIN
                    specification b ON a.id = b.vehicleId
            `;
            res.status(200).json(response);
        }
    } catch (error) {
        console.error("Error retrieving specifications:", error);
        res.status(500).json({ msg: error.message });
    }
}

export const getSpecificationEVbyid = async (req, res) => {
    const { id } = req.params;  // Dapatkan 'id' dari parameter URL

    try {
        const response = await prisma.$queryRaw`
            SELECT

            a.id,
                    a.model,
                    a.year,
                    a.trim,
                    a.type,
                    a.otr,
                    a.otrPrice,
                    b.headTitle1,
                    b.text1,
                    b.headTitle2,
                    b.text2,
                    b.headTitle3,
                    b.text3,
                    b.headTitle4,
                    b.text4,
                    b.headTitle5,
                    b.text5,
                    b.urlImgView,
                    a.link
                FROM
                    vehicle a
                JOIN
                    specification b ON a.id = b.vehicleId
            WHERE
                a.id = ${id}
        `;
        res.status(200).json(response);
    } catch (error) {
        console.error("Error retrieving specifications by id:", error);
        res.status(500).json({ msg: error.message });
    }
};


export const getSpecification= async (req,res) => { 
 
    try {
        const response = await prisma.specification.findMany()
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg:error.message})
    }
}
export const getSpecificationByid= async (req,res) => {

    try {
        const response = await prisma.specification.findUnique({
            where :{
                id: Number(req.params.id)
            }
        })
        res.status(202).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
        
    }
}

export const createSpecification = async (req, res) => {
  const { headTitle1, text1, headTitle2, text2, headTitle3, text3, headTitle4, text4, headTitle5, text5, trimId } = req.body;
  const imgView = req.file;

  if (!imgView) {
    return res.status(400).json({ msg: "Image file is required." });
  }

  const imgSize = imgView.size;
  const imgExt = path.extname(imgView.originalname);
  const imgName = imgView.filename;
  const imgUrl = `${process.env.APP_HOST}image-view/${imgName}`;
  const allowedImgTypes = ['.png', '.jpg', '.jpeg'];

  if (!allowedImgTypes.includes(imgExt.toLowerCase())) {
    return res.status(422).json({ msg: "Invalid image type." });
  }
  if (imgSize > 100000) {
    return res.status(422).json({ msg: "Image must be less than 100 kb." });
  }
 
  try {
    const newSpecification = await prisma.specification.create({
      data: {
        headTitle1,
        text1,
        headTitle2,
        text2,
        headTitle3,
        text3,
        headTitle4,
        text4,
        headTitle5,
        text5,
        imgView: imgName,
        urlImgView: imgUrl,
        trimId: parseInt(trimId, 10), // Pastikan trimId dikonversi menjadi integer
      },
    });
    res.status(200).json({ msg: "Specification created successfully", data: newSpecification });
  } catch (error) {
    console.error(error.message);
    safeDelete(`./public/image-view/${imgView?.filename}`);
    res.status(500).json({ msg: "Failed to create Specification.", error: error.message });
  }
};


export const updateSpecification = async (req, res) => {
    const { id } = req.params;
    const { headTitle1, text1, headTitle2, text2, headTitle3, text3, headTitle4, text4, headTitle5, text5, trimId } = req.body;
    const imgView = req.file;

    try {
        // Ensure the id from params and trimId from body are integers
        const specId = parseInt(id);
        const trimIdInt = parseInt(trimId);

        // Check if the specification exists
        const specification = await prisma.specification.findUnique({ where: { id: specId } });
        if (!specification) {
            return res.status(404).json({ msg: "Specification not found" });
        }

        // Handle image file if provided
        const imgUpdateData = {};
        if (imgView) {
            const imgSize = imgView.size;
            const imgExt = path.extname(imgView.originalname);
            const imgName = imgView.filename;
            const imgUrl = `${process.env.APP_HOST}image-view/${imgName}`;
            const allowedImgTypes = ['.png', '.jpg', '.jpeg'];

            if (!allowedImgTypes.includes(imgExt.toLowerCase())) {
                return res.status(422).json({ msg: "Invalid image type." });
            }
            if (imgSize > 100000) {
                return res.status(422).json({ msg: "Image must be less than 100 kb." });
            }

            imgUpdateData.imgView = imgName;
            imgUpdateData.urlImgView = imgUrl;

            // Delete old image if it exists
            if (specification.imgView) {
                safeDelete(`./public/image-view/${specification.imgView}`);
            }
        }

        const updatedSpecification = await prisma.specification.update({
            where: { id: specId },
            data: {
                headTitle1,
                text1,
                headTitle2,
                text2,
                headTitle3,
                text3,
                headTitle4,
                text4,
                headTitle5,
                text5,
                trim: { connect: { id: trimIdInt } }, // Update the trim reference
                ...imgUpdateData
            }
        });

        res.status(200).json({ message: "Specification updated successfully", data: updatedSpecification });
    } catch (error) {
        console.error("Error updating specification: ", error);
        safeDelete(`./public/image-view/${imgView?.filename}`);
        res.status(500).json({ msg: "Failed to update specification", error: error.message });
    }
};
export const deleteSpecification = async (req, res) => {
    try {
        const specifications = await prisma.specification.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!specifications) {
            return res.status(404).json({ msg: "Data not found" });
        }

        console.log(`Working Directory: ${process.cwd()}`); 
        const imgViews = `./public/image-view/${specifications.imgView}`;

        safeDelete(imgViews);

        await prisma.specification.delete({
            where: {
                id: Number(req.params.id)
            }
        });

        res.status(200).json({ msg: "spesification deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to delete spesification data. " + error.message });
    }
};

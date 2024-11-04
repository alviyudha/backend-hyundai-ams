import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

    export const getModelDetailAll = async (req, res) => {
        try {
            const response = await prisma.$queryRawUnsafe(`
                SELECT 
                    a.id AS 'uuid',
                    a.model,
                    a.year,
                    a.type, 
                    b.id,
                    b.trim,
                    b.trimDetail,
                    b.otr,
                    b.otrPrice,
                    b.vehicleId,
                    b.backgroundImg,
                    b.brochure,
                    b.warrantyImg,
                    b.urlBackgroundImg,
                    b.urlBrochure,
                    b.urlWarrantyImg, 
                    REPLACE(CONCAT(a.model, "-", b.trim),' ', '') AS "Link",
                    c.headTitle1,
                    c.headTitle2,
                    c.imgView,
                    c.text1,
                    c.text2, 
                    c.text3,
                    c.urlImgView,
                    c.headTitle3, 
                    c.headTitle4,
                    c.headTitle5,
                    c.text4,
                    c.text5,
                    c.trimId,
                    c.id as 'idSpek'
                FROM 
                    vehicle a
                JOIN 
                    trim b ON a.id = b.vehicleId
                JOIN 
                    specification c ON b.id = c.trimId
            `);

            res.status(200).json(response);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: "Failed to retrieve model details.", error: error.message });
        }
    };
export const getModelDetailByType = async (req, res) => {
    try {
        const {typecar} = req.params
        const response = await prisma.$queryRawUnsafe(`
            SELECT 
                a.id AS 'uuid',
                a.model,
                a.year,
                a.type, 
                b.id,
                b.trim,
                b.trimDetail,
                b.otr,
                b.otrPrice,
                b.vehicleId,
                b.backgroundImg,
                b.brochure,
                b.warrantyImg,
                b.urlBackgroundImg,
                b.urlBrochure,
                b.urlWarrantyImg, 
                REPLACE(CONCAT(a.model, "-", b.trim),' ', '') AS "Link",
                c.headTitle1,
                c.headTitle2,
                c.imgView,
                c.text1,
                c.text2, 
                c.text3,
                c.urlImgView,
                c.headTitle3, 
                c.headTitle4,
                c.headTitle5,
                c.text4,
                c.text5,
                c.trimId
            FROM 
                vehicle a
            JOIN 
                trim b ON a.id = b.vehicleId
            JOIN 
                specification c ON b.id = c.trimId
            where a.type = '${typecar}'
        `);

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to retrieve model details.", error: error.message });
    }
};
export const getAllModelDataByTrimID = async (req, res) => {
    try {
        const {trimid} = req.params
        const response = await prisma.$queryRawUnsafe(`
                        SELECT 
                a.id AS 'uuid',
                a.model,
                a.year,
                a.type, 
                b.id,
                b.trim,
                b.trimDetail,
                b.otr,
                b.otrPrice,
                b.vehicleId,
                b.backgroundImg,
                b.brochure,
                b.warrantyImg,
                b.urlBackgroundImg,
                b.urlBrochure,
                b.urlWarrantyImg, 
                REPLACE(CONCAT(a.model, "-", b.trim),' ', '') AS "Link",
                c.headTitle1,
                c.headTitle2,
                c.imgView,
                c.text1,
                c.text2, 
                c.text3,
                c.urlImgView,
                c.headTitle3, 
                c.headTitle4,
                c.headTitle5,
                c.text4,
                c.text5,
                c.trimId,
                d.descColor,
                d.colorsImage,
                d.urlcolorsImage,
                d.backgroundColor
            FROM 
                vehicle a
            JOIN 
                trim b ON a.id = b.vehicleId
            JOIN 
                specification c ON b.id = c.trimId
            JOIN 
                color d ON b.id = d.trimId
            WHERE 
                c.trimID = '${trimid}'

        `);

        res.status(200).json(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to retrieve model details.", error: error.message });
    }
};



export const getModelTrim = async (req, res) => {
    try {
        const response = await prisma.$queryRawUnsafe(`
            SELECT 
                a.id as "uuid",
                b.id,
                REPLACE(CONCAT(a.model, '-', b.trim), ' ', '') AS "Link", 
               CONCAT(a.model, '-', b.trim) AS "Cars", 
                a.type,
                a.year,
                b.trim,
                b.otr,
                b.otrPrice,
                b.trimDetail,
                b.urlBackgroundImg,
                b.urlBrochure,
                b.urlWarrantyImg,
                b.vehicleId
            FROM 
                Vehicle a, 
                Trim b 
            WHERE 
                a.id = b.vehicleId
        `);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const getModelTrimById = async (req, res) => {
    const {uuid} = req.params
    try {
        const response = await prisma.$queryRawUnsafe(`
                        SELECT 
                            a.id AS "uuid",
                            b.id AS "trimId",
                            a.model AS "model",
                            REPLACE(CONCAT(a.model, '-', b.trim), ' ', '') AS "Cars", 
                            CONCAT(a.model, '-', b.trim) AS "Cars",
                            a.type,
                            a.year,
                            b.trim,
                            b.otr,
                            b.otrPrice,
                            b.trimDetail,
                            b.urlBackgroundImg,
                            b.urlBrochure,
                            b.urlWarrantyImg,
                            b.vehicleId
                        FROM 
                            vehicle a
                        JOIN 
                            trim b ON a.id = b.vehicleId
                        WHERE 
                            a.id = '${uuid}';

        `);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const getModelTrimByIdTrim = async (req, res) => {
    const {trimid} = req.params
    try {
        const response = await prisma.$queryRawUnsafe(`
                        SELECT 
                            a.id AS "uuid",
                            b.id AS "trimId",
                            a.model AS "model",
                            REPLACE(CONCAT(a.model, '-', b.trim), ' ', '') AS "Cars", 
                            CONCAT(a.model, '-', b.trim) AS "Cars",
                            a.type,
                            a.year,
                            b.trim,
                            b.otr,
                            b.otrPrice,
                            b.trimDetail,
                            b.urlBackgroundImg,
                            b.urlBrochure,
                            b.urlWarrantyImg,
                            b.vehicleId
                        FROM 
                            vehicle a
                        JOIN 
                            trim b ON a.id = b.vehicleId
                        WHERE 
                            b.id = '${trimid}';

        `);

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
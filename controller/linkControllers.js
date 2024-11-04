import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export const getLink = async (req,res) =>{
    
    try {
        const response = await prisma.linkCarDetail.findMany()
        res.status(200).json(response)
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
export const getLinkById = async (req,res) =>{
    
    try {
        const response = await prisma.linkCarDetail.findUnique({
            where :{
                id : Number(req.params.id)
            }
        })
        res.status(200).json(response)
        
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const createLink = async (req, res) => {
    const { link, vehicleId } = req.body;

    try {
        const newLink = await prisma.linkCarDetail.create({
            data: {
                link,
                vehicleId
            }
        });
        res.status(200).json({ msg: 'Link created successfully', data: newLink });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to create Link.", error: error.message });
    }
};

export const updateLink = async (req,res) =>{
    const {id} = req.params 
    const { link } = req.body;
    const updateData = {
        link,
    }

    try {
        const currentData = await prisma.linkCarDetail.findUnique({
            where: { id: parseInt(id) }
        });
        if (!currentData){
            return res.status(404).json({ msg: "Data not found" });
        }
        const updateLink = await prisma.linkCarDetail.update({
            where: { id: parseInt(id) },
          data: updateData
        })
        res.status(200).json({ msg: "data updated successfully", data: updateLink });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to create Link.", error: error.message });
    }
}
export const deleteLink = async (req,res) =>{
    const { id } = req.params;  

    try {
        const specification = await prisma.linkCarDetail.findUnique({
            where: { id: parseInt(id) }  
        });

        if (!specification) {
            return res.status(404).json({ msg: "data not found" }); 
        }

        await prisma.linkCarDetail.delete({
            where: { id: parseInt(id) } 
        });

        res.status(200).json({ msg: "data deleted successfully" });  
    } catch (error) {
        console.error("Error deleting data: ", error);
        res.status(500).json({ msg: "Failed to delete data", error: error.message }); 
    }
}
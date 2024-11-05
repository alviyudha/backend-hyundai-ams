import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
export const getVehicles = async (req, res) => {
    try {
        console.log('Received request for /vehicles');
        const response = await prisma.vehicle.findMany();
        console.log('Data retrieved:', response);
        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({ msg: error.message });
    }
};
export const getVehiclesByID = async (req,res) =>{
    try {
        const response = await prisma.vehicle.findUnique({
            where:{
                id: req.params.id
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}


export const getVehiclesByModel = async (req, res) => {
    try {
        const modelValue = req.params.model;
        const response = await prisma.vehicle.findMany({
            where: {
                model: modelValue
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const createVehicles = async (req, res) => {
    const { model, year, type} = req.body;

    try {
        const newVehicle = await prisma.vehicle.create({
            data: {
                model,
                year: parseInt(year, 10),
                type,
               
            }
        });

        res.status(201).json({ msg: "Vehicle created successfully", data: newVehicle });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to create vehicle." });
    }
};

export const updateVehicles = async (req, res) => {
    const { id } = req.params;
    const { model, year, type } = req.body;
    const updatedData = {
        model,
        year: parseInt(year, 10),
        type,
       
    };
  
    try {
        
        const updatedVehicle = await prisma.vehicle.update({
            where: { id },
            data: updatedData
        });
  
        res.status(200).json({ msg: "Vehicle updated successfully", data: updatedVehicle });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to update vehicle." });
    }
  };

export const deletetVehicles = async (req, res) => {
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: {
                id: req.params.id
            }
        });

        if (!vehicle) {
            return res.status(404).json({ msg: "Data not found" });
        }


        await prisma.vehicle.delete({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json({ msg: "Vehicle deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Failed to delete vehicle data. " + error.message });
    }
};
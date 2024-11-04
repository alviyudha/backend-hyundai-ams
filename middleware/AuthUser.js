import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

export const verifyUser = async (req,res,next) => {
    if (!req.session.userCuid){
        return res.status(401).json({msg: "Please login first"})
    }
    const users = await prisma.user.findUnique({
        where :{
            cuid : req.session.userCuid
        }
    })
    if (!users) 
        return res.status(401).json({msg: "User not found"})
    req.userCuid = users.cuid
    req.role = users.role; 
    next();
    
}

export const adminOnly = async (req,res, next) =>{
    const users = await prisma.user.findUnique({
        where :{
            cuid: req.session.userCuid
        }
    })
    if (!users) return res.status(404).json({msg:"user tidak ditemukan"});
        if (users.role !== "ADMIN")return res.status(403).json({msg:"akses terlarang"});
            next();
}

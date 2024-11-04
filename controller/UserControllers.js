import { PrismaClient } from "@prisma/client";
import  argon2  from "argon2";

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
    try {
        const response = await prisma.user.findMany({
            select: {
                cuid: true,
                username: true,
                password: true,
                role: true
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};

export const getUserByCUID = async (req,res) => {
    try {
        const response = await prisma.user.findUnique({
            select :{
                cuid: true,
                username: true,
                password: true,
                role: true
            },
            where : {
                cuid: req.params.cuid
            }
        })
        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
export const createUser = async (req, res) => {
    const { username, password, confPassword, role } = req.body;
    try {
        if (password !== confPassword) return res.status(400).json({ msg: "Password Tidak Sesuai" });

        // password kosong
        if (password.trim().length === 0 || /\s/.test(password)) {
            return res.status(400).json({ msg: "Password tidak boleh kosong, hanya spasi, atau mengandung spasi" });
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (existingUser) return res.status(400).json({ msg: "Username sudah digunakan" });

        const hashPassword = await argon2.hash(password);
        const response = await prisma.user.create({
            data: {
                username: username,
                password: hashPassword,
                role: role || 'USER'
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const updateUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                cuid: req.params.cuid
            }
        });
        if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

        const { username, password, confPassword, role } = req.body;
        let hashPassword;

        if (!password) {
            hashPassword = user.password;
        } else {
            if (password !== confPassword) return res.status(400).json({ msg: "Password dan confirm password tidak sama" });
            hashPassword = await argon2.hash(password);
        }

        const updateUser = await prisma.user.update({
            where: { cuid: req.params.cuid },
            data: {
                username: username || user.username,
                password: hashPassword,
                role: role || user.role
            }
        });

        res.status(200).json({ msg: "User berhasil di update", user: updateUser });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
export const deleteUser = async (req,res) => {
    const user = await prisma.user.findUnique({
        where : {
            cuid : req.params.cuid
        }
    })
    if (!user) res.status(404).json({msg: "User tidak ditemukan"})
    try {
        const response = await prisma.user.delete({
            where :{
                cuid : req.params.cuid
            }
        })
        res.status(200).json({msg: "User Deleted"})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}
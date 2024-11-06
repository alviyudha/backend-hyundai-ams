import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getMessageUser = async (req, res) => {
  try {
    const response = await prisma.MessageUser.findMany();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const getMessageUserById = async (req, res) => {
  try {
    const response = await prisma.MessageUser.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const createMessageUser = async (req, res) => {
  const {
    name,
    email,
    telp,
    nopol,
    carModel,
    dealer,
    dateInput,
    inputMessage,
    catMessage,
    address,
    consentStatus,
    ipAddress  
  } = req.body;


  try {
    const newMessageUser = await prisma.MessageUser.create({
      data: {
        name,
        email,
        telp,
        nopol,
        carModel,
        dealer,
        dateInput: dateInput ? new Date(dateInput) : null,
        inputMessage,
        catMessage,
        address,
        consentStatus: consentStatus ?? false,
        consentDate: consentStatus ? new Date() : null,
        ipAddress, 
      },
    });
    res.status(201).json(newMessageUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateMessageUser = async (req, res) => {
  const {
    name,
    email,
    telp,
    nopol,
    carModel,
    dealer,
    dateInput,
    inputMessage,
    catMessage,
    address,
    consentStatus,
  } = req.body;

  const ipAddress = req.ip;

  try {
    const updatedMessageUser = await prisma.MessageUser.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name,
        email,
        telp,
        nopol,
        carModel,
        dealer,
        dateInput: dateInput ? new Date(dateInput) : null,
        inputMessage,
        catMessage,
        address,
        consentStatus: consentStatus ?? false, 
        consentDate: consentStatus ? new Date() : null, // Update tanggal persetujuan jika consentStatus true
        ipAddress,
      },
    });
    res.status(200).json(updatedMessageUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteMessageUser = async (req, res) => {
  try {
    await prisma.MessageUser.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json({ msg: "Message user deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

cloudinary.config({
  cloud_name: "dp0lh09ne",
  api_key: "331655211346174",
  api_secret: "ukaU5jdFFKv74tbEPBIj3WC8pfA",
});
const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

const Offer = require("../models/Offer");
const User = require("../models/User");

router.post("/offer/publish", fileUpload(), async (req, res) => {
  const myPictureInBase64 = convertToBase64(req.files.picture);
  const pictureUpload = await cloudinary.uploader.upload(myPictureInBase64);

  try {
    const newOffer = new Offer({
      product_name: req.body.title,
      product_description: req.body.description,
      product_price: req.body.price,
      product_details: [
        { MARQUE: req.body.brand },
        { TAILLE: req.body.size },
        { ETAT: req.body.condition },
        { color: req.body.color },
        { EMPLACEMENT: req.body.city },
      ],
      product_image: pictureUpload,
      owner: req.user,
    });

    await newOffer.save();

    res.json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/offer", async (req, res) => {
  const filterObject = {};
  if (req.query.title) {
    filterObject.product_name = new RegExp(req.query.title, "i");
  }

  const allOffer = await Offer.find(filterObject);

  res.json(allOffer);
});

router.get("/offer/:id", async (req, res) => {
  const offerById = await Offer.findById(req.params.id).populate({
    path: "owner",
    select: "account.username account.phone account.avatar",
  });
  res.json(offerById);
});

module.exports = router;

// get all properties
// get property based on id
// create property
// get user's properties

const { Property } = require("../models/propertyModel.js");
const APIFeatures = require("../utils/APIFeatures.js");
const imagekit = require("../utils/ImagekitIO.js");

// =====================================================
// GET ALL PROPERTIES
// =====================================================
// GET /api/v1/rent/listing
const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(
      Property.find(),
      req.query
    )
      .filter()
      .search()
      .paginate();

    const properties = await features.query;

    res.status(200).json({
      status: "success",
      no_of_responses: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error getting properties:", error);

    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// =====================================================
// GET PROPERTY BY ID
// =====================================================
// GET /api/v1/rent/listing/:id
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    console.error("Error getting property:", error);

    res.status(404).json({
      status: "fail",
      message: "Invalid property ID",
    });
  }
};

// =====================================================
// CREATE PROPERTY
// =====================================================
// POST /api/v1/rent/listing
const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body;

    // Validate images
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide property images",
      });
    }

    if (images.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide at least 6 images",
      });
    }

    // Upload images to ImageKit
    const uploadedImages = [];

    for (const image of images) {
      const result = await imagekit.upload({
        file: image.url,
        fileName: `property_${Date.now()}.jpg`,
        folder: "property_images",
      });

      uploadedImages.push({
        url: result.url,
        public_id: result.fileId,
      });
    }

    // Create property
    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images: uploadedImages,

      // Owner comes from logged-in user
      userId: req.user._id || req.user.id,
    });

    res.status(201).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    console.error("Error creating property:", error);

    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// =====================================================
// GET MY PROPERTIES
// =====================================================
// GET /api/v1/rent/my-properties
const getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const properties = await Property.find({
      userId: userId,
    });

    res.status(200).json({
      status: "success",
      no_of_properties: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Error getting user's properties:", error);

    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  getUsersProperties,
};
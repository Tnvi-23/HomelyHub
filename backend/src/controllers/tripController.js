const { Property } = require("../models/propertyModel.js");
const { planTrip } = require("../ai/tripPlanner.js");
const { generateDescription } = require("../ai/generateDescription.js");

const cleanCity = (text) => {
  return String(text).toLowerCase().replaceAll(" ", "");
};

const createTripPlan = async (req, res) => {
  try {
    const {
      destination,
      budget,
      days,
      people,
      interests,
    } = req.body;

    // Validate required fields
    if (!destination || !budget || !days || !people) {
      return res.status(400).json({
        status: "fail",
        message: "Please fill in destination, budget, days & people",
      });
    }

    const budgetNumber = Number(budget);
    const daysNumber = Number(days);
    const peopleNumber = Number(people);

    if (
      !Number.isFinite(budgetNumber) ||
      budgetNumber <= 0 ||
      !Number.isFinite(daysNumber) ||
      daysNumber <= 0 ||
      !Number.isFinite(peopleNumber) ||
      peopleNumber <= 0
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Budget, days and people must be valid positive numbers",
      });
    }

    // Calculate nightly budget BEFORE using it
    const perNight = budgetNumber / daysNumber;

    // Generate AI trip plan
    const plan = await planTrip({
      destination,
      budget: budgetNumber,
      days: daysNumber,
      people: peopleNumber,
      interests: Array.isArray(interests) ? interests : [],
    });

    const city = cleanCity(destination);

    // IMPORTANT:
    // Use Property, because propertyModel exports { Property }
    const properties = await Property.find({
      $or: [
        {
          "address.city": city,
        },
        {
          "address.state": city,
        },
        {
          "address.area": city,
        },
      ],
      price: {
        $lte: perNight,
      },
      maximumGuest: {
        $gte: peopleNumber,
      },
    }).limit(6);

    res.status(200).json({
      status: "success",
      data: {
        plan,
        properties,
        perNight,
      },
    });
  } catch (error) {
    console.error("Trip Genie error:", error);

    res.status(500).json({
      status: "fail",
      message:
        error.message || "Could not create a trip plan, please try again",
    });
  }
};

const writeDescription = async (req, res) => {
  try {
    const description = await generateDescription(req.body);

    res.status(200).json({
      status: "success",
      data: {
        description,
      },
    });
  } catch (error) {
    console.error("Description generation error:", error);

    res.status(500).json({
      status: "fail",
      message: "Could not generate the description",
    });
  }
};

module.exports = {
  createTripPlan,
  writeDescription,
};
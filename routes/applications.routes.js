const express = require("express");
const { getAllApplications, addApplication, deleteApplication, editApplication } = require("../controlers/applications.controller");

const router = express.Router();

// Get all applications

router.get("/", getAllApplications);

router.post("/", addApplication);

router.put("/:id", editApplication);

router.delete("/:id", deleteApplication);

module.exports = router;
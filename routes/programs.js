const express = require("express");
const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/program");

//Include other resource routers
//const reservationRouter = require("./reservations");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
//router.use("/:companyId/reservations/", reservationRouter);
//router.route("/vacCenters").get(getVacCenters);
router
  .route("/")
  .get(getPrograms)
  .post(protect, authorize("admin"), createProgram);
router
  .route("/:id")
  .get(getProgram)
  .put(protect, authorize("admin"), updateProgram)
  .delete(protect, authorize("admin"), deleteProgram);

module.exports = router;

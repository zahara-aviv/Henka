const express = require("express");

const linkRecordController = require("../controllers/linkRecordController");

const router = express.Router();

router.get("/", linkRecordController.getLinks, (req, res) =>
  res.sendStatus(200)
);

router.delete("/id/:id", linkRecordController.deleteByID, (req, res) =>
  res.sendStatus(200)
);

router.patch("/vote", linkRecordController.updateVote, (req, res) =>
  res.sendStatus(204)
);

router.get(
  "/record/:record_type",
  linkRecordController.getRecordType,
  (req, res) => res.status(200).json(res.locals.records)
);

router.post("/search", linkRecordController.getSearchResults, (req, res) =>
  res.status(200).json(res.locals.searchResults)
);

// /?id=1234
router.get("/id", linkRecordController.getByID, (req, res) =>
  res.status(200).json(res.locals.record)
);

router.post("/record", linkRecordController.addLinkRecord, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;

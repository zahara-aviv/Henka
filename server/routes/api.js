const express = require("express");

const linkRecordController = require("../controllers/linkRecordController");

const router = express.Router();

router.get("/", linkRecordController.getLinks, (req, res) =>
  res.status(200).json(res.locals.characters)
);

router.get("/:record_type", linkRecordController.getRecordType, (req, res) =>
  res.status(200).json(res.locals.record)
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

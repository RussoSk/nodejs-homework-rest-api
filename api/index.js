const {
    get,
    getOne,
    add,
    remove,
    update,
    updateStatus,
  } = require("../controllers");
  
  const { authenticate } = require("../middlewares");
  const express = require("express");
  
  const router = express.Router();
  
  router.get("/", authenticate, get);
  
  router.get("/:contactId", authenticate, getOne);
  
  router.delete("/:contactId", authenticate, remove);
  
  router.post("/", authenticate, add);
  
  router.put("/:contactId", authenticate, update);
  
  router.patch("/:contactId/favorite", authenticate, updateStatus);
  
  module.exports = router;
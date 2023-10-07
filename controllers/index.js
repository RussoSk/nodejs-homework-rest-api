const {
    HttpError,
    requestError,
    validateData,
    addRequestError,
  } = require("../utils");
  
  const {
    getAllContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
  } = require("../service");
  
  const get = async (req, res, next) => {
    try {
      const owner = req.user._id;
      const contacts = await getAllContacts(owner, req.query);
      res.json(contacts);
    } catch (e) {
      next(e);
    }
  };
  
  const getOne = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);
  
      if (!contact || contact.owner.toString() !== req.user._id) {
        throw HttpError(404, "Not found");
      }
  
      res.json(contact);
    } catch (e) {
      next(e);
    }
  };
  
  
  const add = async (res, req, next) => {
    try {
      const owner = req.user._id; 
      const body = req.body;
      const { error } = validateData.validateBody(body);
  
      if (error) {
        addRequestError(res, error);
        return;
      }
  
      const contact = await addContact({ ...body, owner });
      res.status(201).json(contact);
    } catch (e) {
      next(e);
    }
  };
  
  const remove = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const contact = await removeContact(contactId);
  
      if (!contact || contact.owner.toString() !== req.user._id) {
        throw HttpError(404, "Not found");
      }
  
      res.json({
        message: "contact deleted",
      });
    } catch (e) {
      next(e);
    }
  };
  
  const update = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const body = req.body;
  
      const { error } = validateData.validateUpdatedFields(body, res);
  
      if (error) {
        requestError(res, error);
      }
  
      const contact = await getContactById(contactId);
      if (!contact || contact.owner.toString() !== req.user._id) {
        throw HttpError(404, "Not found");
      }
  
      const updatedContact = await updateContact(contactId, body);
      res.json(updatedContact);
    } catch (e) {
      next(e);
    }
  };
  
  const updateStatus = async (req, res, next) => {
    try {
      const { contactId } = req.params;
      const body = req.body;
  
      const { error } = validateData.validateStatusBody(body);
  
      if (error) {
        requestError(res, error);
        return;
      }
  
      const contact = await getContactById(contactId);
      if (!contact || contact.owner.toString() !== req.user._id) {
        throw HttpError(404, "Not found");
      }
  
      const updatedContact = await updateStatusContact(contactId, body);
      res.json(updatedContact);
    } catch (e) {
      next(e);
    }
  };
  
  module.exports = {
    get,
    getOne,
    add,
    remove,
    update,
    updateStatus,
  };
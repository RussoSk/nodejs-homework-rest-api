const { Contact } = require("../models/schemas/contact");

const getAllContacts = async (owner, query) => {
  const { limit = 10, page = 1 } = query;
  const skip = (page - 1) * limit;
  console.log(skip);
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "_id");
  console.log(result);
  return result;
};

const getContactById = async (contactId, owner) => {
  if (contactId.match(/^[0-9a-fA-F]{24}$/)) {
    const result = await Contact.findOne({ _id: contactId, owner });
    return result;
  }
  return null;
};

const removeContact = async (contactId, owner) => {
  const currentContact = await getContactById(contactId, owner);
  if (!currentContact) {
    return null;
  }
  await Contact.findOneAndRemove({ _id: contactId, owner });
  return currentContact;
};

const addContact = async (body, owner) => {
  const result = await Contact.create({ ...body, owner });
  return result;
};

const updateContact = async (contactId, body, owner) => {
  const currentContact = await getContactById(contactId, owner);
  if (!currentContact) {
    return null;
  }
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    body,
    {
      new: true,
    }
  );
  return result;
};

const updateStatusContact = async (contactId, body, owner) => {
  const currentContact = await getContactById(contactId, owner);
  if (!currentContact) {
    return null;
  }

  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    body,
    {
      new: true,
    }
  );
  return result;
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
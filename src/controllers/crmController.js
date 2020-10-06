import mongoose from 'mongoose';
import { ContactSchema } from '../models/crmModel';
import validator from 'validator';

const Contact = mongoose.model('Contact', ContactSchema);

export const addNewContact = (req, res) => {
  const { firstName, lastName, email, company, phone } = req.body;
  let newContactObj = { firstName, lastName, email, company, phone };
  let newContact = new Contact(newContactObj);
  newContact.save((err, contact) => {
    if (err) res.send(err);
    res.json(contact);
  });
};

export const getContact = (req, res) => {
  Contact.find({}, (err, contact) => {
    if (err) res.send(err);
    res.json(contact);
  });
};

export const getContactById = (req, res) => {
  Contact.findById(req.params.contactId, (err, contact) => {
    if (err) res.send(err);
    res.json(contact);
  });
};

export const updateContact = (req, res) => {
  Contact.findOneAndUpdate(
    { _id: req.params.contactId },
    req.body,
    { new: true, useFindAndModify: false },
    (err, contact) => {
      if (err) res.send(err);
      res.json(contact);
    },
  );
};

export const deleteContact = (req, res) => {
  Contact.remove({ _id: req.params.contactId }, (err, contact) => {
    if (err) res.send(err);
    res.json({ message: 'successfully deleted contact' });
  });
};

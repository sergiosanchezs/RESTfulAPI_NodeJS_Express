import {
  addNewContact,
  getContact,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/crmController';

const routes = app => {
  app
    .route('/contact')
    .get((req, res, next) => {
      //middleware
      console.log(`Request from: ${req.originalUrl}`);
      console.log(`Request type: ${req.method}`);
      next();
    }, getContact)
    // Post endpoint
    .post(addNewContact);

  app
    .route('/contact/:contactId')
    //get a specific contact
    .get(getContactById)
    //update a specific contact
    .put(updateContact)
    //delete a specific contact
    .delete(deleteContact);
};

export default routes;

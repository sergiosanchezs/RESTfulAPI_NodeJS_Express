import {
  addNewContact,
  getContact,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/crmController';
import { login, loginRequired, register } from '../controllers/userController';
import { contactValidation } from '../middlewares/validation-middleware';

const routes = app => {
  app
    .route('/contact')
    .get(
      (req, res, next) => {
        //middleware
        console.log(`Request from: ${req.originalUrl}`);
        console.log(`Request type: ${req.method}`);
        next();
      },
      loginRequired,
      getContact,
    )
    // Post endpoint
    .post(loginRequired, contactValidation, addNewContact);

  app
    .route('/contact/:contactId')
    //get a specific contact
    .get(loginRequired, getContactById)
    //update a specific contact
    .put(loginRequired, updateContact)
    //delete a specific contact
    .delete(loginRequired, deleteContact);

  // Registration Route
  app.route('/auth/register').post(register);

  // login route
  app.route('/login').post(login);
};

export default routes;

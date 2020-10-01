import validator from '../helpers/validate';

export const contactValidation = (req, res, next) => {
  const validationRule = {
    firstName: 'required|string|min:2',
    lastName: 'required|string|min:2',
    email: 'required|email',
    company: 'string',
    phone: 'number',
  };

  const customMessages = {
    firstName: {
      required: 'You must enter a First Name',
      string: 'The First Name must be a string',
      min: 'The First Name must be 2 or more characters Long',
    },
    lastName: {
      required: 'You must enter a Last Name',
      string: 'The Last Name must be a string',
      min: 'The Last Name must be 2 or more characters Long',
    },
    email: {
      required: 'You must enter a email',
      email: 'Please, enter a valid email',
    },
    company: {
      string: 'The Company must be a string',
    },
    phone: {
      number: 'The Phone must be a number',
    },
  };

  validator(req.body, validationRule, customMessages, (err, status) => {
    if (!status)
      res.status(412).send({
        success: status,
        message: 'Validation form failed',
        data: err,
      });
    else next();
  });
};

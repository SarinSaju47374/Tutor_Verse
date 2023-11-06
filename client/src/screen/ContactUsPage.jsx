import React from 'react';
import '../scss/screen/ContactUsPage.scss';

const ContactUsPage = () => {
  return (
    <div className="contact-us-page">
      <h1>Contact Us</h1>
      <p>
        Have questions or need assistance? Feel free to reach out to us using the
        information below or by filling out the contact form.
      </p>
      <div className="contact-info">
        <div>
          <h3>Email</h3>
          <p>info@tutorverse.com</p>
        </div>
        <div>
          <h3>Phone</h3>
          <p>(123) 456-7890</p>
        </div>
      </div>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" rows="5"></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactUsPage;

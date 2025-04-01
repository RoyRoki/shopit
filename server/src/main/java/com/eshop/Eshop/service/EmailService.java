package com.eshop.Eshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;


@Service
public class EmailService {
      
      @Autowired
      private JavaMailSender sender;

      public String sendEmail(String to, String subject, String body) {
            try {
                  MimeMessage message = sender.createMimeMessage();
                  MimeMessageHelper helper = new MimeMessageHelper(message, true);

                  helper.setTo(to);
                  helper.setSubject(subject);
                  helper.setText(body, true); // true enables HTML content

                  sender.send(message);
                  return "Email sent successfully";
            } catch (Exception e) {
                  return "Failed to sent email. "+e.getMessage();
            }
      }
}

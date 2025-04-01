package com.eshop.Eshop.service;

import com.eshop.Eshop.service.Interface.MessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageServiceImp implements MessageService {

    @Autowired
    private EmailService emailService;

    // We use fast 2 sms
    @Override
    public void sentMessageToMobile(String mobileNo, String message) {
        System.out.println(mobileNo);
        System.out.println(message);
    }

    @Override
    public void sentMessageToEmail(String email, String message) {
        String sesResponse = emailService.sendEmail(email, "TEST", message);
        System.out.println(sesResponse);
        System.out.println(email);
        System.out.println(message);
    }
}

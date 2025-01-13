package com.eshop.Eshop.service;

import com.eshop.Eshop.service.Interface.MessageService;
import org.springframework.stereotype.Service;

@Service
public class MessageServiceImp implements MessageService {

    @Override
    public void sentMessageToMobile(String mobileNo, String message) {
        System.out.println(mobileNo);
        System.out.println(message);
    }

    @Override
    public void sentMessageToEmail(String email, String message) {
        System.out.println(email);
        System.out.println(message);
    }
}

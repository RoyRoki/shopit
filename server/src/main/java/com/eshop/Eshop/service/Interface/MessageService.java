package com.eshop.Eshop.service.Interface;

public interface MessageService {
    void sentMessageToMobile(String mobileNo, String message);

    void sentMessageToEmail(String email, String message);
}

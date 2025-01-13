package com.eshop.Eshop.service;

import com.eshop.Eshop.service.Interface.CloudinaryService;

import com.cloudinary.*;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CloudinaryServiceImp  implements CloudinaryService {

    @Value("${cloudinary.url:#{null}}}")
    private static String cldUrl;

    private  Cloudinary cloudinary;


    public CloudinaryServiceImp() {

        if (cldUrl == null) {
            Dotenv dotenv = Dotenv.load();
            cldUrl = dotenv.get("CLOUDINARY_URL");
        }
        if (cldUrl == null || cldUrl.isEmpty()) {
            throw new IllegalStateException("Cloudinary URL is not configured properly.");
        }
        this.cloudinary = new Cloudinary(cldUrl);
        System.out.println("Cloudinary Cloud Name: " + cloudinary.config.cloudName);
    }


    public String uploadImage(MultipartFile file) {

        try {
            Map params = ObjectUtils.asMap(
                    "use_filename", true,
                    "unique_filename", true,
                    "overwrite", false
            );
            Map uploadResult;
            uploadResult = cloudinary.uploader().upload(file.getBytes(), params);
            return (String) uploadResult.get("url");

        } catch (IOException ioException) {
            throw new RuntimeException("Upload an Image failed CloudinaryServiceImp-uploadImage");
        }

    }

    public String deleteImage(String url) {
        try {
            String publicId = extractPublicId(url);
            Map params = ObjectUtils.asMap(
                    "public_id",publicId
            );
            cloudinary.uploader().destroy(publicId, params);
            return url;
        } catch (IOException e) {
            throw new RuntimeException("Image deletion failed CloudinaryServiceImp-deleteImage", e);
        }
    }

    private String extractPublicId(String url) {
        String[] urlPart = url.split("/");
        return urlPart[urlPart.length - 1].replace(".jpg", "").replace(".png", "").replace(".jpeg", "").replace(".gif", "");
    }

}

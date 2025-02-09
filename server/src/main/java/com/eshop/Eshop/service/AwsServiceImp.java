package com.eshop.Eshop.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.eshop.Eshop.service.Interface.AwsService;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.DeleteObjectRequest;

@Service
public class AwsServiceImp implements AwsService {
    
      private final AmazonS3 s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public AwsServiceImp(AmazonS3 amazonS3) {
      this.s3Client = amazonS3;
    }

    public String uploadFile(MultipartFile file) {
      try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());

            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file.getInputStream(), metadata);

            s3Client.putObject(putObjectRequest);
            return s3Client.getUrl(bucketName, fileName).toString();

      } catch (IOException e) {
            throw new RuntimeException("Upload failed in AwsServiceImp-uploadImage", e);
      }
    }

    public String deleteImage(String fileUrl) {
        try {
            String fileKey = extractFileKey(fileUrl);
            s3Client.deleteObject(new DeleteObjectRequest(bucketName, fileKey));
            return fileUrl;
        } catch (Exception e) {
            throw new RuntimeException("Image deletion failed in AwsServiceImp-deleteImage", e);
        }
    }

    private String extractFileKey(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    }

}

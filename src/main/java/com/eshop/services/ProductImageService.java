package com.eshop.services;

import com.eshop.dao.ProductImageDAO;
import com.eshop.entities.Product;
import com.eshop.entities.ProductImage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;

@Service
public class ProductImageService {

    @Autowired
    private ProductImageDAO productImageDAO;

    public ProductImage create(ProductImage pp){
        return productImageDAO.save(pp);
    }

    public ProductImage findById(Integer id) {
        return productImageDAO.findById(id).orElse(null);
    }

    public ProductImage update(ProductImage productImage){
        return productImageDAO.save(productImage);
    }

    public void deleteById(Integer id){
        productImageDAO.deleteById(id);
    }

    public ProductImage findByName(String name) {
        return productImageDAO.findByName(name);
    }

    public ProductImage create(Product product, String urlString) throws Exception {
        ProductImage productImage = new ProductImage();
        try {
            URL url = new URL(urlString);
            URLConnection connection = url.openConnection();
            connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.95 Safari/537.11");
            connection.connect();
            InputStream in = connection.getInputStream();
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[1024];
            int n = 0;
            while (-1!=(n=in.read(buf)))
            {
                out.write(buf, 0, n);
            }
            out.close();
            in.close();
            byte[] response = out.toByteArray();
            productImage.setData(response);
            productImage.setName(urlString);
            productImage.setProduct(product);
        }
        catch(Exception ex) {
            throw ex;
        }
        return productImage;
    }
}

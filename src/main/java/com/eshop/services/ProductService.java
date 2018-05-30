package com.eshop.services;

import com.eshop.dao.ProductDAO;
import com.eshop.dao.PropertyDAO;
import com.eshop.entities.Product;
import com.eshop.entities.Property;
import com.eshop.exceptions.ProductNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class ProductService {

    @Autowired
    private ProductDAO productDAO;

    @Autowired
    private PropertyService propertyService;

    public Product create(Product product){
        Product newProduct = productDAO.save(product);
        for(Property p : product.getProductProperties()){
            p.setProduct(newProduct);
        }
        propertyService.create(product.getProductProperties());

        product.setDateCreated(LocalDateTime.now());
        return newProduct;
    }

    public List<Product> findAll(){
        return productDAO.findAll();
    }

    public Product findById(Integer id) throws ProductNotFoundException {
        Product product = productDAO.findById(id).orElse(null);
        if(product == null){
            throw new ProductNotFoundException();
        }
        else{
            return product;
        }
    }

    public Product update(Product product) {
        List<Integer> propertiesIds = getIds(product.getProductProperties());
        for(Property prop : propertyService.getProperties(product.getId())){
            if(!propertiesIds.contains(prop.getId())){
                propertyService.delete(prop.getId());
            }
        }
        Product updateProduct = productDAO.save(product);
        for(Property p : product.getProductProperties()){
            p.setProduct(updateProduct);
        }

        propertyService.create(product.getProductProperties());


        return updateProduct;
    }

    public void deleteById(Integer id) throws ProductNotFoundException{
        //productDAO.deleteById(id);
        try{
            Product delProduct = findById(id);
            delProduct.setDeleted(true);
            productDAO.save(delProduct);

        }
        catch(ProductNotFoundException e){
            throw e;
        }

    }

    private List<Integer> getIds(final List<Property> dummyList)
    {
        List<Integer> ids = new ArrayList<Integer>();
        for(Property dummy: dummyList){
            ids.add(dummy.getId());
        }
        return ids;
    }
}
